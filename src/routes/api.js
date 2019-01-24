import express from 'express';
import { check, checkSchema } from 'express-validator/check';

/* Controllers */
import {
  RecordsController,
  UsersController,
} from '../controllers';

/* Middleware */
import {
  validator,
  validateRequest,
  validateType,
  authenticate,
  isAdmin,
} from '../middleware';

const router = express.Router();

/* Shorthand validators */
const validateIdParam = () => check('id').isInt().withMessage("'id' must be an integer");
const validateCommentParam = () => (
  check('comment')
    .isLength({ min: 10 })
    .withMessage('Comment should be atleast 10 chars long')
);

/* Authenticated user profile info */
router.get('/me', authenticate, (request, response) => {
  const { user } = request;
  response.json({ user });
});

/* Fetch all users */
router.get('/users', authenticate, UsersController.index);

/* Fetch a specific user */
router.get('/users/:id', [
  authenticate,
  validateIdParam(),
  validateRequest,
], UsersController.show);

/* Create a new user */
router.post('/users', [
  authenticate,
  isAdmin,
  checkSchema(validator.signup),
  validateRequest,
], UsersController.create);

/* Update a specific red-flag/intervention record */
router.put('/users/:id', [
  authenticate,
  validateIdParam(),
  checkSchema(validator.user),
  validateRequest,
], UsersController.update);

/* Fetch all red-flag/intervention records by user */
router.get('/users/:id/records', [
  authenticate,
  validateIdParam(),
  validateRequest,
], RecordsController.index);

/* Fetch a list of all records */
router.get('/records', [
  authenticate,
  validateRequest,
], RecordsController.index);

/* Fetch all red-flag/intervention records */
router.get('/:type', [validateType, authenticate], RecordsController.index);

/* Fetch a specific red-flag/intervention record */
router.get('/:type/:id', [
  authenticate,
  validateType,
  validateIdParam(),
  validateRequest,
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
  validateType,
  validateIdParam(),
  checkSchema(validator.record),
  validateRequest,
], RecordsController.update);

/* Update the location of a specific red-flag/intervention record */
router.patch('/:type/:id/location', [
  authenticate,
  validateType,
  validateIdParam(),
  check('location').isLatLong().withMessage('Invalid coordinates'),
  validateRequest,
], RecordsController.update);

/* Update the comment of a specific red-flag/intervention record */
router.patch('/:type/:id/comment', [
  authenticate,
  validateType,
  validateIdParam(),
  validateCommentParam(),
  validateRequest,
], RecordsController.update);

/* Update the comment of a specific red-flag record */
router.patch('/:type/:id/status', [
  authenticate,
  validateType,
  validateIdParam(),
  checkSchema(validator.recordStatus),
  validateRequest,
  isAdmin,
], RecordsController.update);

/* Delete a specific red-flag/intervention record */
router.delete('/:type/:id', [
  authenticate,
  validateType,
  validateIdParam(),
  validateRequest,
], RecordsController.destroy);

export default router;
