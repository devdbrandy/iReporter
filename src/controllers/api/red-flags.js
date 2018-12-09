import createError from 'http-errors';
import { Record } from '../../models';

export default class RedFlagsController {
  /**
   * Fetch all red-flag records
   *
   * @static
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static index(req, res, next) {
    res.status(200)
      .json({
        status: 200,
        data: Record.all(),
      });
  }

  /**
   * Fetch a specific red-flag record
   *
   * @static
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static show(req, res, next) {
    const recordId = parseInt(req.params.id, 10);
    const record = Record.find(recordId);

    if (!record) return next(createError(404, 'Resource not found'));
    return res.status(200).json({
      status: 200,
      data: [record],
    });
  }

  /**
   * Create a new red-flag record
   *
   * @static
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static create(req, res, next) {
    const { user } = req;
    const data = req.body;
    data.createdBy = user.id;
    const newRecord = Record.create(data);

    return res.status(201)
      .json({
        status: 201,
        data: [
          {
            id: newRecord.id,
            message: 'Created red-flag record',
          },
        ],
      });
  }

  /**
   * Edit the comment of a specific red-flag record
   *
   * @static
   * @param {object} req Request object
   * @param {object} res Response object
   * @param {function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static update(req, res, next) {
    const { user } = req;
    const recordId = parseInt(req.params.id, 10);
    const record = Record.find(recordId);

    if (!record) return next(createError(404, 'Resource not found'));
    if (record.createdBy === user.id || user.isAdmin) {
      const data = req.body;
      const attribute = data.location ? 'location' : 'comment';
      record.update(data);

      return res.status(201)
        .json({
          status: 201,
          data: [
            {
              id: recordId,
              message: `Updated red-flag record's ${attribute}`,
            },
          ],
        });
    }

    return next(createError(403, 'Forbidden'));
  }

  /**
   * Delete a specific red-flag record
   *
   * @static
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static destroy(req, res, next) {
    const { user } = req;
    const recordId = parseInt(req.params.id, 10);
    const record = Record.find(recordId);

    if (!record) return next(createError(404, 'Resource not found'));
    if (record.createdBy === user.id || user.isAdmin) {
      Record.table = Record.table.filter(record => (
        record.id !== recordId
      ));

      return res.status(200)
        .json({
          status: 200,
          data: [
            {
              id: recordId,
              message: 'Red-flag record has been deleted',
            },
          ],
        });
    }
    return next(createError(403, 'Forbidden'));
  }
}
