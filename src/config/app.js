import { env } from '../helpers';

export default {
  /*
  |---------------------------------------------------------------------
  | Application Name
  |---------------------------------------------------------------------
  | This value holds the name of the application
  |
  */
  name: env('APP_NAME', 'iReporter'),

  /*
   |---------------------------------------------------------------------
   | API Version
   |---------------------------------------------------------------------
   | This value holds the current API version number.
   |
   */
  version: env('API_VERSION', 'v1'),

  /*
  |---------------------------------------------------------------------
  | Application Environment
  |---------------------------------------------------------------------
  | This value determines the "environment" the application is currently
  | running in.
  |
  */
  env: env('NODE_ENV', 'production'),
};
