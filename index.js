const express = require("express");

const app = express();

app.use(express.json());

const { initializeDatabase } = require("./db/db.connect");
const fs = require("fs");
const Book = require("./models/book.models");

initializeDatabase();

//. Create an API with route "/books" to create a new book data in the books Database. Make sure to do error handling. Test your API with Postman. Add the following book:

// const newBook = {
//   title: "Lean In",
//   author: "Sheryl Sandberg",
//   publishedYear: 2012,
//   genre: ["Non-Fiction", "Business"],
//   language: "English",
//   country: "United States",
//   rating: 4.1,
//   summary:
//     "A book about empowering women in the workplace and achieving leadership roles.",
//   coverImageUrl: "https://example.com/lean_in.jpg",
// };

async function createNewBook(newBook) {
  try {
    const book = new Book(newBook);
    const savedBook = await book.save();
    console.log(savedBook);
    return savedBook;
  } catch (error) {
    console.log(error);
  }
}

//createNewBook(newBook);

app.post("/books", async (req, res) => {
  try {
    const savedBook = await createNewBook(req.body);
    if (savedBook) {
      res
        .status(201)
        .json({ message: "Book added successfully.", savedBook: savedBook });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add book." });
  }
});

//2. Run your API and create another book data in the db.

const newBook2 = {
  title: "Shoe Dog",
  author: "Phil Knight",
  publishedYear: 2016,
  genre: ["Autobiography", "Business"],
  language: "English",
  country: "United States",
  rating: 4.5,
  summary:
    "An inspiring memoir by the co-founder of Nike, detailing the journey of building a global athletic brand.",
  coverImageUrl: "https://example.com/shoe_dog.jpg",
};

//3. Create an API to get all the books in the database as response. Make sure to do error handling.

async function readAllBooks() {
  try {
    const allBooks = await Book.find();
    if (allBooks.length != 0) {
      console.log(allBooks);
      return allBooks;
    }
  } catch (error) {
    console.log(error);
  }
}

//readAllBooks();

app.get("/books", async (req, res) => {
  try {
    const allBooks = await readAllBooks();
    if (allBooks.length != 0) {
      res
        .status(200)
        .json({ message: "All books retrieved.", allBooks: allBooks });
    } else {
      res.status(404).json({ error: "No book found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load books." });
  }
});

//4. Create an API to get a book's detail by its title. Make sure to do error handling.

async function getBookByTitle(bookTitle) {
  try {
    const bookByTitle = await Book.findOne({ title: bookTitle });
    if (bookByTitle) {
      console.log(bookByTitle);
      return bookByTitle;
    } else {
      console.log("Book not found.");
    }
  } catch (error) {
    console.log("Failed to read a book.", error);
  }
}

//getBookByTitle("Lean In");

app.get("/books/:bookTitle", async (req, res) => {
  try {
    const bookByTitle = await getBookByTitle(req.params.bookTitle);
    if (bookByTitle) {
      res.status(200).json({ message: "Book Found.", book: bookByTitle });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(404).json({ error: "Failed tom load the book." });
  }
});

//5. Create an API to get details of all the books by an author. Make sure to do error handling.

async function getBooksByAuthor(authorName) {
  try {
    const booksByAuthor = await Book.find({ author: authorName });
    if (booksByAuthor) {
      console.log("Books By author:", booksByAuthor);
      return booksByAuthor;
    } else {
      console.log("No books found.");
    }
  } catch (error) {
    console.log("Failed to load books.", error);
  }
}

//getBooksByAuthor("J.K. Rowling");

app.get("/books/authors/:authorName", async (req, res) => {
  try {
    const booksByAuthor = await getBooksByAuthor(req.params.authorName);
    if (booksByAuthor.length != 0) {
      res.status(200).json({ message: "Books by author: ", booksByAuthor });
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load books." });
  }
});

//6. Create an API to get all the books which are of "Business" genre.

async function getBooksByGenre(genreName) {
  try {
    const booksByGenre = await Book.find({ genre: genreName });
    if (booksByGenre) {
      console.log("Books By Genre:", booksByGenre);
      return booksByGenre;
    } else {
      console.log("No books found.");
    }
  } catch (error) {
    console.log("Failed to load books.", error);
  }
}

//getBooksByGenre("Fantasy");

app.get("/books/genres/:genreName", async (req, res) => {
  try {
    const booksByGenre = await getBooksByGenre(req.params.genreName);
    if (booksByGenre.length != 0) {
      res.status(200).json({ message: "Books by Genre", booksByGenre });
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load books." });
  }
});

//7. Create an API to get all the books which was released in the year 2012.
async function getBooksByReleaseYear(releaseYear) {
  try {
    const booksByReleaseYear = await Book.find({ publishedYear: releaseYear });
    if (booksByReleaseYear.length != 0) {
      console.log("Books By Release Year:", booksByReleaseYear);
      return booksByReleaseYear;
    } else {
      console.log("No books found.");
    }
  } catch (error) {
    console.log("Failed to load books.", error);
  }
}

//getBooksByReleaseYear(2012);

app.get("/books/publishedYear/:year", async (req, res) => {
  try {
    const booksByPublishedYear = await getBooksByReleaseYear(req.params.year);
    if (booksByPublishedYear.length != 0) {
      res
        .status(200)
        .json({ message: "Books by Published Year: ", booksByPublishedYear });
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load books." });
  }
});

//8. Create an API to update a book's rating with the help of its id. Update the rating of the "Lean In" from 4.1 to 4.5. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling. Updated book rating: { "rating": 4.5 }

async function updateBookById(bookId, dataToUpdate) {
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {
      new: true,
    });
    if (updatedBook) {
      console.log("Book updated successfully.", updatedBook);
      return updatedBook;
    } else {
      console.log("Book does not exist.", error);
    }
  } catch (error) {
    console.log("Failed to update the book.", error);
  }
}

//updateBookById("69f5b556903f69b99c701ed3", { rating: 4.6 });

app.post("/books/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBookById(req.params.bookId, req.body);

    if (updatedBook) {
      res.status(200).json({
        message: "Book updated successfully.",
        updatedBook: updatedBook,
      });
    } else {
      res.status(404).json({
        error: "Book does not exist.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book." });
  }
});

//9. Create an API to update a book's rating with the help of its title. Update the details of the book "Shoe Dog". Use the query .findOneAndUpdate() for this. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling. { publishedYear: 2017, rating: 4.2 }

async function updateBookByTitle(bookTitle, dataToUpdate) {
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { title: bookTitle },
      dataToUpdate,
      { returnDocument: "after" },
    );
    if (updatedBook) {
      console.log("Updated Book:", updatedBook);
      return updatedBook;
    } else {
      console.log("Book does not exist.", error);
    }
  } catch (error) {
    console.log("Failed to update the book", error);
  }
}

//updateBookByTitle("Shoe Dog", { publishedYear: 2017, rating: 4.2 });

app.post("/books/title/:bookTitle", async (req, res) => {
  try {
    const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body);
    if (updatedBook) {
      res.status(200).json({
        message: "Book updated successfully.",
        updatedBook: updatedBook,
      });
    } else {
      res.status(404).json({ error: "Book does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book." });
  }
});

//10. Create an API to delete a book with the help of a book id, Send an error message "Book not found" in case the book does not exist. Make sure to do error handling.

async function deleteBookById(bookId) {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (deletedBook) {
      console.log("Book deleted successfully.", deletedBook);
      return deletedBook;
    } else {
      console.log("Book not found");
    }
  } catch (error) {
    console.log("Failed to delete the book.");
  }
}

//deleteBookById("69f726e5ea77d9b573ec6f74");

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBookById(req.params.bookId);
    if (deletedBook) {
      res
        .status(200)
        .json({
          message: "Book deleted successfully.",
          deletedBook: deletedBook,
        });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

//res.status(200).json({ message: "Book Deleted Successfully.", deletedBook });
