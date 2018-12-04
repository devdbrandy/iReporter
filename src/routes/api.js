import express from 'express';
import { check, checkSchema } from 'express-validator/check';

/* Controllers */
import {
  AuthController,
  RedFlagsController,
  UsersController,
} from '../controllers/api';

/* Middleware */
import { validator, verifyToken } from '../middleware';

const router = express.Router();

/* Authenticate a user */
router.post('/auth', checkSchema(validator.auth), AuthController.auth);

/* Fetch all users */
router.get('/users', UsersController.index);

/* Fetch a specific user */
router.get('/users/:id', check('id').isInt(), UsersController.show);

/* Create new user */
router.post('/users', checkSchema(validator.user), UsersController.create);

/* Fetch all red-flag records */
router.get('/red-flags', RedFlagsController.index);

/* Fetch a specific red-flag record */
router.get('/red-flags/:id', check('id').isInt(), RedFlagsController.show);

/* Create a red-flag record */
router.post('/red-flags', [verifyToken, checkSchema(validator.record)], RedFlagsController.create);
// checkSchema(validator.record)

/* Edit the location of a specific red-flag record */
router.patch('/red-flags/:id/location', check('id').isInt(), RedFlagsController.updateLocation);

/* Edit the comment of a specific red-flag record */
router.patch('/red-flags/:id', [check('id').isInt(), verifyToken], RedFlagsController.update);

/* Delete a specific red-flag record */
router.delete('/red-flags/:id', [check('id').isInt(), verifyToken], RedFlagsController.destroy);

export default router;
