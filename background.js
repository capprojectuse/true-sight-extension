chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "factCheck",
    title: "Fact-check: '%s'",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "factCheck") {
    let selectedText = info.selectionText;

    fetch("http://192.241.155.25/fact-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: selectedText })
    })
    .then(response => response.json())
    .then(data => {
      let resultPageURL = `http://192.241.155.25/result?data=${encodeURIComponent(JSON.stringify(data))}`;
      chrome.tabs.create({ url: resultPageURL });
    })
    .catch(error => {
      console.error("Error sending fact-check request:", error);
    });
  }
});
