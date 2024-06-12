# PageContentsHelper

PageContentsHelper is a Chrome extension designed to help users get responses from ChatGPT based on the prompt input. Template strings can be used to reference content within an open page.


## Installation

1. Clone or download this repository.
   ```sh
   git clone https://github.com/ryo-suganuma/page_contents_helper.git

2. Open Chrome and navigate to the extensions management page by entering `chrome://extensions/` in the address bar.

3. Enable "Developer mode" by toggling the switch in the top right corner.

4. Click on the "Load unpacked" button and select the directory where you cloned or downloaded this repository.

## Usage

1. Click the extension icon in the Chrome extension bar.

2. In the side panel that appears on the right, click the "Help" button.

3. The extension will retrieve the content of the current web page and generate a response based on the specified prompt.

4. The response will be displayed in the side panel.

## Settings
### Setting the API Key

1. Click the settings icon (⚙) in the top right corner of the side panel.

2. In the "API Key Panel" that appears, enter your OpenAI API key and click the "Save API Key" button.

### Setting the Prompt

1. Click the prompt icon (✎) in the top right corner of the side panel.

2. In the "Prompt Management" panel that appears, enter the prompt you want to use for summarization and click the "Save Prompt" button.

## File Structure

- manifest.json - The configuration file for the extension.

- background.js - The background script for the extension.

- contentScript.js - The script that retrieves the content of the web page.

- sidepanel.html - The HTML file for the side panel.

- sidepanel.js - The JavaScript file for the side panel.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

