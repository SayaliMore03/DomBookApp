/* script.js
   DomBookApp - admin page DOM logic
   Features:
   - Add book (title, author, category)
   - Render books as cards in a grid
   - Sort by title A→Z and Z→A
   - Filter by category
   - Delete book
   - Persist books in localStorage
*/

/* Constants */
const BOOK_IMAGE = "https://m.media-amazon.com/images/I/71ZB18P3inL._SY522_.jpg";
const STORAGE_KEY = "domBookApp_books";

/* DOM Elements */
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const categorySelect = document.getElementById("category");
const addBookBtn = document.getElementById("addBookBtn");

const sortAZBtn = document.getElementById("sortAZ");
const sortZABtn = document.getElementById("sortZA");
const filterSelect = document.getElementById("filterCategory");
const clearAllBtn = document.getElementById("clearAllBtn");

const booksGrid = document.getElementById("booksGrid");
const noBooksMsg = document.getElementById("noBooksMsg");

/* State */
let books = loadBooksFromStorage(); // array of book objects

/* Utility: load from localStorage */
function loadBooksFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse books from storage", e);
    return [];
  }
}

/* Utility: save to localStorage */
function saveBooksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

/* Create a single book object */
function createBookObject(title, author, category) {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    title: title,
    author: author,
    category: category,
    imageUrl: BOOK_IMAGE,
  };
}

/* Render books: accepts an array to render (filtered or sorted) */
function renderBooks(bookArray) {
  // Clear grid first
  booksGrid.innerHTML = "";

  if (!bookArray || bookArray.length === 0) {
    noBooksMsg.style.display = "block";
    return;
  } else {
    noBooksMsg.style.display = "none";
  }

  // Create card for each book
  bookArray.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.setAttribute("data-id", book.id);

    card.innerHTML = `
      <img src="${book.imageUrl}" alt="${escapeHtml(book.title)} cover" />
      <div class="book-meta">
        <h3 class="book-title">${escapeHtml(book.title)}</h3>
        <p class="book-author">By ${escapeHtml(book.author)}</p>
        <div class="book-category">${escapeHtml(book.category)}</div>
      </div>

      <div class="card-actions">
        <button class="small-btn complete" data-action="complete">Complete</button>
        <button class="small-btn danger" data-action="delete">Delete</button>
      </div>
    `;

    // Attach event listeners to card buttons via delegation
    const completeBtn = card.querySelector('[data-action="complete"]');
    const deleteBtn = card.querySelector('[data-action="delete"]');

    completeBtn.addEventListener("click", () => {
      toggleComplete(book.id, card);
    });

    deleteBtn.addEventListener("click", () => {
      deleteBook(book.id);
    });

    booksGrid.appendChild(card);
  });
}

/* Escape HTML to avoid injection (basic) */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* Toggle completion style (visual only) */
function toggleComplete(bookId, cardElement) {
  // Toggle a visual strike-through by adding/removing a style
  const titleEl = cardElement.querySelector(".book-title");
  if (!titleEl) return;

  const completed = titleEl.style.textDecoration === "line-through";
  if (completed) {
    titleEl.style.textDecoration = "";
    titleEl.style.color = "";
  } else {
    titleEl.style.textDecoration = "line-through";
    titleEl.style.color = "#16a34a";
  }
}

/* Delete book from state + storage and re-render based on current filter */
function deleteBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  saveBooksToStorage();
  applyCurrentView(); // re-render according to current filter/sort
}

/* Add book handler */
addBookBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const category = categorySelect.value;

  // Validation: no empty fields
  if (!title) {
    alert("Please enter a book title.");
    return;
  }
  if (!author) {
    alert("Please enter the author's name.");
    return;
  }

  const newBook = createBookObject(title, author, category);
  books.push(newBook);
  saveBooksToStorage();

  // Clear inputs
  titleInput.value = "";
  authorInput.value = "";

  // Re-render with current filters applied
  applyCurrentView();
});

/* Sorting handlers */
sortAZBtn.addEventListener("click", () => {
  books.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
  saveBooksToStorage();
  applyCurrentView();
});

sortZABtn.addEventListener("click", () => {
  books.sort((a, b) => b.title.localeCompare(a.title, undefined, { sensitivity: "base" }));
  saveBooksToStorage();
  applyCurrentView();
});

/* Filter handler */
filterSelect.addEventListener("change", () => {
  applyCurrentView();
});

/* Clear all books */
clearAllBtn.addEventListener("click", () => {
  if (!confirm("Are you sure you want to delete all books?")) return;
  books = [];
  saveBooksToStorage();
  applyCurrentView();
});

/* Compute filtered list based on current filter and render */
function applyCurrentView() {
  const filter = filterSelect.value;
  let view = [...books];

  if (filter && filter !== "All") {
    view = view.filter((b) => b.category === filter);
  }

  renderBooks(view);
}

/* Initial render on page load */
document.addEventListener("DOMContentLoaded", () => {
  applyCurrentView();
});
