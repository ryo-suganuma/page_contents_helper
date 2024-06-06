chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: 'sidepanel.html',
    enabled: true
  }).then(() => {
    console.log('Side panel options set.');
  }).catch((error) => {
    console.error('Error setting side panel options:', error);
  });

  chrome.sidePanel.open({
    tabId: tab.id
  }).then(() => {
    console.log('Side panel opened.');
  }).catch((error) => {
    console.error('Error opening side panel:', error);
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSidePanel') {
    chrome.sidePanel.setOptions({
      enabled: request.enabled
    }).then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      console.error('Error toggling side panel:', error);
      sendResponse({ success: false, error: error });
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (request.action === "saveApiKey") {
    chrome.storage.local.set({ apiKey: request.apiKey }, () => {
      sendResponse({ success: true });
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (request.action === "savePrompt") {
    chrome.storage.local.set({ prompt: request.prompt }, () => {
      sendResponse({ success: true });
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (request.action === "getPrompt") {
    chrome.storage.local.get(["prompt"], (result) => {
      sendResponse({ prompt: result.prompt });
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (request.action === "getApiKey") {
    chrome.storage.local.get(["apiKey"], (result) => {
      sendResponse({ apiKey: result.apiKey });
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (request.action === "getPageContent") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getPageContent" }, (response) => {
          if (response) {
            console.log("getPageContent OK")
            sendResponse({ content: response.content });
          } else {
            console.log("getPageContent NG")
            sendResponse({ content: '' });
          }
        });
      } else {
        console.error('No active tab found');
        sendResponse({ content: '' });
      }
    });
    return true; // Indicates that the response is sent asynchronously
  }
});

