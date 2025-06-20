# Ctrl C+V: Text Snippet Saver Extension

"Ctrl C+V" is a simple yet powerful browser extension designed to help you save and quickly access frequently used text snippets. Say goodbye to repeatedly typing the same phrases, email templates, or code snippets. With a clean table interface, you can easily manage all your saved texts.

## Features

* **Add New Snippets**: Quickly create new text entries with a custom title and content.
* **Persistent Storage**: All your snippets are saved locally in your browser's storage, so they persist even after you close and reopen your browser.
* **Dedicated Copy Button**: A single click on the "Copy" button places the snippet's text directly into your clipboard.
* **Edit Functionality**: Modify existing snippets (both title and text) whenever needed.
* **Delete Functionality**: Remove unwanted snippets effortlessly.
* **Clean Table View**: Snippets are displayed in an organized table format for easy readability and management.
* **Import/Export Data**: Easily import new snippets from a CSV file or export all your existing snippets to a CSV file for backup or transfer.
* **User-Friendly Interface**: Simple and intuitive design for a smooth experience.

## Installation

This extension is currently designed to be loaded unpacked in your Chromium-based browser (Google Chrome, Brave, Microsoft Edge, etc.).

1.  **Download the Extension Files**:
    Clone this repository or download the ZIP file and extract it to a local folder (e.g., `ctrl-c-v`).

2.  **Open Extension Management**:
    * Open your browser.
    * Navigate to `chrome://extensions` (for Chrome/Brave) or `edge://extensions` (for Edge).

3.  **Enable Developer Mode**:
    * In the top right corner of the Extensions page, toggle on **"Developer mode"**.

4.  **Load Unpacked Extension**:
    * Click the **"Load unpacked"** button that appears.
    * Browse to and select the `ctrl-c-v` folder you downloaded/cloned.

Your "Ctrl C+V" extension should now appear in your list of extensions and its icon will be visible in your browser's toolbar.

## How to Use

1.  **Open the Extension**: Click the "Ctrl C+V" icon in your browser's toolbar.
2.  **Add a New Snippet**:
    * Click the **"Add New Snippet"** button.
    * Enter a descriptive **"Title"** for your snippet.
    * Paste or type your desired **"Text"** into the text area.
    * Click **"Save Snippet"**.
    * (Note: When adding or editing, the snippet list will hide to give you more focus on the input fields.)
3.  **Copy a Snippet**:
    * Simply click the **"Copy"** button next to the snippet you wish to copy.
    * The text will be automatically placed in your clipboard, ready to paste (`Ctrl+V` or `Cmd+V`).
4.  **Edit a Snippet**:
    * Click the **"Edit"** button next to the snippet.
    * Modify the title or text as needed.
    * Click **"Save Snippet"** to apply changes.
5.  **Delete a Snippet**:
    * Click the **"Delete"** button next to the snippet.
    * Confirm your action when prompted.
6.  **Import/Export Saves**:
    * **Export All**: Click the **"Export All"** button in the footer. Your entire collection of saved snippets will be downloaded as a CSV file named `CtrlCV_Snippets_Export_YYYY-MM-DD.csv`.
    * **Import Saves**: Click the **"Import Saves"** button in the footer. Select a CSV file from your computer. The extension will add new snippets from the file.
        * **CSV Format**: The CSV file should have a simple format: `Title,Text`. Each line represents one snippet.
        * **Example CSV Row**: `My Email Signature,"Regards,\nJohn Doe"`
        * **Important**: If your text contains commas (`,`) or double quotes (`"`), make sure the text field is enclosed in double quotes (e.g., `"This is a long text, with commas, inside."`). If the text itself contains double quotes, escape them by using two double quotes (e.g., `"He said ""Hello!"" to me."`).


## Credits

Developed and Maintained by [0xAntu](https://www.linkedin.com/in/0xantu/)

## Contact

If you find any issues, have questions, or would like to contribute, feel free to connect with me via [LinkedIn](https://www.linkedin.com/in/0xantu/).

## License

This project is open-source and available under the MIT License.
