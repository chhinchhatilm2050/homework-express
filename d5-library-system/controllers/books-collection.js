import { database } from "../db.js";
import { ObjectId } from "mongodb";
const bookCollection = database.collection('books');
const checkObjectId = (req, res, next) => {
    if(req.params.bookId !== 24) {
        return res.status(400).json({
            success: false,
            message: "Invalid objectid"
        })
    }
    next();
}
const insterBooks = async (req, res) => {
    try {
        const books = req.body;
        if(!Array.isArray(books) || books.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of books'
            })
        }
        const result = await bookCollection.insertMany(books);
        res.status(201).json({
            success: true,
            message: 'Books insert successfully',
            data: result
        });
        console.log(`Insert ${result.insertedCount} books`);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};
const findAllBooks = async (req, res) => {
    try{
        const result = await bookCollection.find({}).toArray();
        if(result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Books not found!'
            })
        }
        console.log(`All book ${result.length} total:`);
        result.forEach((book, index) => {
            console.log(`${index + 1}, ${book.title} by ${book.author}`);
        });
        res.json({
            success: true,
            data: result
        });
    }catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const findBooksByCategory = async (req, res) => {
    try {
        const {category} = req.query;
        console.log(category)
        const result = await bookCollection.find({category: category}).toArray();
        if(result.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No book found in category ${category}`
            })
        }
        res.status(200).json({
            success: true,
            total: result.length,
            data: result
        })

    }catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const findAvailableBooks = async (req, res) =>  {
    try {
        const result = await bookCollection.find({available: {$gt: 0}}).toArray();
        if(result.length === 0) {
            return res.status(400).json({
                success: false,
                message: `Not found available book!`
            });
        }
        res.status(200).json({
            success: false,
            data: result
        })
    }catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const updateBook = async (req, res) => {
    try {
        console.log(req.params.bookId)
        const result = await bookCollection.updateOne(
            { _id: new ObjectId(req.params.bookId) },
            {
                $set: {
                    ...req.body,          
                    updatedAt: new Date()  
                }
            }
        );
        if(result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Book updated successfully!',
            data: result
        })

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export {insterBooks, bookCollection, findAllBooks, findBooksByCategory, findAvailableBooks, updateBook};
