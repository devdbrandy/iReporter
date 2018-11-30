import express from 'express';
import dbStorage from '../models/mock';

const router = express.Router();

/* GET list of incidents. */
router.get('/red-flags', (req, res, next) => {
  res.status(200)
    .json({
      status: 200,
      data: dbStorage.records,
    });
});

export default router;
