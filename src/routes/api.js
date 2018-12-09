import express from 'express';
import { check, checkSchema } from 'express-validator/check';

/* Controllers */
import {
  AuthController,
  RedFlagsController,
  UsersController,
} from '../controllers/api';

/* Middleware */
import {
  validator,
  validateRequest,
  verifyToken,
  authenticate,
} from '../middleware';

const router = express.Router();

/* Authenticate a user */
router.post('/auth', [
  checkSchema(validator.auth),
  validateRequest,
], AuthController.auth);

/* Fetch all users */
router.get('/users', UsersController.index);

/* Fetch a specific user */
router.get('/users/:id', [
  check('id').isInt(),
  validateRequest,
], UsersController.show);

/* Create new user */
router.post('/users', [
  checkSchema(validator.user),
  validateRequest,
], UsersController.create);

/* Fetch all red-flag records */
router.get('/red-flags', RedFlagsController.index);

/* Fetch a specific red-flag record */
router.get('/red-flags/:id', [
  check('id').isInt(),
  validateRequest,
], RedFlagsController.show);

/* Create a new red-flag record */
router.post('/red-flags', [
  verifyToken,
  authenticate,
  checkSchema(validator.record),
  validateRequest,
], RedFlagsController.create);
// checkSchema(validator.record)

/* Update the location of a specific red-flag record */
router.patch('/red-flags/:id/location', [
  check('id').isInt(),
  check('location').isString(),
  validateRequest,
  verifyToken,
  authenticate,
], RedFlagsController.update);

/* Update the comment of a specific red-flag record */
router.patch('/red-flags/:id/comment', [
  check('id').isInt(),
  check('comment').isString(),
  validateRequest,
  verifyToken,
  authenticate,
], RedFlagsController.update);

/* Delete a specific red-flag record */
router.delete('/red-flags/:id', [
  check('id').isInt(),
  validateRequest,
  verifyToken,
  authenticate,
], RedFlagsController.destroy);

export default router;
