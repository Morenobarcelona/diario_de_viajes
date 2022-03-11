const { format } = require('date-fns');

function formatDate(date) {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

function getRandomValue(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

module.exports = {
  formatDate,
  getRandomValue,
};
