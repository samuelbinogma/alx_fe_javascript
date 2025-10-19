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

function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

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

function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const category = document.getElementById('newQuoteCategory').value;
    
    if (quoteText && category) {
        quotes.push({ text: quoteText, category: category });
        saveQuotes(); // Save to local storage
        
        // Clear inputs
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        
        // Update dropdown and show new quote
        updateCategoryDropdown();
        showRandomQuote();
    } else {
        alert('Please enter both a quote and category');
    }
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
});

