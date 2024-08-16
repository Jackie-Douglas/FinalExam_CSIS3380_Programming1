const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const URI = 'mongodb+srv://user12345:12345@cluster0.sis8we1.mongodb.net/BookDB'
mongoose.connect( URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    bookTitle: { type: String, required: true },
    bookAuthor: { type: String, required: true },
    description: { type: String },
});

const Book = mongoose.model("300376300-Jackie", bookSchema);

const router = express.Router();

app.use('/api/v1/book', router);

router.route("/")
    .get((req, res) => {
        try {
            Book.find()
                .then((books) => {
                    if (books.length == 0) { res.json("no book found") } else { res.json(books) }
                })
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.route("/:id")

    .get((req, res) => {
        try {
            Book.findById(req.params.id)
                .then((book) => { if (book == null) { res.json("no record found") } else { res.json(book) } })
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.route("/")
    .post((req, res) => {

        try {
            if (req.body.bookTitle == null || req.body.bookAuthor == null || req.body.description == null ) {
                res.json("Please submit all the fields titile and author")
            } else {
                const bookTitle = req.body.bookTitle;
                const bookAuthor = req.body.bookAuthor;
                const description = req.body.description;
                
                const newBook = new Book({
                    bookTitle,
                    bookAuthor,
                    description
                });

                newBook
                    .save()
                    .then(() => res.json("Book added!"))
                    .catch((err) => res.status(400).json("Error: " + err));
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.route("/:id")
    .put((req, res) => {
        try {
            Book.findById(req.params.id)
                .then((book) => {
                    if (book == null) { res.json("no record found") }
                    else {
                        book.bookTitle = req.body.bookTitle;
                        book.bookAuthor = req.body.bookAuthor;
                        book.description = req.body.description;

                        book
                            .save()
                            .then(() => res.json("Book updated!"))
                            .catch((err) => res.status(400).json("Error: " + err));
                    }
                })
                .catch((err) => res.status(400).json("Error: " + err));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.route("/:id")
    .delete((req, res) => {
        try {
            Book.findById(req.params.id)
                .then((book) => {
                    if (book == null) { res.json("no record found") }
                    else {
                        Book.findByIdAndDelete(req.params.id)
                            .then(() => {
                                console.log("Book test");
                                res.json("Book deleted.")
                            })
                    }
                })
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }

    });
