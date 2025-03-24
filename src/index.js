import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import job from './crons/cron.js';

// Routes Imports
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js'
import bookRoutes from './/routes/book.routes.js'


const app = express();
const PORT = process.env.PORT || 3000; // provides default VALUE if first is FALSY(doesnt exist)



// MiddleWare - CronJobs
job.start() 
app.use(express.json())
app.use(cors());

app.get('/here', (req,res) => {
    res.send("I am here")
})

app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes);




const main = async() => {
    app.listen(PORT, () => {console.log(`http://localhost:${PORT}`)})
    connectDB();
}


main();