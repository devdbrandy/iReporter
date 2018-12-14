import { Record } from '../../models';
import { isAuthorized, responseHandler } from '../../utils/helpers';

export default class RedFlagsController {
  /**
   * Fetch all red-flag records
   *
   * @static
   * @param {Object} request Request object
   * @param {Object} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static index(request, response, next) {
    Record.all()
      .then(records => responseHandler(response, records))
      .catch(next);
  }

  /**
   * Fetch a specific red-flag record
   *
   * @static
   * @param {Object} request Request object
   * @param {Object} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static async show(request, response, next) {
    const recordId = parseInt(request.params.id, 10);

    try {
      const record = await Record.find(recordId);
      return responseHandler(response, [record]);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Create a new red-flag record
   *
   * @static
   * @param {Object} request Request object
   * @param {Object} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static create(request, response, next) {
    const { user } = request;
    const recordData = request.body;
    recordData.createdBy = user.id;

    const newRecord = new Record(recordData);
    newRecord.save()
      .then(({ id }) => {
        const data = [{ id, message: 'Created red-flag record' }];
        return responseHandler(response, data, 201);
      })
      .catch(next);
  }

  /**
   * Edit the comment of a specific red-flag record
   *
   * @static
   * @param {object} request Request object
   * @param {object} response Response object
   * @param {function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static update(request, response, next) {
    const { user } = request;
    const recordId = parseInt(request.params.id, 10);
    Record.find(recordId)
      .then((record) => {
        // validate user authorization
        isAuthorized(user, record);

        const recordData = request.body;
        const attribute = (recordData.location) ? 'location' : 'comment';
        record.update(recordData)
          .then(({ id }) => {
            const data = [{
              id,
              message: `Updated red-flag record's ${attribute}`,
            }];
            return responseHandler(response, data, 202);
          });
      })
      .catch(next);
  }

  /**
   * Delete a specific red-flag record
   *
   * @static
   * @param {Object} request Request object
   * @param {Object} response Response object
   * @param {Function} next Call to next middleware
   *
   * @memberOf RedFlagsController
   */
  static destroy(request, response, next) {
    const { user } = request;
    const recordId = parseInt(request.params.id, 10);

    Record.find(recordId)
      .then((record) => {
        record.delete()
          .then((result) => {
            const data = [{
              id: recordId,
              message: 'Red-flag record has been deleted',
            }];
            return responseHandler(response, data);
          });
      })
      .catch(next);
  }
}
