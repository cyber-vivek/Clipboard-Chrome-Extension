document.addEventListener("copy", (e) => {
  const text = document.getSelection().toString();
  debugger;
  if(text.length) {
    chrome.runtime.sendMessage({ type: "copy-text", text });
  }
});
