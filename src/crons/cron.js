// CRON JOB explanation;
// Cron jobs are scheduled tasks that run periodically at fixed intervals
// want to send a GET request for every 14 minutes

// Define a schedule 
// - through using a cron expression, consist of 5 fields
// MINUTE , HOUR , DAY of MONTH, MONTH , DAY of WEEK
//
// EXAMPLES
// * -> 14 * * * * = Every 14 minutes
// * -> 0 0 * * 0 = Midnight on every sunday
// * -> 30 3 15 * * = At 3.30 am , on 15 of every month
// * -> 0 0 1 1 * = At MIDNIGHT on JAN 1rst
// * -> 0 * * * * = Every Hour

import cron from 'cron';
import http from 'http';

// const job = new cron.CronJob('*/14 * * * *', function() {
const job = new cron.CronJob('* * * * *', function() {
    http
        .get(process.env.API_URL, (res) => {
            if(res.statusCode ===  200) console.log('GET REQUEST succesful')
            else console.log('GET REQUEST failed', res.statusCode);
        })
        .on('error', (e) => console.error('ERROR while sending request: ', e));
});



export default job;