console.log("✅ Service worker loaded");

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "testMenu",
    title: "Test Context Menu",
    contexts: ["selection"]
  });
});
