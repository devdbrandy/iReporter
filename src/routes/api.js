import express from 'express';
import dbStorage from '../models/mock';
import { User } from '../models';

const router = express.Router();

/* Create new user */
router.post('/users', (req, res, next) => {
  const data = req.body;
  const newUser = new User(data);
  dbStorage.users.push(newUser);

  res.status(201)
    .json({
      status: 201,
      data: {
        id: newUser.id,
        message: 'New user created',
      },
    });
});

/* GET list of incidents. */
router.get('/red-flags', (req, res, next) => {
  res.status(200)
    .json({
      status: 200,
      data: dbStorage.records,
    });
});

export default router;
