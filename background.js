chrome.runtime.onInstalled.addListener(() => {
  console.log("Clipboard Manager installed!");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "copy-text") {
    chrome.storage.local.get(["clipboardHistory"], (result) => {
      const id = 'id' + new Date().toISOString();
      const history = result.clipboardHistory || [];
      history.unshift(
        {
          id,
          text: message.text
        }
        );
      chrome.storage.local.set({ clipboardHistory: history.slice(0, 50) });
    });
  }
});
