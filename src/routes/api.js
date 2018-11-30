import express from 'express';
import jwt from 'jsonwebtoken';
import dbStorage from '../models/mock';
import { User, Record } from '../models';
import { env } from '../helpers';

const router = express.Router();

router.post('/auth', (req, res, next) => {
  const user = dbStorage.users.filter(data => (
    data.username === req.body.username
  ))[0];

  if (!user || req.body.password !== user.password) {
    return res.status(401)
      .json({
        status: 401,
        data: {
          message: 'Unauthorized',
        },
      });
  }
  jwt.sign({ user }, env('CLIENT_SECRET_KEY'), (err, token) => {
    res.status(200)
      .json({
        status: 200,
        data: { token },
      });
  });
});

/* Fetch all users */
router.get('/users', (req, res, next) => {
  res.status(200)
    .json({
      status: 200,
      data: dbStorage.users,
    });
});

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

/* Fetch all red-flag records */
router.get('/red-flags', (req, res, next) => {
  res.status(200)
    .json({
      status: 200,
      data: dbStorage.records,
    });
});

/* Fetch a specific red-flag record. */
router.get('/red-flags/:id', (req, res, next) => {
  const recordId = parseInt(req.params.id, 10);
  const record = dbStorage.records.filter(item => (
    item.id === recordId
  ))[0];

  res.status(200).json({
    status: 200,
    data: record,
  });
});

/* Create a red-flag record. */
router.post('/red-flags', (req, res, next) => {
  const data = req.body;
  const newRecord = new Record(data);
  dbStorage.records.push(newRecord);

  res.status(201)
    .json({
      status: 201,
      data: {
        id: newRecord.id,
        message: 'Created red-flag record',
      },
    });
});

/* Edit the location of a specific red-flag record */
router.patch('/red-flags/:id/location', (req, res, next) => {
  const recordId = parseInt(req.params.id, 10);
  const data = req.body;
  const record = dbStorage.records.filter(item => (
    item.id === recordId
  ))[0];
  record.updateLocation(data);

  res.status(201)
    .json({
      status: 201,
      data: {
        id: recordId,
        message: "Updated red-flag record's location",
      },
    });
});

/* Edit the comment of a specific red-flag record */
router.patch('/red-flags/:id', (req, res, next) => {
  const recordId = parseInt(req.params.id, 10);
  const data = req.body;
  const record = dbStorage.records.filter(item => (
    item.id === recordId
  ))[0];
  record.update(data);

  res.status(201)
    .json({
      status: 201,
      data: {
        id: recordId,
        message: "Updated red-flag record's comment",
      },
    });
});

export default router;
