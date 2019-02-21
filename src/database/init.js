import dotenv from 'dotenv';
import { env } from '../helpers';

// Load dotenv file if NODE_ENV is not specified
if (!env('NODE_ENV')) dotenv.config();
