chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    sendResponse({ content: document.body.innerText });
    return true; // Ensure the sendResponse callback is kept alive for asynchronous responses
  }
});

