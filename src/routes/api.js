import { Router } from 'express';

const router = Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

export default router;
