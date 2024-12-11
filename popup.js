let copiedToClipToast = {};
let textAlreadySaved = {};
document.addEventListener("DOMContentLoaded", () => {
  initializeToast();
  renderClipboardHistory();
  renderSavedHistory();
});

const initializeToast = () => {
  copiedToClipToast = Toastify({
    text: "Copied to clipboard",
    duration: 700,
    style: {
      background: "green",
    }
   })
   textAlreadySaved = Toastify({
    text: "Text is already saved",
    duration: 700,
    style: {
      background: "red",
    }
   })
}

const renderSavedHistory = () => {
  const savedList = document.getElementById("saved");
  savedList.innerHTML = "";
  chrome.storage.local.get(["savedHistory"], (result) => {
    const savedHistory = result.savedHistory || [];
    savedHistory.map((item, index) => {
      const newItem = document.createElement('li');
      newItem.classList.add("list-item");
      newItem.innerHTML = `<span><b>${index + 1}.</b> ${item.text}</span>`;
      const deleteIcon = document.createElement('img');
      deleteIcon.src = "./public/delete.png";
      deleteIcon.alt = "delete";
      deleteIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        handleDeleteSavedItem(index);
      });
      deleteIcon.classList.add("delete-icon");
      newItem.appendChild(deleteIcon);
      newItem.addEventListener('click', () => {
        copyTextToClipboard(item.text);
      });
      savedList.appendChild(newItem);
    }
    );
    if(!savedHistory.length) {
      savedList.innerHTML = "No saved items found";
    }
  });
}

const renderClipboardHistory = () => {
  const historyList = document.getElementById("history");
  historyList.innerHTML = "";
  chrome.storage.local.get(["clipboardHistory"], (result) => {
    const history = result.clipboardHistory || [];
    history.map((item, index) => {
      const newItem = document.createElement('li');
      newItem.innerHTML = `<span> <b>${index + 1}.</b> ${item.text}</span>`
      newItem.addEventListener('click', () => {
        copyTextToClipboard(item.text);
      });
      newItem.classList.add('list-item');
      const button = document.createElement('button');
      button.innerHTML = 'Save';
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        saveTextItem(item);
      });
      newItem.appendChild(button);
      historyList.appendChild(newItem);
    }
    );
  });
}

const saveTextItem = (item) => {
  chrome.storage.local.get(["savedHistory"], (result) => {
    const savedHistory = result.savedHistory || [];
    if (savedHistory.some((savedItem) => savedItem.id === item.id)) {
      textAlreadySaved.showToast();
      return;
    }
    savedHistory.unshift(item);
    chrome.storage.local.set({ savedHistory: savedHistory });
    renderSavedHistory();
  });
}

const copyTextToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  copiedToClipToast.showToast();
}

const handleDeleteSavedItem = (item) => {
  chrome.storage.local.get(["savedHistory"], (result) => {
    const savedHistory = result.savedHistory || [];
    savedHistory.splice(item, 1);
    chrome.storage.local.set({ savedHistory: savedHistory });
    renderSavedHistory();
  });
}
