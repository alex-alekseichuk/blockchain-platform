/**
 * Datetime functions.
 * It can be just imported/required w/o IoC/DI,
 * because it has no dependencies.
 */
'use strict';

/**
 * Format datetime string with milliseconds from javascript Date object
 * @param {Date} date date object
 * @return {string} datetime
 */
function formatDatetimeMs(date) {
  const parts = [date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
    .map(num => num < 10 ? '0'+num : num);
  return `${date.getFullYear()}-${parts[0]}-${parts[1]} ${parts[2]}:${parts[3]}:${parts[4]}.${date.getMilliseconds()}`;
}

/**
 * Current datetime with milliseconds
 * @return {string} Current datetime with milliseconds
 */
function datetimeMs() {
  return formatDatetimeMs(new Date());
}

/**
 * Format datetime string from javascript Date object
 * @param {Date} date date object
 * @return {string} datetime
 */
function formatDatetime(date) {
  const parts = [date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
    .map(num => num < 10 ? '0'+num : num);
  return `${date.getFullYear()}-${parts[0]}-${parts[1]} ${parts[2]}:${parts[3]}:${parts[4]}`;
}

/**
 * Current datetime
 * @return {string} Current datetime
 */
function datetime() {
  return formatDatetime(new Date());
}

module.exports = {
  formatDatetimeMs,
  datetimeMs,
  formatDatetime,
  datetime,
  timestamp: () => new Date().getTime() // milliseconds
};
