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
      console.error('Error getting wallet address:', error);
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
      console.error('Error getting native balance:', error);
    }
  }
});

window.postMessage({ action: actionsMap.ready }, '*');
