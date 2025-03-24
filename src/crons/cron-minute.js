
import cron from 'cron';



const job = new cron.CronJob('* * * * *', async () => {
    try {
        console.log('Running cron job to add a weekly expense...');

        const expense = {
            amount: 150,
            description: 'Weekly expense for Friday',
            date: new Date(),
        };

        // const newExpense = new Expense(expense);
        // await newExpense.save();
    

        console.log(`Added weekly expense: $${expense.amount} - ${expense.description}`);
    } catch (error) {
        console.error('Error adding weekly expense:', error);
    }
});

// job.start();