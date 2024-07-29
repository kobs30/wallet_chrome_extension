const walletTypesMap = {
  extension: 'EXTENSION',
  web: 'WEB',
};

const actionsMap = {
  getWalletAddress: 'getWalletAddress',
  getNativeBalance: 'getNativeBalance',
  signAndSend: 'signAndSend',
  sign: 'sign',
  send: 'send',
};

window.cycloneWallet = {
  init: (type) => {
    if (type === walletTypesMap.extension) {
    }
    if (type === walletTypesMap.web) {
    }
  },
  getWalletAddress: () => {
    return new Promise((resolve) => {
      window.postMessage({ action: actionsMap.getWalletAddress }, '*');
      window.addEventListener('message', function listener(e) {
        if (e.data.action === actionsMap.getWalletAddress && 'walletAddress' in e.data) {
          window.removeEventListener('message', listener);
          resolve(e.data.walletAddress);
        }
      });
    });
  },
  getNativeBalance: () => {
    return new Promise((resolve) => {
      window.postMessage({ action: actionsMap.getNativeBalance }, '*');
      window.addEventListener('message', function listener(e) {
        if (e.data.action === actionsMap.getNativeBalance && 'nativeBalance' in e.data) {
          window.removeEventListener('message', listener);
          resolve(e.data.nativeBalance);
        }
      });
    });
  },
  sign: (params) => {
    return new Promise((resolve, reject) => {
      window.postMessage({ action: actionsMap.sign, data: params }, '*');
      window.addEventListener('message', function listener(e) {
        if (e.data.action === actionsMap.sign && 'signature' in e.data) {
          window.removeEventListener('message', listener);
          resolve(e.data.signature);
        } else if (e.data.action === actionsMap.sign && 'error' in e.data) {
          window.removeEventListener('message', listener);
          reject(e.data.error);
        }
      });
    });
  },
  send: (params) => {
    return new Promise((resolve, reject) => {
      window.postMessage({ action: actionsMap.send, data: params }, '*');
      window.addEventListener('message', function listener(e) {
        if (
          e.data.action === actionsMap.send &&
          'status' in e.data &&
          e.data.status === 'success'
        ) {
          window.removeEventListener('message', listener);
          resolve();
        } else if (e.data.action === actionsMap.send && 'error' in e.data) {
          window.removeEventListener('message', listener);
          reject(e.data.error);
        }
      });
    });
  },
  signAndSend: (params) => {
    return new Promise((resolve, reject) => {
      window.postMessage({ action: actionsMap.signAndSend, data: params }, '*');
      window.addEventListener('message', function listener(e) {
        if (
          e.data.action === actionsMap.signAndSend &&
          'status' in e.data &&
          e.data.status === 'success'
        ) {
          window.removeEventListener('message', listener);
          resolve();
        } else if (e.data.action === actionsMap.signAndSend && 'error' in e.data) {
          window.removeEventListener('message', listener);
          reject(e.data.error);
        }
      });
    });
  },
};
