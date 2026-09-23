import express from 'express'
import { Library } from './library.js';

const app = express()
app.use(express.json());

const firstLibrary = new Library();

firstLibrary.addBook("Преступление и наказание", "Фёдор Достоевский");
firstLibrary.addBook("Идиот", "Фёдор Достоевский");
firstLibrary.addBook("Война и мир", "Лев Толстой");
firstLibrary.addBook("1984", "Джордж Оруэлл");

app.get('/books', (res) => {
  res.json(firstLibrary.books);
});

app.get('/books/available', (res) => {
  res.json(firstLibrary.getAvailableBooks());
});

app.post('/books', (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) return res.status(400).json({ error: "название книги и автор должны быть заполнены!" });

  firstLibrary.addBook(title, author);

  res.status(201).json({ message: "книга добавлена!" });
});

app.delete('/books', (req, res) => {
  const { title } = req.body;
  const removedBook = firstLibrary.removeBook(title);

  if (!removedBook) return res.status(400).json({ error: "такой книги нет!" });

  res.json({ message: "книга удалена!" });
});

app.get('/books/search', (req, res) => {
  const { title } = req.query;

  if (!title) return res.status(400).json({ error: "название книги должно быть заполнено!" });

  const book = firstLibrary.findBookByTitle(title);

  if (!book) return res.status(400).json({ error: "нет такой книги!" });

  res.json(book);
});

app.post('/users', (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) return res.status(400).json({ error: 'ID и имя пользователя обязательны!' });

  const user = firstLibrary.registerUser(id, name);

  res.status(201).json({ message: 'Пользователь зарегистрирован!', user });
});

app.post('/orders', (req, res) => {
  const { userId, bookTitle } = req.body;

  if (!userId || !bookTitle) return res.status(400).json({ error: 'userId и bookTitle обязательны!' });

  const result = firstLibrary.borrowBook(userId, bookTitle);

  if (result.error) return res.status(400).json({ error: result.error });

  res.status(201).json({ message: 'Книга успешно выдана!', order: result.order });
});

app.get('/orders', (req, res) => {
  res.json(firstLibrary.orders);
});

app.post('/orders/return', (req, res) => {
  const { userId, bookTitle } = req.body;

  if (!userId || !bookTitle) return res.status(400).json({ error: 'userId и bookTitle обязательны!' });

  const result = firstLibrary.returnBook(userId, bookTitle);

  if (result.error) return res.status(400).json({ error: result.error });

  res.json({ message: 'Книга успешно возвращена в библиотеку!' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
});