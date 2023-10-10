const fs = require('fs');
const CronJob = require('cron').CronJob;

// schedule all the jobs defined in /src/jobs
const scheduleJobs = (client) => {
    const jobFiles = fs.readdirSync('./src/jobs').filter(file => file.endsWith('.js'));
  
    for (const file of jobFiles) {
        const job = require(`../jobs/${file}`);
        new CronJob(job.schedule, () => {
            job.execute(client)
        }, null, true, process.env.TIMEZONE);
    }
};

module.exports = scheduleJobs;