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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const currentDomain = new URL(sender.url).hostname;
  console.log(request);
  chrome.storage.local.get('whitelist', function (result) {
    const whitelist = result.whitelist || [];

    switch (request.action) {
      case actionsMap.getWalletAddress:
      case actionsMap.getNativeBalance:
        isValidWalletApi(currentDomain, whitelist, request, sendResponse);
        return true;
      case 'VAULT_PASSWORD_CHANGE':
        isAuth = request.password;
        nativeBalance = request.nativeBalance;
        sendResponse({ status: 'Password changed' });
        return true;
    }
  });
  return true;
});

function checkWhitelist(currentDomain, whitelist) {
  return whitelist.includes(currentDomain);
}

function confirmWhitelistPopup(currentDomain, request, sendResponse, whitelist) {
  if (!isPopupOpen) {
    isPopupOpen = true;
    console.log('Opening whitelist popup');
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
                  handleWalletAddressRequest(request, sendResponse);
                });
              } else {
                sendResponse({ error: 'User denied the request' });
                isPopupOpen = false;
              }
              chrome.runtime.onMessage.removeListener(confirmListener);
              chrome.windows.remove(window.id, () => {
                console.log('Whitelist popup closed');
              });
            }
          };

          chrome.runtime.onMessage.addListener(confirmListener);
        }
      );
    });
  } else {
    console.log('Popup is already open for whitelisting');
  }
}

function isValidWalletApi(currentDomain, whitelist, request, sendResponse) {
  if (checkWhitelist(currentDomain, whitelist)) {
    handleWalletAddressRequest(request, sendResponse);
  } else {
    confirmWhitelistPopup(currentDomain, request, sendResponse, whitelist);
  }
}

function handleWalletAddressRequest(request, sendResponse) {
  console.log(isAuth, isWalletPopupOpen);
  if (isAuth) {
    if (request.action === actionsMap.getWalletAddress) {
      chrome.storage.local.get('activeAddress', (items) => {
        sendResponse({ walletAddress: items.activeAddress });
      });
    } else if (request.action === actionsMap.getNativeBalance) {
      sendResponse({ nativeBalance });
    }
  } else {
    if (request.action === actionsMap.getWalletAddress) {
      sendResponse({ walletAddress: '' });
    } else if (request.action === actionsMap.getNativeBalance) {
      sendResponse({ nativeBalance: '' });
    }
    if (!isWalletPopupOpen) {
      isWalletPopupOpen = true;
      console.log('Opening wallet popup');
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
                console.log('Wallet popup closed');
                chrome.windows.onRemoved.removeListener(windowRemovedListener);
              }
            });
          }
        );
      });
    } else {
      console.log('Popup is already open for getWalletAddress');
    }
  }
}
