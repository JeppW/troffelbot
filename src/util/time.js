const moment = require('moment-timezone');

const getLocalHourFromTimestamp = (timestamp) => {
    const localTime = moment.unix(timestamp).tz(process.env.TIMEZONE);
    return parseInt(localTime.format('HH'), 10);
};

const getCurrentTime = () => {
    return moment().unix();
};

const getTodayTimestamp = () => {
    return moment.tz(process.env.TIMEZONE).startOf('day').unix();
};

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const randomDelay = async (minMinutes, maxMinutes) => {
    // convert to milliseconds
    const minMillis = minMinutes * 60 * 1000;
    const maxMillis = maxMinutes * 60 * 1000;

    // sleep for a random number of milliseconds within the defined interval
    const delayMillis = Math.floor(Math.random() * (maxMillis - minMillis + 1)) + minMillis;
    await sleep(delayMillis);
}

module.exports = {
    getLocalHourFromTimestamp,
    getCurrentTime,
    getTodayTimestamp,
    sleep,
    randomDelay
};