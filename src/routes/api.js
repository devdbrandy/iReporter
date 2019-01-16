import express from 'express';
import { check, checkSchema } from 'express-validator/check';

/* Controllers */
import {
  RecordsController,
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

/* Shorthand validators */
const validateIdParam = () => check('id').isInt().withMessage("'id' must be an integer");
const validateCommentParam = () => (
  check('comment')
    .isLength({ min: 10 })
    .withMessage('Comment should be atleast 10 chars long')
);

/* Fetch all users */
router.get('/users', authenticate, UsersController.index);

/* Fetch a specific user */
router.get('/users/:id', [
  validateIdParam(),
  validateRequest,
  authenticate,
], UsersController.show);

/* Fetch all red-flag/intervention records by user */
router.get('/users/:id/:type', [
  validateIdParam(),
  validateRequest,
  validateType,
  authenticate,
], RecordsController.index);

/* Fetch all red-flag/intervention records */
router.get('/:type', [validateType, authenticate], RecordsController.index);

/* Fetch a specific red-flag/intervention record */
router.get('/:type/:id', [
  validateIdParam(),
  validateRequest,
  validateType,
  authenticate,
], RecordsController.show);

/* Create a new red-flag/intervention record */
router.post('/:type', [
  authenticate,
  validateType,
  checkSchema(validator.record),
  validateRequest,
], RecordsController.create);

/* Update a specific red-flag/intervention record */
router.put('/:type/:id', [
  authenticate,
  validateIdParam(),
  validateRequest,
  validateType,
], RecordsController.update);

/* Update the location of a specific red-flag/intervention record */
router.patch('/:type/:id/location', [
  validateIdParam(),
  check('location').isLatLong().withMessage('Invalid coordinates'),
  validateRequest,
  validateType,
  authenticate,
], RecordsController.update);

/* Update the comment of a specific red-flag/intervention record */
router.patch('/:type/:id/comment', [
  validateIdParam(),
  validateCommentParam(),
  validateRequest,
  validateType,
  authenticate,
], RecordsController.update);

/* Delete a specific red-flag/intervention record */
router.delete('/:type/:id', [
  validateIdParam(),
  validateRequest,
  validateType,
  authenticate,
], RecordsController.destroy);

export default router;
