import express from 'express';
import { check, checkSchema } from 'express-validator/check';

/* Controllers */
import {
  RedFlagsController,
  UsersController,
} from '../controllers/api';

/* Middleware */
import {
  validator,
  validateRequest,
  validateType,
  authenticate,
} from '../middleware';

const router = express.Router();

/* Handy validator */
const validateIdParam = () => check('id').isInt().withMessage("'id' must be an integer");
const validateStringParam = (param) => {
  return check(param).isString().withMessage(`'${param}' must be a string`);
};

/* Fetch all users */
router.get('/users', authenticate, UsersController.index);

/* Fetch a specific user */
router.get('/users/:id', [
  validateIdParam(),
  validateRequest,
  authenticate,
], UsersController.show);

/* Fetch all red-flag records */
router.get('/:type', validateType, RedFlagsController.index);

/* Fetch a specific red-flag record */
router.get('/:type/:id', [
  validateIdParam(),
  validateRequest,
  validateType,
  authenticate,
], RedFlagsController.show);

/* Create a new red-flag record */
router.post('/:type', [
  checkSchema(validator.record),
  validateRequest,
  validateType,
  authenticate,
], RedFlagsController.create);

/* Update the location of a specific red-flag record */
router.patch('/:type/:id/location', [
  validateIdParam(),
  validateStringParam('location'),
  validateRequest,
  validateType,
  authenticate,
], RedFlagsController.update);

/* Update the comment of a specific red-flag record */
router.patch('/:type/:id/comment', [
  validateIdParam(),
  // check('comment').isString().withMessage("'comment' must be a string"),
  validateStringParam('comment'),
  validateRequest,
  validateType,
  authenticate,
], RedFlagsController.update);

/* Delete a specific red-flag record */
router.delete('/:type/:id', [
  validateIdParam(),
  validateRequest,
  validateType,
  authenticate,
], RedFlagsController.destroy);

export default router;
