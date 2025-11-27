# DomBookApp

Small DOM-based Book Management App for Masai assignment.

## What it does

- Add books (Title, Author, Category)
- Display books as cards (image, title, author, category)
- Sort by Title A→Z and Z→A
- Filter by category (All / Fiction / Comedy / Technical)
- Delete single book or clear all books
- Persists books in `localStorage` so data survives reloads

### Book Object Format
```json
{
  "id": 123456789,
  "title": "Book Title",
  "author": "Author Name",
  "category": "Fiction",
  "imageUrl": "https://m.media-amazon.com/images/I/71ZB18P3inL._SY522_.jpg"
}
