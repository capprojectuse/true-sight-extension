chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {  
    chrome.contextMenus.create({
      id: "factCheck",
      title: "Fact-check: '%s'",
      contexts: ["selection"]
    });
  });
});

// Handle right-click selection and send POST request
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "factCheck") {
    let selectedText = info.selectionText;

    fetch("http://192.241.155.25/api/fact-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ claim: selectedText })  
    })
    .then(response => response.json())  
    .then(data => {
      if (data.redirect_url) {
        chrome.tabs.create({ url: data.redirect_url });  // Open result page
      } else {
        console.error("No redirect URL provided by the API", data);
      }
    })
    .catch(error => {
      console.error("Error sending fact-check request:", error);
    });
  }
});
