let currentListId = null;

// Capability 1: View all list titles
async function loadLists() {
    const res = await fetch('/api/lists');
    const lists = await res.json();
    const listUl = document.getElementById('list-titles');
    listUl.innerHTML = '';
    
    lists.forEach(list => {
        const li = document.createElement('li');
        li.textContent = list.Title;
        li.onclick = () => selectList(list._id, list.Title);
        listUl.appendChild(li);
    });
}

// Capability 2: Select a list to see text entries
async function selectList(id, title) {
    currentListId = id;
    document.getElementById('current-list-title').textContent = title;
    document.getElementById('entry-controls').style.display = 'block';
    
    const res = await fetch(`/api/lists/${id}`);
    const list = await res.json();
    renderEntries(list.Entries);
}

function renderEntries(entries) {
    const entryUl = document.getElementById('entry-list');
    entryUl.innerHTML = '';
    
    entries.forEach(entry => {
        const li = document.createElement('li');
        li.className = 'entry-item';
        
        // Capability 3: Update status (Checkbox)
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = entry.Status;
        checkbox.onchange = () => toggleStatus(entry._id, checkbox.checked);

        const span = document.createElement('span');
        span.textContent = entry.Text;
        if(entry.Status) span.style.textDecoration = 'line-through';

        // Capability 4: Delete individual entry
        const delBtn = document.createElement('button');
        delBtn.textContent = 'X';
        delBtn.className = 'delete-btn';
        delBtn.onclick = () => deleteEntry(entry._id);

        li.append(checkbox, span, delBtn);
        entryUl.appendChild(li);
    });
}

// Capability 5: Delete a list
async function deleteCurrentList() {
    if (!currentListId) return;
    await fetch(`/api/lists/${currentListId}`, { method: 'DELETE' });
    currentListId = null;
    document.getElementById('entry-controls').style.display = 'none';
    document.getElementById('current-list-title').textContent = 'Select a list';
    document.getElementById('entry-list').innerHTML = '';
    loadLists();
}

// Create a list
async function createList(){
    const titleInput = document.getElementById('newListTitle');
    const title = titleInput.value.trim();
    if (!title) return alert("Please enter a list title");

    await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Title: title, Entries: [] })
    });

    titleInput.value = '';
    loadLists();
}

// Create a to-do item in current list
async function addEntry() {
    const entryInput = document.getElementById('newEntryText');
    const text = entryInput.value.trim();
    if (!text || !currentListId) return;

    await fetch(`/api/lists/${currentListId}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Text: text, Status: false })
    });

    entryInput.value = '';
    refreshCurrentList();
}

// Helper Functions
async function toggleStatus(entryId, status) {
    await fetch(`/api/lists/${currentListId}/entries/${entryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: status })
    });
    selectList(currentListId, document.getElementById('current-list-title').textContent);
}
async function deleteEntry(entryId) {
    await fetch(`/api/lists/${currentListId}/entries/${entryId}`, { method: 'DELETE' });
    selectList(currentListId, document.getElementById('current-list-title').textContent);
}
function refreshCurrentList() {
    const title = document.getElementById('current-list-title').textContent;
    selectList(currentListId, title);
}

// Init list loading
loadLists();
