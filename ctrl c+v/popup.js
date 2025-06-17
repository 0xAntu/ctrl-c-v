document.addEventListener('DOMContentLoaded', loadSnippets);

const addNewBtn = document.getElementById('addNewBtn');
const newEntrySection = document.getElementById('newEntrySection');
const snippetIdInput = document.getElementById('snippetId');
const snippetTitleInput = document.getElementById('snippetTitle');
const snippetTextInput = document.getElementById('snippetText');
const saveSnippetBtn = document.getElementById('saveSnippetBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const snippetListContainer = document.getElementById('snippetListContainer');
const snippetTable = document.getElementById('snippetTable');
const snippetTableBody = snippetTable.querySelector('tbody');
const noSnippetsMessage = document.getElementById('noSnippetsMessage');

// New elements for import/export
const importSavesBtn = document.getElementById('importSavesBtn');
const csvFileInput = document.getElementById('csvFileInput');
const exportAllBtn = document.getElementById('exportAllBtn');


// --- Event Listeners ---

addNewBtn.addEventListener('click', () => {
    // Show the new entry section, clear fields
    newEntrySection.style.display = 'block';
    snippetListContainer.style.display = 'none'; // Hide table when adding/editing
    addNewBtn.style.display = 'none'; // Hide "Add New" button

    snippetIdInput.value = ''; // Clear ID for new entry
    snippetTitleInput.value = '';
    snippetTextInput.value = '';
    snippetTitleInput.focus(); // Focus on title input
});

cancelEditBtn.addEventListener('click', () => {
    newEntrySection.style.display = 'none';
    addNewBtn.style.display = 'block'; // Show "Add New" button again
    loadSnippets(); // Reload to show table again
});

saveSnippetBtn.addEventListener('click', saveSnippet);

importSavesBtn.addEventListener('click', () => {
    csvFileInput.click(); // Programmatically click the hidden file input
});

csvFileInput.addEventListener('change', importSaves); // Listen for file selection

exportAllBtn.addEventListener('click', exportAll);

// --- Functions ---

function loadSnippets() {
    chrome.storage.local.get(['snippets'], function(result) {
        const snippets = result.snippets || {};
        displaySnippets(snippets);
    });
}

function displaySnippets(snippets) {
    snippetTableBody.innerHTML = ''; // Clear current table body
    const snippetKeys = Object.keys(snippets).sort((a, b) => {
        // Optional: Sort by title or by timestamp if you add one
        return snippets[a].title.localeCompare(snippets[b].title);
    });

    if (snippetKeys.length === 0) {
        noSnippetsMessage.style.display = 'block';
        snippetTable.style.display = 'none'; // Hide table if no snippets
    } else {
        noSnippetsMessage.style.display = 'none';
        snippetTable.style.display = 'table'; // Show table if snippets exist
        snippetKeys.forEach(id => {
            const snippet = snippets[id];
            const row = document.createElement('tr'); // Create a table row

            const titleCell = document.createElement('td'); // Create title cell
            const titleSpan = document.createElement('span'); // Use a span for title
            titleSpan.className = 'snippet-title';
            titleSpan.textContent = escapeHTML(snippet.title);
            titleCell.appendChild(titleSpan);

            const actionsCell = document.createElement('td'); // Create actions cell
            actionsCell.className = 'snippet-actions';

            // --- New Copy Button ---
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.dataset.id = id;
            copyBtn.textContent = 'Copy';
            copyBtn.addEventListener('click', copySnippet);
            actionsCell.appendChild(copyBtn);

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.dataset.id = id;
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', editSnippet);
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.dataset.id = id;
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', deleteSnippet);
            actionsCell.appendChild(deleteBtn);

            row.appendChild(titleCell);
            row.appendChild(actionsCell);
            snippetTableBody.appendChild(row); // Add row to table body
        });
    }
    // Ensure snippetListContainer is visible if we're done editing/adding
    if (newEntrySection.style.display === 'none') {
        snippetListContainer.style.display = 'block';
    }
}

function saveSnippet() {
    const id = snippetIdInput.value || Date.now().toString(); // Use existing ID or generate new timestamp ID
    const title = snippetTitleInput.value.trim();
    const text = snippetTextInput.value.trim();

    if (!title || !text) {
        alert('Please enter both a title and text for the snippet.');
        return;
    }

    chrome.storage.local.get(['snippets'], function(result) {
        const snippets = result.snippets || {};
        snippets[id] = { title: title, text: text };

        chrome.storage.local.set({ snippets: snippets }, function() {
            newEntrySection.style.display = 'none'; // Hide the entry section
            addNewBtn.style.display = 'block'; // Show "Add New" button
            loadSnippets(); // Reload and display all snippets (will also show table)
        });
    });
}

function copySnippet(event) {
    const id = event.target.dataset.id;
    chrome.storage.local.get(['snippets'], function(result) {
        const snippets = result.snippets || {};
        const snippetText = snippets[id] ? snippets[id].text : null;

        if (snippetText) {
            navigator.clipboard.writeText(snippetText)
                .then(() => {
                    const originalText = event.target.textContent;
                    event.target.textContent = 'Copied!';
                    setTimeout(() => {
                        event.target.textContent = originalText; // Revert text after a short delay
                    }, 800);
                })
                .catch(err => {
                    console.error('Failed to copy text:', err);
                    alert('Failed to copy text. Please try again.');
                });
        } else {
            console.error('Snippet not found for ID:', id);
        }
    });
}

function editSnippet(event) {
    const id = event.target.dataset.id;
    chrome.storage.local.get(['snippets'], function(result) {
        const snippets = result.snippets || {};
        const snippet = snippets[id];

        if (snippet) {
            snippetIdInput.value = id;
            snippetTitleInput.value = snippet.title;
            snippetTextInput.value = snippet.text;
            newEntrySection.style.display = 'block';
            snippetListContainer.style.display = 'none'; // Hide table when editing
            addNewBtn.style.display = 'none';
            snippetTitleInput.focus();
        }
    });
}

function deleteSnippet(event) {
    const id = event.target.dataset.id;
    if (confirm('Are you sure you want to delete this snippet?')) {
        chrome.storage.local.get(['snippets'], function(result) {
            const snippets = result.snippets || {};
            delete snippets[id]; // Remove the snippet

            chrome.storage.local.set({ snippets: snippets }, function() {
                loadSnippets(); // Reload the list
            });
        });
    }
}

// --- New Import/Export Functions ---

function importSaves(event) {
    const file = event.target.files[0];
    if (!file) {
        return; // No file selected
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const csvContent = e.target.result;
        parseCSVAndImport(csvContent);
    };
    reader.readAsText(file);
    // Clear the file input value so that the same file can be selected again
    event.target.value = '';
}

function parseCSVAndImport(csvContent) {
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== ''); // Split by line, remove empty
    if (lines.length === 0) {
        alert('No valid data found in the CSV file.');
        return;
    }

    let newSnippets = {};
    const headerSkipped = false; // Set to true if your CSV has a header row like "Title,Text"

    lines.forEach((line, index) => {
        if (headerSkipped && index === 0) return; // Skip header row if present

        // Simple CSV parsing: split by comma. Assumes no commas within title/text
        // For more robust parsing, consider a dedicated CSV library
        const parts = line.split(',');

        if (parts.length >= 2) { // Expecting at least Title and Text
            const title = parts[0].trim();
            const text = parts.slice(1).join(',').trim(); // Join remaining parts for text

            if (title && text) { // Ensure both title and text are non-empty
                const id = Date.now().toString() + '-' + index; // Unique ID for imported snippets
                newSnippets[id] = { title: title, text: text };
            }
        }
    });

    if (Object.keys(newSnippets).length === 0) {
        alert('Could not parse any valid snippets from the CSV file. Please ensure it is in "Title,Text" format.');
        return;
    }

    chrome.storage.local.get(['snippets'], function(result) {
        const existingSnippets = result.snippets || {};
        // Merge new snippets with existing ones. New IDs prevent overwriting.
        const mergedSnippets = { ...existingSnippets, ...newSnippets };

        chrome.storage.local.set({ snippets: mergedSnippets }, function() {
            alert(`Successfully imported ${Object.keys(newSnippets).length} snippet(s)!`);
            loadSnippets(); // Reload the list to display imported snippets
        });
    });
}


function exportAll() {
    chrome.storage.local.get(['snippets'], function(result) {
        const snippets = result.snippets || {};
        const snippetKeys = Object.keys(snippets).sort((a, b) => {
            return snippets[a].title.localeCompare(snippets[b].title);
        });

        if (snippetKeys.length === 0) {
            alert('No snippets to export!');
            return;
        }

        let csvContent = 'Title,Text\n'; // CSV Header
        snippetKeys.forEach(id => {
            const snippet = snippets[id];
            // Escape double quotes in title and text, then wrap in double quotes
            const escapedTitle = `"${snippet.title.replace(/"/g, '""')}"`;
            const escapedText = `"${snippet.text.replace(/"/g, '""')}"`;
            csvContent += `${escapedTitle},${escapedText}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const filename = `CtrlCV_Snippets_Export_${new Date().toISOString().slice(0, 10)}.csv`;

        // Create a temporary link element and click it to trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // Append to body is good practice
        a.click();
        document.body.removeChild(a); // Clean up
        URL.revokeObjectURL(url); // Release the URL object
    });
}


// Helper to prevent XSS (Cross-Site Scripting) when displaying titles
function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
