export class Book {
    constructor(title, author, isBorrowed = false) {
        this.title = title;
        this.author = author;
        this.isBorrowed = isBorrowed;
    }

    toggleBorrowStatus() {
        this.isBorrowed = !this.isBorrowed;
    }
}

export class Library {
    constructor() {
        this.books = [];
        this.users = [];
        this.orders = [];
    }

    addBook(title, author) {
        const newBook = new Book(title, author);

        this.books.push(newBook);
    }

    removeBook(title) {
        const idx = this.books.findIndex(book => book.title.toLowerCase() === title.toLowerCase());

        if (idx !== -1) return this.books.splice(idx, 1)[0];
    }

    findBookByTitle(title) {
        return this.books.find(book => book.title.toLowerCase() === title.toLowerCase() || null);
    }

    getAvailableBooks() {
        return this.books.filter(book => !book.isBorrowed);
    }

    registerUser(id, name) {
        const user = new User(id, name);
        this.users.push(user);
        return user;
    }

    findUserById(id) {
        return this.users.find(u => u.id === id);
    }

    borrowBook(userId, bookTitle) {
        const user = this.findUserById(userId);
        const book = this.findBookByTitle(bookTitle);

        if (!user) return { error: 'Пользователь не найден' };
        if (!book) return { error: 'Книга не найдена' };
        if (book.isBorrowed) return { error: 'Книга уже занята' };

        book.toggleBorrowStatus();
        user.borrowedBooks.push(book);

        const order = new Order(user, book);

        this.orders.push(order);

        return { success: true, order };
    }

    returnBook(userId, bookTitle) {
        const user = this.findUserById(userId);
        const book = this.findBookByTitle(bookTitle);

        if (!user) return { error: 'Пользователь не найден' };
        if (!book) return { error: 'Книга не найдена' };

        const bookIndex = user.borrowedBooks.findIndex(b => b.title.toLowerCase() === bookTitle.toLowerCase());

        if (bookIndex === -1) return { error: 'У этого пользователя нет такой книги' };

        book.isBorrowed = false;

        user.borrowedBooks.splice(bookIndex, 1);

        this.orders = this.orders.filter(
            order => !(order.userId === userId && order.bookTitle.toLowerCase() === bookTitle.toLowerCase())
        );

        return { success: true };
    }
}

export class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.borrowedBooks = [];
    }
}

export class Order {
    constructor(user, book) {
        this.userId = user.id;
        this.bookTitle = book.title;
        this.borrowedAt = new Date();
    }
}