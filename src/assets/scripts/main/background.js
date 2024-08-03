import { wif, sign_message, verify_message } from '../components/libs.js';
import { Bitcoin } from '../components/bitcoin-lib.js';
import { sha256 } from '../components/sha256.js';

const actionsMap = {
  ready: 'ready',
  getWalletAddress: 'getWalletAddress',
  getNativeBalance: 'getNativeBalance',
  signAndSend: 'signAndSend',
  sign: 'sign',
  send: 'send',
};

let isAuth = null;
let nativeBalance = 0;
let isPopupOpen = false;
let isWalletPopupOpen = false;
let activeAccount = null;
let activeAddress = null;
let txHash = null;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const currentDomain = new URL(sender.url).hostname;
  chrome.storage.local.get('whitelist', function (result) {
    const whitelist = result.whitelist || [];

    switch (request.action) {
      case actionsMap.getWalletAddress:
      case actionsMap.getNativeBalance:
      case actionsMap.sign:
      case actionsMap.send:
      case actionsMap.signAndSend:
        isValidTransactionsApi(currentDomain, whitelist, request, sendResponse);
        return true;
      case 'VAULT_PASSWORD_CHANGE':
        isAuth = request.password;
        nativeBalance = request.nativeBalance;
        activeAccount = request.activeAccount;
        activeAddress = request.activeAddress;
        sendResponse({ status: 'Password changed' });
        return true;
    }
  });
  return true;
});

const getSendRequest = async (activeAccount, data) => {
  const { feeCurrency } = data;

  const message = generationMessage(data);

  const sendRequest = {
    vm: '',
    hash: '',
    signature: '',
    message,
    currencyFee: feeCurrency === 'native' ? '' : feeCurrency,
    sender: activeAddress,
    nonce: Date.now().toString(),
  };

  const signPayload =
    sendRequest.vm +
    sendRequest.sender +
    sendRequest.message +
    sendRequest.nonce +
    sendRequest.currencyFee;

  const { sign, verify } = signRequest(activeAccount, signPayload);

  if (!verify) return Promise.reject();

  sendRequest.signature = sign;

  sendRequest.hash = await sha256(
    sendRequest.vm +
      sendRequest.signature +
      sendRequest.sender +
      sendRequest.message +
      sendRequest.nonce +
      sendRequest.currencyFee
  );

  return sendRequest;
};

function signRequest(activeAccount, signPayload) {
  const pk = new Bitcoin.ECKey(Array.from(wif.decode(activeAccount.pk).privateKey));
  const sign = sign_message(pk, signPayload, false);
  const verify = verify_message(sign, signPayload);
  return { sign, verify };
}

const generationMessage = (data) => {
  const { token, amount, to, message } = data;
  if (message) {
    return JSON.stringify({
      method: 'execute',
      message,
    });
  }
  if (token === 'native') {
    return JSON.stringify({
      method: 'execute',
      data: `transfer("${to}", ${amount * 100})`,
    });
  }
  return JSON.stringify({
    method: 'execute',
    data: `callContract("${token}", "transfer", "${to}", ${amount})`,
  });
};

function checkWhitelist(currentDomain, whitelist) {
  return whitelist.includes(currentDomain);
}

function confirmWhitelistPopup(currentDomain, request, sendResponse, whitelist) {
  if (!isPopupOpen) {
    isPopupOpen = true;
    chrome.system.display.getInfo(function (displays) {
      const display = displays[0];
      const screenWidth = display.workArea.width;
      const screenHeight = display.workArea.height;

      const windowWidth = 400;
      const windowHeight = 300;

      const left = screenWidth - windowWidth;
      const top = 70;

      chrome.windows.create(
        {
          url: chrome.runtime.getURL('confirm-whitelist.html'),
          type: 'popup',
          focused: true,
          width: windowWidth,
          height: windowHeight,
          left: left,
          top: top,
        },
        function (window) {
          const confirmListener = function (confirmRequest, confirmSender, confirmSendResponse) {
            if (confirmRequest.action === 'CONFIRM_PERMISSION') {
              if (confirmRequest.confirmed) {
                whitelist.push(currentDomain);
                chrome.storage.local.set({ whitelist: whitelist }, () => {
                  isPopupOpen = false;
                  handleTransactionsRequest(request, sendResponse);
                });
              } else {
                sendResponse({ error: 'User denied the request' });
                isPopupOpen = false;
              }
              chrome.runtime.onMessage.removeListener(confirmListener);
              chrome.windows.remove(window.id, () => {
                isPopupOpen = false;
              });
            }
          };
          chrome.windows.onRemoved.addListener(function (windowId) {
            if (windowId === window.id) {
              isPopupOpen = false;
              chrome.runtime.onMessage.removeListener(confirmListener);
            }
          });

          chrome.runtime.onMessage.addListener(confirmListener);
        }
      );
    });
  }
}

function isValidTransactionsApi(currentDomain, whitelist, request, sendResponse) {
  if (checkWhitelist(currentDomain, whitelist)) {
    handleTransactionsRequest(request, sendResponse);
  } else {
    confirmWhitelistPopup(currentDomain, request, sendResponse, whitelist);
  }
}

function extractValue(jsonString) {
  try {
    const obj = JSON.parse(jsonString);
    const dataString = obj.data;

    const regex = /,\s*(\d+)\s*\)$/;
    const match = dataString.match(regex);

    if (match && match[1]) {
      return parseInt(match[1], 10) / 100;
    } else {
      throw new Error('Number not found in the data string');
    }
  } catch (e) {
    console.error('Invalid JSON or number not found:', e);
    return null;
  }
}

async function handleTransactionsRequest(request, sendResponse) {
  if (isAuth) {
    if (request.action === actionsMap.getWalletAddress) {
      chrome.storage.local.get('activeAddress', (items) => {
        sendResponse({ walletAddress: items.activeAddress });
      });
    } else if (request.action === actionsMap.getNativeBalance) {
      sendResponse({ nativeBalance });
    } else if (request.action === actionsMap.sign) {
      if (activeAccount && request.data) {
        const sendRequest = await getSendRequest(activeAccount, request.data);
        sendResponse({ signature: sendRequest });
      } else {
        sendResponse({ status: 'No active account or message text' });
      }
    } else if (request.action === actionsMap.send) {
      if (extractValue(request.data.message) > nativeBalance)
        return sendResponse({ status: 'You dont have enough tokens' });
      if (!isWalletPopupOpen) {
        isWalletPopupOpen = true;

        chrome.system.display.getInfo(function (displays) {
          const display = displays[0];
          const screenWidth = display.workArea.width;
          const screenHeight = display.workArea.height;

          const windowWidth = 360;
          const windowHeight = 650;

          const left = screenWidth - windowWidth;
          const top = 70;
          chrome.windows.create(
            {
              url: chrome.runtime.getURL('index.html#/send?popup=true'),
              type: 'popup',
              focused: true,
              width: windowWidth,
              height: windowHeight,
              left: left,
              top: top,
            },
            function (window) {
              setTimeout(() => {
                chrome.runtime.sendMessage({
                  action: 'SEND_TRANSACTION',
                  data: request.data,
                });
              }, 1000);
              sendResponse({ status: 'Popup opened', windowId: window.id });
              chrome.windows.onRemoved.addListener(function windowRemovedListener(windowId) {
                if (windowId === window.id) {
                  isWalletPopupOpen = false;
                  chrome.windows.onRemoved.removeListener(windowRemovedListener);
                }
              });
            }
          );
        });
      }
    } else if (request.action === actionsMap.signAndSend) {
      if (request.data.amount > nativeBalance)
        return sendResponse({ message: 'You dont have enough tokens' });
      if (!isWalletPopupOpen) {
        isWalletPopupOpen = true;
        chrome.system.display.getInfo(function (displays) {
          const display = displays[0];
          const screenWidth = display.workArea.width;
          const screenHeight = display.workArea.height;

          const windowWidth = 360;
          const windowHeight = 650;

          const left = screenWidth - windowWidth;
          const top = 70;
          chrome.windows.create(
            {
              url: chrome.runtime.getURL('index.html#/send?popup=true'),
              type: 'popup',
              focused: true,
              width: windowWidth,
              height: windowHeight,
              left: left,
              top: top,
            },
            function (window) {
              setTimeout(() => {
                chrome.runtime.sendMessage({
                  action: 'SIGN_AND_SEND_TRANSACTION',
                  data: request.data,
                });
              }, 1000);
              sendResponse(true);
              chrome.windows.onRemoved.addListener(function windowRemovedListener(windowId) {
                if (windowId === window.id) {
                  isWalletPopupOpen = false;
                  chrome.windows.onRemoved.removeListener(windowRemovedListener);
                }
              });
            }
          );
        });
      }
    }
  } else {
    if (request.action === actionsMap.getWalletAddress) {
      sendResponse({ walletAddress: '' });
    } else if (request.action === actionsMap.getNativeBalance) {
      sendResponse({ nativeBalance: '' });
    }
    if (!isWalletPopupOpen) {
      isWalletPopupOpen = true;
      chrome.system.display.getInfo(function (displays) {
        const display = displays[0];
        const screenWidth = display.workArea.width;
        const screenHeight = display.workArea.height;

        const windowWidth = 360;
        const windowHeight = 650;

        const left = screenWidth - windowWidth;
        const top = 70;
        chrome.windows.create(
          {
            url: chrome.runtime.getURL('index.html?popup=true'),
            type: 'popup',
            focused: true,
            width: windowWidth,
            height: windowHeight,
            left: left,
            top: top,
          },
          function (window) {
            sendResponse({ status: 'Popup opened', windowId: window.id });
            chrome.windows.onRemoved.addListener(function windowRemovedListener(windowId) {
              if (windowId === window.id) {
                isWalletPopupOpen = false;
                chrome.windows.onRemoved.removeListener(windowRemovedListener);
              }
            });
          }
        );
      });
    }
  }
}
