import express from 'express';
import { checkSchema } from 'express-validator/check';

/* Controllers */
import {
  AuthController,
  RedFlagsController,
  UsersController,
} from '../controllers/api';

/* Middleware */
import { validator } from '../middleware';

const router = express.Router();

router.post('/auth', checkSchema(validator.auth), AuthController.auth);

/* Fetch all users */
router.get('/users', UsersController.index);

/* Fetch a specific user */
router.get('/users/:id', UsersController.show);

/* Create new user */
router.post('/users', checkSchema(validator.user), UsersController.create);

/* Fetch all red-flag records */
router.get('/red-flags', RedFlagsController.index);

/* Fetch a specific red-flag record */
router.get('/red-flags/:id', RedFlagsController.show);

/* Create a red-flag record */
router.post('/red-flags', checkSchema(validator.record), RedFlagsController.create);

/* Edit the location of a specific red-flag record */
router.patch('/red-flags/:id/location', RedFlagsController.updateLocation);

/* Edit the comment of a specific red-flag record */
router.patch('/red-flags/:id', RedFlagsController.update);

/* Delete a specific red-flag record */
router.delete('/red-flags/:id', RedFlagsController.destroy);

export default router;
