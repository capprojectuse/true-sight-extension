chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => { 
    chrome.contextMenus.create({
      id: "factCheck",
      title: "Fact-check: '%s'",
      contexts: ["selection"]
    });
  });
});

// Handle click event on the right-click menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "factCheck") {
    let selectedText = info.selectionText;

    fetch("http://127.0.0.1:5000/fact-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ claim: selectedText }) 
    })
    .then(response => {
      console.log("Raw response:", response);
      return response.text();
    })
    .then(text => {
      console.log("Response text:", text);

      let data;
      try {
        data = JSON.parse(text);  
      } catch (error) {
        console.error("Error: API did not return valid JSON. Response was:", text);
        return;
      }

      let resultPageURL = `http://127.0.0.1:5000/result?data=${encodeURIComponent(JSON.stringify(data))}`;
      chrome.tabs.create({ url: resultPageURL });
    })
    .catch(error => {
      console.error("Error sending fact-check request:", error);
    });
  }
});
