const { nanoid } = require("nanoid");
const books = require("./books");

const saveBook = (request, h) => {
  const id = nanoid(16);
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  let finished = false;
  pageCount === readPage ? (finished = true) : (finished = false);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllBooks = (request) => {
  const { name } = request.query;
  const { reading } = request.query;
  const { finished } = request.query;
  let result;
  if (name) {
    result = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
    return {
      status: "success",
      data: {
        books: result.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    };
  }
  if (reading === "1") {
    result = books.filter((book) => book.reading === true);
    return {
      status: "success",
      data: {
        books: result.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    };
  } else if (reading === "0") {
    result = books.filter((book) => book.reading === false);
    return {
      status: "success",
      data: {
        books: result.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    };
  }
  if (finished === "1") {
    result = books.filter((book) => book.finished === true);
    return {
      status: "success",
      data: {
        books: result.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    };
  } else if (finished === "0") {
    result = books.filter((book) => book.finished === false);
    return {
      status: "success",
      data: {
        books: result.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    };
  }
  return {
    status: "success",
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };
};

const getBookById = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return { status: "success", data: { book } };
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookById = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  saveBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
