const { BadRequestError } = require('./BadRequestError');
const { ConflictError } = require('./ConflictError');
const { NotFoundError } = require('./NotFoundError');
const { UnauthorizedError } = require('./UnauthorizedError');
const { ForbiddenError } = require('./ForbiddenError');

module.exports = {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
};
