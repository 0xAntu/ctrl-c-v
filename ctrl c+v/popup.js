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

// Helper to prevent XSS (Cross-Site Scripting) when displaying titles
function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}