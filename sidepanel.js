document.addEventListener('DOMContentLoaded', () => {
  const chatPanel = document.getElementById('chat-side-panel');
  const apiPanel = document.getElementById('api-key-panel');
  const promptPanel = document.getElementById('prompt-panel');

  const chatContent = document.getElementById('chat-content');
  const helpButton = document.getElementById('help-button');
  const settingsButton = document.getElementById('settings-button');
  const promptButton = document.getElementById('prompt-button');
  const backButton = document.getElementById('back-to-chat');
  const closeApiButton = document.getElementById('close-api-panel');
  const backPromptButton = document.getElementById('back-to-chat-from-prompt');
  const closePromptButton = document.getElementById('close-prompt-panel');
  const saveApiKeyButton = document.getElementById('save-api-key');
  const apiKeyInput = document.getElementById('api-key-input');
  const savePromptButton = document.getElementById('save-prompt');
  const promptInput = document.getElementById('prompt-input');

  const apiKeyMessage = document.getElementById('api-key-message');
  const promptMessage = document.getElementById('prompt-message');

  const showMessage = (element, message, isSuccess) => {
    element.textContent = message;
    element.className = `message ${isSuccess ? 'success' : 'error'}`;
    element.style.display = 'block';
    setTimeout(() => {
      element.classList.add('fade-out');
      setTimeout(() => {
        element.style.display = 'none';
        element.classList.remove('fade-out');
      }, 500); // Align this with the fade-out duration
    }, 700); // Start fade-out after 0.7 seconds
  };

  const showCopyTooltip = (button, message) => {
    const tooltip = document.createElement('div');
    tooltip.classList.add('copy-tooltip');
    tooltip.textContent = message;
    button.appendChild(tooltip);
    setTimeout(() => {
      tooltip.classList.add('fade-out');
      setTimeout(() => {
        button.removeChild(tooltip);
      }, 500); // Align this with the fade-out duration
    }, 700); // Start fade-out after 0.7 seconds
  };

  const loadInitialMessage = (content, isFetching = false) => {
    const message = document.createElement('div');
    message.classList.add('mb-4', 'p-2', 'rounded', 'relative');
    message.style.backgroundColor = 'white';

    const text = document.createElement('span');
    text.innerText = content;

    if (isFetching) {
      const loadingDots = document.createElement('div');
      loadingDots.classList.add('dot-flashing');
      loadingDots.innerHTML = '<div></div><div></div><div></div>';
      message.appendChild(loadingDots);
    } else {
      const copyButton = document.createElement('button');
      copyButton.classList.add('copy-button');
      copyButton.innerHTML = '<i class="fas fa-copy"></i>';
      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(text.innerText).then(() => {
          showCopyTooltip(copyButton, 'Text copied to clipboard');
        });
      });
      message.appendChild(copyButton);
      message.appendChild(text);
    }

    chatContent.appendChild(message);
    return message;
  };

  helpButton.addEventListener('click', () => {
    const fetchingMessage = loadInitialMessage('', true);

    chrome.runtime.sendMessage({ action: "getPrompt" }, (promptResponse) => {
      if (promptResponse && promptResponse.prompt) {
        chrome.runtime.sendMessage({ action: "getPageContent" }, (contentResponse) => {
          if (contentResponse && contentResponse.content) {
            const content = contentResponse.content;
            console.log(content); // Log the content to check if it's retrieved correctly
            const expandedPrompt = promptResponse.prompt.replace('${content}', content);

            chrome.runtime.sendMessage({ action: "getApiKey" }, (apiKeyResponse) => {
              if (apiKeyResponse && apiKeyResponse.apiKey) {
                const messages = [
                  { role: "system", content: "You are a helpful assistant designed to output Markdown." },
                  { role: "user", content: expandedPrompt }
                ];

                fetch('https://api.openai.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKeyResponse.apiKey}`
                  },
                  body: JSON.stringify({
                    model: "gpt-4o",
                    messages: messages,
                    max_tokens: 4000
                  })
                })
                .then(response => response.json())
                .then(data => {
                  chatContent.removeChild(fetchingMessage);

                  if (data.choices && data.choices.length > 0) {
                    loadInitialMessage(data.choices[0].message.content.trim());
                  } else {
                    loadInitialMessage('No response from OpenAI API.');
                  }
                })
                .catch(error => {
                  chatContent.removeChild(fetchingMessage);
                  loadInitialMessage('Error fetching summary: ' + error.message);
                });
              } else {
                chatContent.removeChild(fetchingMessage);
                loadInitialMessage('API Key not set.');
              }
            });
          } else {
            chatContent.removeChild(fetchingMessage);
            loadInitialMessage('Failed to retrieve page content. Please reload the page and try again.');
          }
        });
      } else {
        chatContent.removeChild(fetchingMessage);
        loadInitialMessage('Failed to retrieve prompt.');
      }
    });
  });

  settingsButton.addEventListener('click', () => {
    chatPanel.classList.add('hidden');
    apiPanel.classList.remove('hidden');
  });

  promptButton.addEventListener('click', () => {
    chatPanel.classList.add('hidden');
    promptPanel.classList.remove('hidden');
    chrome.runtime.sendMessage({ action: "getPrompt" }, (response) => {
      if (response && response.prompt) {
        promptInput.value = response.prompt;
      }
    });
  });

  backButton.addEventListener('click', () => {
    chatPanel.classList.remove('hidden');
    apiPanel.classList.add('hidden');
  });

  backPromptButton.addEventListener('click', () => {
    chatPanel.classList.remove('hidden');
    promptPanel.classList.add('hidden');
  });

  saveApiKeyButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value;
    if (apiKey.trim() !== '') {
      chrome.runtime.sendMessage({ action: "saveApiKey", apiKey: apiKey }, (response) => {
        if (response && response.success) {
          showMessage(apiKeyMessage, 'API Key saved', true);
          apiKeyInput.value = '';
        } else {
          showMessage(apiKeyMessage, 'Failed to save API Key', false);
        }
      });
    }
  });

  savePromptButton.addEventListener('click', () => {
    const prompt = promptInput.value;
    if (prompt.trim() !== '') {
      chrome.runtime.sendMessage({ action: "savePrompt", prompt: prompt }, (response) => {
        if (response && response.success) {
          showMessage(promptMessage, 'Prompt saved', true);
        } else {
          showMessage(promptMessage, 'Failed to save Prompt', false);
        }
      });
    }
  });
});

