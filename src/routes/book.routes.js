import express from 'express';
import Book from '../models/Book.js';
import cloudinary from '../config/cloudinary.js'
import protectRoute from '../middleware/protectRoute.js'

const router = express.Router();


router.post('/', protectRoute, async(req,res) => {
    try{
        const {title, caption, rating,image} = req.body;
        const userId = req.user?._id;

        console.log(userId);
    
        // Error Check 1 - USER login required
        if (!userId) {
          return res.status(400).json({ message: 'User is required' });
        }
    
        
        // Error Check - All fields required
        if (!image || !title || !caption || !rating) {
            return res.status(400).json({ message: "Please provide all fields" });
          }
        
        // upload image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        // save to DB
        const newBook = new Book ({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id,
        })

        await newBook.save();

        res.status(201).json(newBook)
    } catch(error) {
        console.log('Error Creating book: ', error);
        res.status(500).json({message: error.message})
        
    }
})


// pagination - infinite loading
router.get('/', protectRoute, async(req,res) => {
    // example call from react native - frontend
    // const response = await fetch("http://localhost:3000/api/books?page=1&limit=5");
    try {
        console.log('received get book request')
        // queries = page & limit
        const page = req.query.page || 1; // Page = Returned ARRAY (blocks of limit(5))
        const limit = req.query.limit || 5; // restricts the amount of books returned on the req
        const skip = (page - 1)* limit; // skips # of docs based on the calculated skip value(page * limit)

        const books = await Book.find() // descending Order (newest(first) --> oldest)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage") 
            // Populate the user field(book.user) - returns user.username/user.profileImage(so we can display it on the post)

            const totalBooks = await Book.countDocuments(); // 

        res.send({
            books,
            currentPage: page, 
            totalPages: Math.ceil(totalBooks/ limit) // math.ceil rounds up to nearest whole number
        })

    } catch(e) {
        console.error('Get books error: ', e.message)
        res.status(500).json({message: e.message})
    }
})


// get recommonded books by the logged in user - In profile page
router.get('/user', protectRoute, async(req, res) => {
    try {
        console.log('received get book request by a user')
        const books = await Book.find({ user: req.user._id}).sort({createdAt: -1})
        res.json(books)
    } catch(e) {
        console.error('DB error: ', e.message);
        res.status(500).json({message: e.meesage})
    }
});






// router delete - book.id
router.delete('/:id', protectRoute, async(req,res) => {
    try{
        console.log('received a delete request')
        const book = await Book.findById(req.params.id)

        // Check if Book exists
        if(!book) return res.status(404).json({message: 'Book not found'})

        // Check if User is creator of the book
        // toString() converts the object.Id to a string
        if(book.user.toString() !== req.user._id.toString())
            return res.status(401).json({meesage: "Unauthorized"})


        // Delete the Image from Cloudinary
        // https://res.cloudinary.com/de1rm4uto/image/upload/v1741568358/qyup61vejflxxw8igvi0.png
        if(book.image && book.image.includes('cloudinary')) {
            try{
                const publicId = book.image.split('/').pop().split(".")[0]
                // Explained
                // .split('/') --> splits the URL into an array of strings at the '/'(delimiter)
                // parts = ["https:", "", "res.cloudinary.com", "de1rm4uto", "image", "upload", "v1741568358", "qyup61vejflxxw8igvi0.png"]
               
                // .pop() --> retrieves the last segment of that array
                // filename = "qyup61vejflxxw8igvi0.png"

                // .split('.') - splits the Recent segment into another array of strings
                // filenameParts = ["qyup61vejflxxw8igvi0", "png"]
                // [0] --> grabs the 1rst element of the array 
                // publicId = "qyup61vejflxxw8igvi0"

                await cloudinary.uploader.destroy(publicId);

            } catch(e){
                console.log('Cloudinary Error: ', e.message)
            }
        }

        // Deleted the Post from the DB
        await book.deleteOne();
        res.json({message: 'Book deleted'})
    } catch(e) {
        console.log('Book Delete Error: ', e)
        res.status(500).json({message: "internal server error"})
    }
})









export default router;