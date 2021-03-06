<h1 align="center">iReporter<h1>

<p align="center">
  <a href="https://travis-ci.org/devdbrandy/iReporter.svg?branch=develop">
    <img src="https://travis-ci.org/devdbrandy/iReporter.svg?branch=develop" /></a>
  <a class="badge-align" href="https://www.codacy.com/app/devdbrandy/iReporter?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=devdbrandy/iReporter&amp;utm_campaign=Badge_Grade">
  <img src="https://api.codacy.com/project/badge/Grade/af41b75a4052458888f44cd39007295a"/></a>
  <a href="https://codeclimate.com/github/devdbrandy/iReporter/maintainability"><img src="https://api.codeclimate.com/v1/badges/d7a820f64a5fb926de6a/maintainability" /></a>
  <a href="https://codeclimate.com/github/devdbrandy/iReporter/test_coverage"><img src="https://api.codeclimate.com/v1/badges/d7a820f64a5fb926de6a/test_coverage" /></a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-brightgreen.svg"></a>
</p>

# Overview

iReporter app enables users (citizen) to bring any form of corruption to the notice of appropriate authorities and the general public. Visit iReporter live demo: [https://devdbrandy.github.io/iReporter](https://devdbrandy.github.io/iReporter).

>Demo Users
>
>| Username  | Password | Access       |
>|-----------|----------|--------------|
>| `admin`   | `secret` | Admin Access |
>| `user123` | `secret` | User Access  |

<!-- TOC depthFrom:2 -->

- [Overview](#overview)
  - [1. :rocket: Getting Started](#1-rocket-getting-started)
    - [1.1 Prerequisites](#11-prerequisites)
    - [1.2. Run locally](#12-run-locally)
    - [1.3. Building](#13-building)
    - [1.4. Test Locally](#14-test-locally)
    - [1.5. Running Test](#15-running-test)
  - [2. :lock: Authentication](#2-lock-authentication)
  - [3. API Versioning](#3-api-versioning)
  - [4. HTTP Requests](#4-http-requests)
  - [5. HTTP Response Codes](#5-http-response-codes)
  - [:bookmark: 6. Resources](#bookmark-6-resources)
    - [6.1. Authentication](#61-authentication)
    - [6.2. API Routes](#62-api-routes)
  - [7. :pencil: License](#7-pencil-license)

<!-- /TOC -->

## 1. :rocket: Getting Started

### 1.1 Prerequisites

Ensure that you have the following installed on your local machine:

- [NodeJS](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)

### 1.2. Run locally

- To run app locally, make sure you have `nodejs`, `postgres` installed.
- Clone repository or clone your own fork

  ```bash
    git clone https://github.com/devdbrandy/iReporter.git
    cd iReporter
    cp .env.example .env
    npm install
  ```

- Create a PostgreSQL database for the project via `pgAdmin` or run the below command on your terminal:

    ```bash
      createdb -h localhost -p 5432 -U postgres ireporter
    ```

- Configure `.env` environment variable with your credentials
- Run migration `npm run migrate`
- (Optional) Seed dummy data `npm run db:seed`
- Two npm scripts are availiable to spin up the app server:
  - `npm run dev` spin up the server without watching for any file changes
  - `npm run watch` watches for any file changes and reloads the server

### 1.3. Building

`npm run build`

### 1.4. Test Locally

To test or consume api locally, you can make use of [*Postman*](https://www.getpostman.com) or [*Insomnia*](https://insomnia.rest/download/)

### 1.5. Running Test

Test specs are implemented using [*mocha*](https://mochajs.org) + [*chai*](https://chiajs.com) + [*sinon*](https://sinonjs.org).

Make a duplicate of `.env` and rename to `.env.test`, then configure your test credentials.

Two npm scripts are available to run the test suite:

1. `npm run mocha` or `npm run mocha:watch` - The later watches for any file changes and runs the full test suite (without code coverage)
2. `npm test` - Performs a single full test suite run, including instanbul code coverage reporting. Summary coverage reports are written to stdout, and detailed HTML reports are available in `/coverage/index.html`

## 2. :lock: Authentication

Access to restricted API endpoints requires an access token, iReporter uses access tokens to associate API requests with your account. To obtain your access token, make a request along with `username` and `password` credentials to `https://irepot.herokuapp.com/auth/login`

**Sample Response:**

```http
POST https://irepot.herokuapp.com/auth/login
HTTP/1.1
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": 200,
  "data": [
    {
      "token": "...",
      "user": {}
    }
  ]
}
```

## 3. API Versioning

The second part of the URI specifies the API version you wish to access in the format `v{version_number}`.
For example, version 1 of the API (most current) is accessible via:

```http
  https://irepot.herokuapp.com/api/v1
```

## 4. HTTP Requests

All API requests are made by sending  asecure HTTPS request using one of the following methods, depending on the being taken:

- `POST` Create a resource
- `PATCH` Update a resource
- `GET` Get a resource or list of resources
- `DELETE` Delete a resource

For `POST` and `PATCH` requests, the body of your request may include a JSON payload.

## 5. HTTP Response Codes

Each response will be returned with one of the following HTTP status codes:

- `200` `OK` The request was successful
- `400` `Bad Request` There was a problem with the request (security, malformed)
- `401` `Unauthorized` The supplied API credentials are invalid
- `403` `Forbidden` The credentials provided do not have permissions to access the requested resource
- `404` `Not Found` An attempt was made to access a resource that does not exist in the API
- `500` `Server Error` An error on the server occurred

## :bookmark: 6. Resources

### 6.1. Authentication

  | URI                                                        | HTTP Method | Description    |
  |------------------------------------------------------------|:-----------:|----------------|
  | [<code>**/auth/signup**</code>](/docs/auth/POST_signup.md) | `POST`      | Create new account |
  | [<code>**/auth/login**</code>](/docs/auth/POST_login.md)   | `POST`      | Login into account  |

### 6.2. API Routes

  | URI | HTTP Method | Description |
  |-----|:-----------:|-------------|
  | [<code>**/api/v1/users**</code>](/docs/users/GET_list.md)                           | `GET`       | Fetch all users |
  | [<code>**/api/v1/users/{id}**</code>](/docs/users/GET_id.md)                        | `GET`       | Fetch a single user by ID |
  | [<code>**/api/v1/users/{id}**</code>](/docs/users/PUT_id.md)                        | `PUT`       | Update entire user resource |
  | [<code>**/api/v1/records**</code>](/docs/records/GET_list.md)                           | `GET`       | Fetch all records |
  | [<code>**/api/v1/red-flags**</code>](/docs/red_flags/GET_list.md)                           | `GET`       | Fetch all red-flag records |
  | [<code>**/api/v1/red-flags/{id}**</code>](/docs/red_flags/GET_id.md)                        | `GET`       | Fetch a single red-flag by ID record |
  | [<code>**/api/v1/red-flags**</code>](/docs/red_flags/POST_create.md)                        | `POST`      | Create a new red-flag record |
  | [<code>**/api/v1/red-flags/{id}/location**</code>](/docs/red_flags/PATCH_location.md)       | `PATCH`     | Update a red-flag's location |
  | [<code>**/api/v1/red-flags/{id}/comment**</code>](/docs/red_flags/PATCH_comment.md)         | `PATCH`     | Update a red-flag's comment |
  | [<code>**/api/v1/red-flags/{id}**</code>](/docs/red_flags/DELETE_id.md)                     | `DELETE`    | Delete a red-flag by ID |
  | [<code>**/api/v1/interventions**</code>](/docs/interventions/GET_list.md)                     | `GET`       | Fetch all intervention records |
  | [<code>**/api/v1/interventions/{id}**</code>](/docs/interventions/GET_id.md)                  | `GET`       | Fetch all intervention records |
  | [<code>**/api/v1/interventions**</code>](/docs/interventions/POST_create.md)                  | `POST`      | Create a new intervention record |
  | [<code>**/api/v1/interventions/{id}/location**</code>](/docs/interventions/PATCH_location.md) | `PATCH`     | Update an intervention's location |
  | [<code>**/api/v1/interventions/{id}/comment**</code>](/docs/interventions/PATCH_comment.md)   | `PATCH`     | Update an intervention's comment |
  | [<code>**/api/v1/interventions/{id}**</code>](/docs/interventions/DELETE_id.md)               | `DELETE`    | Delete an intervention by ID |

## 7. :pencil: License

The iReporter REST API is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
