const key = require('./autorisation/credentials.json').private_key;
const SERVICE_ACCT_ID = '11680319875XXXXXXXXXX';
const CALENDAR_ID = {
  'primary': 'hackatonwcs@gmail.com',
};
const TIMEZONE = 'UTC+01:00';

module.exports.serviceAcctId = SERVICE_ACCT_ID;
module.exports.calendarId = CALENDAR_ID;
module.exports.key = key;
module.exports.timezone = TIMEZONE