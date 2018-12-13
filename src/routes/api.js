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
  authenticate,
} from '../middleware';

const router = express.Router();

/* Fetch all users */
router.get('/users', authenticate, UsersController.index);

/* Fetch a specific user */
router.get('/users/:id', [
  check('id').isInt(),
  validateRequest,
  authenticate,
], UsersController.show);

/* Fetch all red-flag records */
router.get('/red-flags', RedFlagsController.index);

/* Fetch a specific red-flag record */
router.get('/red-flags/:id', [
  check('id').isInt(),
  validateRequest,
  authenticate,
], RedFlagsController.show);

/* Create a new red-flag record */
router.post('/red-flags', [
  authenticate,
  checkSchema(validator.record),
  validateRequest,
  authenticate,
], RedFlagsController.create);

/* Update the location of a specific red-flag record */
router.patch('/red-flags/:id/location', [
  check('id').isInt(),
  check('location').isString(),
  validateRequest,
  authenticate,
], RedFlagsController.update);

/* Update the comment of a specific red-flag record */
router.patch('/red-flags/:id/comment', [
  check('id').isInt(),
  check('comment').isString(),
  validateRequest,
  authenticate,
], RedFlagsController.update);

/* Delete a specific red-flag record */
router.delete('/red-flags/:id', [
  check('id').isInt(),
  validateRequest,
  authenticate,
], RedFlagsController.destroy);

export default router;
