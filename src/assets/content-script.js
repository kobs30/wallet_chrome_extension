const actionsMap = {
  ready: 'ready',
  createWindow: 'createWindow',
  getWalletAddress: 'getWalletAddress',
  getNativeBalance: 'getNativeBalance',
  signAndSend: 'signAndSend',
  sign: 'sign',
  send: 'send',
};

const inject = function () {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('cyclone-wallet.js');
  script.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
};

inject();

window.addEventListener('message', async (e) => {
  if (e.source !== window || !e.data.action) return;

  if (e.data.action === actionsMap.getWalletAddress && !e.data.response) {
    try {
      const response = await chrome.runtime.sendMessage({ action: actionsMap.getWalletAddress });
      if (response && response.walletAddress) {
        window.postMessage(
          {
            action: actionsMap.getWalletAddress,
            walletAddress: response.walletAddress,
            response: true,
          },
          '*'
        );
      }
    } catch (error) {
      console.log('Error getting wallet address:', error);
    }
  }

  if (e.data.action === actionsMap.getNativeBalance && !e.data.response) {
    try {
      const response = await chrome.runtime.sendMessage({ action: actionsMap.getNativeBalance });

      if (response && response.nativeBalance >= 0) {
        window.postMessage(
          {
            action: actionsMap.getNativeBalance,
            nativeBalance: response.nativeBalance,
            response: true,
          },
          '*'
        );
      }
    } catch (error) {
      console.log('Error getting native balance:', error);
    }
  }

  if (e.data.action === actionsMap.sign && !e.data.response) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: actionsMap.sign,
        data: e.data.data,
      });
      if (response && response.signature) {
        window.postMessage(
          {
            action: actionsMap.sign,
            signature: response.signature,
            response: true,
          },
          '*'
        );
      }
    } catch (error) {
      console.log('Error sign:', error);
    }
  }

  if (e.data.action === actionsMap.send && !e.data.response) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: actionsMap.send,
        data: e.data.data,
      });

      if (response && response.data) {
        window.postMessage(
          {
            action: actionsMap.send,
            data: response.data,
            response: true,
          },
          '*'
        );
      }
    } catch (error) {
      console.log('Error send:', error);
    }
  }

  if (e.data.action === actionsMap.signAndSend && !e.data.response) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: actionsMap.signAndSend,
        data: e.data.data,
      });

      if (response && response.data) {
        window.postMessage(
          {
            action: actionsMap.signAndSend,
            data: response.data,
            response: true,
          },
          '*'
        );
      } else if (response && response.status) {
        window.postMessage(
          {
            action: actionsMap.signAndSend,
            status: response.status,
            response: true,
          },
          '*'
        );
      }
    } catch (error) {
      console.log('Error signAndSend:', error);
    }
  }
});

window.postMessage({ action: actionsMap.ready }, '*');
