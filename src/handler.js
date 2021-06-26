/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const books = require('./books');
const { nanoid } = require('nanoid');
const addBookHandler = (request, h) => {
    const { name, year, author, summary,
        publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    const newBook = {
        id, name, year, author, summary, publisher, pageCount,
        readPage, finished, reading, insertedAt, updatedAt,
    };
    books.push(newBook);
    const isSent = books.filter((book) => book.id === id).length > 0;
    if (isSent) {
        if (name === undefined) {
            books.pop();
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }
        if (readPage > pageCount) {
            books.pop();
            const response = h.response({
                status: 'fail',
                // eslint-disable-next-line max-len
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    };
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};
const getAllBooksHandler = (request, h) => {
    const { name } = request.query;
    if (name !== undefined) {
        const queriedBooks = books.filter((b) => b.name.toLowerCase() === name.toLowerCase());
        const response = h.response({
            status: 'success',
            data: {
                books: queriedBooks,
            },
        });
        response.code(200);
        return response;
    };
    const getBookItems = books.map((b) => {
        const {id, name, publisher} = b;
        return {id, name, publisher};
    });
    const response = h.response({
        status: 'success',
        data: {
            books: getBookItems,
        },
    });
    response.code(200);
    return response;
};
const getBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const book = books.filter((b) => b.id === bookId)[0];
    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book: book,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};
const editBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const { name, year, author, summary,
        publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;
    const index = books.findIndex((book) => book.id === bookId);
    const edittedBook = {
        ...books[index],
        name,
        year, author, summary,
        publisher, pageCount, readPage,
        finished, reading, updatedAt,
    };
    if (index !== -1) {
        if (name === undefined) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        };
        if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                // eslint-disable-next-line max-len
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        };
        books[index] = edittedBook;
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((b) => b.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
module.exports = {
    addBookHandler, getAllBooksHandler, getBookByIdHandler,
    editBookByIdHandler, deleteBookByIdHandler,
};
