import cron from 'node-cron';
import Expense from '../models/Expense.js'; // Import your Expense model
import mongoose from 'mongoose';

// Connect to your database (if not already connected)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schedule the cron job to run every Friday at midnight
cron.schedule('0 0 * * 5', async () => {
  try {
    console.log('Running cron job to add a weekly expense...');

    // Define the expense
    const expense = {
      amount: 150,
      description: 'Weekly expense for Friday',
      date: new Date(), // Current date
    };

    // Add the expense to the database
    const newExpense = new Expense(expense);
    await newExpense.save();

    console.log(`Added weekly expense: $${expense.amount} - ${expense.description}`);
  } catch (error) {
    console.error('Error adding weekly expense:', error);
  }
});


///////////////////////////////////////////////////
// SCHEMA
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model('Expense', expenseSchema);


//////////////////////////
///////////////////////////
import './src/config/cron.js';