import express from 'express';
import { checkSchema } from 'express-validator/check';

/* Controllers */
import { AuthController } from '../controllers/api';

/* Middleware */
import {
  validator,
  validateRequest,
} from '../middleware';

const router = express.Router();

/* Create new user */
router.post('/signup', [
  checkSchema(validator.user),
  validateRequest,
], AuthController.signup);

/* Authenticate user */
router.post('/login', [
  checkSchema(validator.auth),
  validateRequest,
], AuthController.login);

export default router;
