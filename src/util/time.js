const moment = require('moment-timezone');

function getLocalHourFromTimestamp(timestamp) {
  const localTime = moment.unix(timestamp).tz(process.env.TIMEZONE);
  return parseInt(localTime.format('HH'), 10);
};

function getCurrentTime() {
  return moment().unix();
};

function getTodayTimestamp() {
  return moment.tz(process.env.TIMEZONE).startOf('day').unix();
};

module.exports = {
    getLocalHourFromTimestamp,
    getCurrentTime,
    getTodayTimestamp
}