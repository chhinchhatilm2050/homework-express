import { database } from "../db.js";
import { memberCollection } from "./members-collection.js";
import { bookCollection } from "./books-collection.js";
const borrowingCollection = database.collection('borrowings');

const insertBorrowings = async (req, res) => {
    try {
        const borrowings = req.body;
        if(!Array.isArray(borrowings) || borrowings.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of borrowings!'
            })
        }

        const formattedBorrowings = await Promise.all(borrowings.map(async (b) => {
            const member = await memberCollection.findOne({ name: b.memberName });
            const book = await bookCollection.findOne({ title: b.bookTitle });
            if(!member) throw new Error(`Member "${b.memberName}" not found`);
            if(!book) throw new Error(`Book "${b.bookTitle}" not found`);

            return {
                memberId: member._id,
                bookId: book._id,
                borrowDate: new Date(b.borrowDate),
                dueDate: new Date(b.dueDate),
                returnDate: b.returnDate ? new Date(b.returnDate) : null,
                status: b.status
            };
        }));

        const result = await borrowingCollection.insertMany(formattedBorrowings);
        res.status(201).json({
            success: true,
            message: 'Borrowings inserted successfully!',
            data: result
        })

    } catch(err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

export { insertBorrowings };
