let quotes = []

function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        quotes = [
            { text:"The best way to predict the future is to invent it. - Alan Kay", category: "Motivational"},
            { text:"Life is 10% what happens to us and 90% how we react to it. - Charles R. Swindoll", category: "life"},
            { text:"Stay hungry, stay foolish.", category: "Motivation"},
        ];
    }
}
    


// Save files to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load last selected category from local storage
function loadLastCategory() {
    const lastCategory = localStorage.getItem('lastCategory');
    const categorySelect = document.getElementById('categoryFilter');
    if (lastCategory && categorySelect.querySelector(`option[value="${lastCategory}"]`)) {
        categorySelect.value = lastCategory;
        filterQuotes();
    }
}

// Save last selected category to local storage
function saveLastCategory(category) {
    localStorage.setItem('lastCategory', category);
}


function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Save last viewed quote to session storage
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
    

    // Clear previous content
    quoteDisplay.innerHTML = '';

    // create quote element
    const quoteElement = document.createElement('div');
    quoteElement.className = 'quote';
    quoteElement.style.padding = '20px';
    quoteElement.style.border = '1px solid #ccc';
    quoteElement.style.borderRadius = '5px';
    quoteElement.style.margin = '10px 0';

    // Create quote text
    const quoteText = document.createElement('p');
    quoteText.textContent = `"${quote.category}"`;
    quoteText.style.fontstyle = 'italic';

    // Create category
    const categoryText = document.createElementy('p')
    categoryText.textContent = `- ${quote.category}`;
    categoryText.style.fontWeight = 'bold';

    // Append elements
    quoteElement.appendChild(quoteText);
    quoteElement.appendChild(categoryText);
    quoteDisplay.appendChild(quoteElement);
}

function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.style.margin = '20px 0';
    
    // Create form elements
    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';
    quoteInput.style.marginRight = '20px';
    
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
    categoryInput.style.marginRight = '10px';
    
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote;
    
    // Create category dropdown
    const categorySelect = document.createElement('select');
    categorySelect.id = 'categoryFilter';
    categorySelect.style.marginRight = '10px';
    categorySelect.addEventListener('change', filterQuotes);

    // Create export button
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Quotes';
    exportButton.style.marginRight = '10px';
    exportButton.onclick = exportToJsonFile;

    // Create import file input 
    const importInput = document.createElement('input')
    importInput.id = 'importFile';
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.onchange = importFromJsonFile;
    
    // Append form elements
    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(categorySelect);
    formContainer.appendChild(addButton);
    formContainer.appendChild(exportButton);
    formContainer.appendChild(importInput);
    
    // Insert form after the quote display
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.parentNode.insertBefore(formContainer, quoteDisplay.nextSibling);
    
    updateCategoryDropdown();
}

async function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const category = document.getElementById('newQuoteCategory').value;
    
    if (quoteText && category) {
        let newQuote = { text: quoteText, category: category };

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify({
                    title: category,
                    body: quoteText,
                    userId: 1
                }),
                headers: {
                    'content-type': 'application/json; charset=UTF-8'
                }
            });
            const data = await response.json;
            newQuote.id = data.id;
        } catch (e) {
            console.error('Failed to psot to server:', e);
            // Add without id if failed
        }

        quotes.push(newQuote);
        saveQuotes(); // Save to local storage
        
        // Clear inputs
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        
        // Update dropdown and show new quote
        populateCategories();
        updateCategoryDropdown();
        showRandomQuote();
    } else {
        alert('Please enter both a quote and category');
    }
}

function populateCategories() {
    const categorySelect = document.getElementById('categoryFilter');
    categorySelect.innerHTML = '<option value="all">All Categories</option>';
    
    // Get unique categories
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // Add categories to dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    // Restore last selected category
    loadLastCategory();
}

function updateCategoryDropdown() {
    const categorySelect = document.getElementById('categoryFilter');
    categorySelect.innerHTML = '<option value="all">All Categories</option>';
    
    // Get unique categories
    const categories = [...new Set(quotes.map(quote => quote.category))];
    
    // Add categories to dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function filterQuotes() {
    const categorySelect = document.getElementById('categoryFilter');
    const selectedCategory = categorySelect.value;
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // Clear previous content
    quoteDisplay.innerHTML = '';
    
    // Filter quotes
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);
    
    // Display filtered quotes
    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.className = 'quote';
        quoteElement.style.padding = '10px';
        quoteElement.style.borderBottom = '1px solid #eee';
        
        const quoteText = document.createElement('p');
        quoteText.textContent = `"${quote.text}"`;
        quoteText.style.fontStyle = 'italic';
        
        const categoryText = document.createElement('p');
        categoryText.textContent = `- ${quote.category}`;
        categoryText.style.fontWeight = 'bold';
        
        quoteElement.appendChild(quoteText);
        quoteElement.appendChild(categoryText);
        quoteDisplay.appendChild(quoteElement);
    });
}

function exportToJsonFile() {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            // Validate that imported data is an array of objects with text and category
            if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                updateCategoryDropdown();
                showRandomQuote();
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid JSON format. Please ensure the file contains an array of quotes with text and category.');
            }
        } catch (e) {
            alert('Error parsing JSON file. Please ensure it is valid JSON.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}  

async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverData = await response.json();
        return serverData.map(s => ({ id: s.id, text: s.body, category: s.title }));
    } catch (e) {
        console.error('Failed to fetch quotes from server:', e);
        showNotification('Failed to fetch quotes from server.');
        return [];
    }
}

async function syncWithServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverData = await response.json();
        const serverQuotes = serverData.map(s => ({ id: s.id, text: s.body, category: s.title }));

        // Post local quotes without id to server
        for (let i = 0; i < quotes.length; i++) {
            if (!quotes[i].id) {
                try { 
                    const postResponse = await fetch('https://jsonplaceholder.typicode.com/posts', {
                        method: 'POST',
                        body: JSON.stringify({
                            title: quotes[i].category,
                            body: quotes[i].text,
                            userId: 1
                        }),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8'
                        }
                    });
                    const data = await postResponse.json();
                    quotes[i].id = data.id;
                } catch (e) {
                    console.log('Failed to post to server')
                }
            }
        }

        // Create map of local quotes by id
        const localMap = new Map(quotes.map(q => [q.id, q]));

        let conflicts = [];

        // Merge server quotes
        for (const s of serverQuotes) {
            const local = localMap.get(s.id);
            if (local) {
                if (local.text !== s.text || local.category !== s.category) {
                    conflicts.push({ id: s.id, local, server: s });
                }
            } else {
                quotes.push(s);
            }
        }

        // Handle conflicts
        for (const c of conflicts) {
            const useServer = confirm(`Conflict detected for quote ID ${c.id}:\nLocal: "${c.local.text}" - ${c.local.category}\nServer: "${c.server.text}" - ${c.server.category}\nClick OK to use server version, Cancel to keep local version.`);
            if (useServer) {
                c.local.text = c.server.text;
                c.local.category = c.server.category;
            }
            showNotification(`Conflict resolved for quote ID ${c.id}.`);
        }

        saveQuotes();
        populateCategories();
        showNotification('Data synced with server.');
    } catch (e) {
        console.error('Sync failed:', e);
        showNotification('Failed to sync with server.');
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.textContent = '';
        }, 5000);
    } else {
        alert(message);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    createAddQuoteForm();
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    showRandomQuote();

    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
        const quote = JSON.parse(lastQuote);
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = '';
        const quoteElement = document.createElement('div');
        quoteElement.className = 'quote';
        quoteElement.style.padding = '20px';
        quoteElement.style.border = '1px solid #ccc';
        quoteElement.style.borderRadius = '5px';
        quoteElement.style.margin = '10px 0';
        const quoteText = document.createElement('p');
        quoteText.textContent = `"${quote.text}"`;
        quoteText.style.fontStyle = 'italic';
        const categoryText = document.createElement('p');
        categoryText.textContent = `- ${quote.category}`;
        categoryText.style.fontWeight = 'bold';
        quoteElement.appendChild(quoteText);
        quoteElement.appendChild(categoryText);
        quoteDisplay.appendChild(quoteElement);
    } else {
        showRandomQuote();
    }

    // Initial sync with server
    syncWithServer();

    // Periodic sync every 60 seconds
    setInterval(syncWithServer, 60000);
});

