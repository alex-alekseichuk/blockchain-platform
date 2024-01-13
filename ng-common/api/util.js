/**
 * Pure common utils for API layer.
 * It can be just imported/required w/o IoC/DI,
 * because it has no dependencies via IoC/DI.
 *
 * @requires common.util
 */
'use strict';

const util = require('../util');

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const OK = 0;
const UNKNOWN_ERROR = 1;
const SERVER_ERROR = 2;

const enumApiErrors = errors =>
  util.createEnum([
    'OK', 'UNKNOWN_ERROR', 'SERVER_ERROR'
  ].concat(errors));


const handleResponse = (response, logger, errors) => {
  const errorHandler = errors ? errors[response.status] : null;

  if (errorHandler) {
    if (typeof errorHandler === 'function') {
      errorHandler.call(null);
      return;
    }

    // TODO: error handler is not a function

    return;
  }

  if (response.status === 0 || response.status === 500) {
    logger.error(`Server Error: ${response.message}`);
    throw new ApiError(SERVER_ERROR, response.message);
  }

  logger.error(`Unknown Error: ${response.message}`);
  throw new ApiError(UNKNOWN_ERROR, response.message);
};

module.exports = {
  ApiError,
  enumApiErrors,
  handleResponse
};
