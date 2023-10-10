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

module.exports = {
    getLocalHourFromTimestamp,
    getCurrentTime,
    getTodayTimestamp
}