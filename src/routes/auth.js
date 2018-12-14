// import express from 'express';
import Router from 'express-promise-router';
import { checkSchema } from 'express-validator/check';

/* Controllers */
import {
  AuthController,
  UsersController,
} from '../controllers/api';

/* Middleware */
import {
  validator,
  validateRequest,
} from '../middleware';

const router = Router();

/* Authenticate user */
router.post('/login', [
  checkSchema(validator.auth),
  validateRequest,
], AuthController.auth);

/* Create new user */
router.post('/signup', [
  checkSchema(validator.user),
  validateRequest,
], UsersController.create);

export default router;
