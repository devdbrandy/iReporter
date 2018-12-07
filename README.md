<h1 align="center">iReporter<h1> 

<p align="center">
  <a href="https://travis-ci.org/devdbrandy/iReporter.svg?branch=develop">
    <img src="https://travis-ci.org/devdbrandy/iReporter.svg?branch=develop" />
  </a>
  <a class="badge-align" href="https://www.codacy.com/app/devdbrandy/iReporter?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=devdbrandy/iReporter&amp;utm_campaign=Badge_Grade">
    <img src="https://api.codacy.com/project/badge/Grade/af41b75a4052458888f44cd39007295a"/>
  </a>
  <a href='https://coveralls.io/github/devdbrandy/iReporter?branch=develop'><img src='https://coveralls.io/repos/github/devdbrandy/iReporter/badge.svg?branch=develop' alt='Coverage Status' /></a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

## 1. Overview
iReporter app enables users (citizen) to bring any form of corruption to the notice of appropriate authorities and the general public. Visit app url: [https://irepot.herokuapp.com](https://irepot.herokuapp.com)

## 2. Table of Contents

- [1. Overview](#1-overview)
- [2. Table of Contents](#2-table-of-contents)
- [3. Installation](#3-installation)
  - [3.1. Run locally](#31-run-locally)
  - [3.2. Test Locally](#32-test-locally)
- [4. Authentication](#4-authentication)
- [5. API Versioning](#5-api-versioning)
- [6. HTTP Requests](#6-http-requests)
- [7. HTTP Response Codes](#7-http-response-codes)
- [8. Usage](#8-usage)
  - [8.1 Fetch all red-flag records](#81-fetch-all-red-flag-records)
  - [8.2. Fetch a specific red-flag record](#82-fetch-a-specific-red-flag-record)
  - [8.3. Create a red-flag record](#83-create-a-red-flag-record)
  - [8.4. Edit the location of a specific red-flag record](#84-edit-the-location-of-a-specific-red-flag-record)
  - [8.5. Edit the comment of a specific red-flag record](#85-edit-the-comment-of-a-specific-red-flag-record)
  - [8.6. Delete a specific red-flag record](#86-delete-a-specific-red-flag-record)
- [9. :pencil: License](#9-pencil-license)

## 3. Installation

### 3.1. Run locally
To run app locally, make sure you have `nodejs` installed.

```bash
git clone https://github.com/devdbrandy/iReporter.git # or clone your own fork
cd iReporter
npm install
npm run watch
```

### 3.2. Test Locally
To test or consume api locally, you can make use of [Postman](https://www.getpostman.com) or [Insomnia](https://insomnia.rest/download/)

## 4. Authentication

Access to restricted API endpoints requires an access token, iReporter uses access tokens to associate API requests with your account. To obtain your access token, make a request along with `username` and `password` field to `https://irepot.herokuapp.com/api/v1/auth`

**Sample Response:**

```http
POST https://irepot.herokuapp.com/api/v1/auth
HTTP/1.1
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "status": 200,
    "data": [
      {
        "token": "ahd64jfhHG7832KFM5",
        "user": {}
      }
    ]
  }
]
```

## 5. API Versioning

The second part of the URI specifies the API version you wish to access in the format `v{version_number}`.
For example, version 1 of the API (most current) is accessible via:
```http
  https://irepot.herokuapp.com
```

## 6. HTTP Requests

All API requests are made by sending  asecure HTTPS request using one of the following methods, depending on the being taken:

- `POST` Create a resource
- `PATCH` Update a resource
- `GET` Get a resource or list of resources
- `DELETE` Delete a resource

For `POST` and `PATCH` requests, the body of your request may include a JSON payload.

## 7. HTTP Response Codes

Each response will be returned with one of the following HTTP status codes:

- `200` `OK` The request was successful
- `400` `Bad Request` There was a problem with the request (security, malformed)
- `401` `Unauthorized` The supplied API credentials are invalid
- `403` `Forbidden` The credentials provided do not have permissions to access the requested resource
- `404` `Not found` An attempt was made to access a resource that does not exist in the API
- `500` `Server Error` An error on the server occurred


## 8. Usage

### 8.1 Fetch all red-flag records

API endpoint that represents a list of red-flags records
- **URL Endpoint:** `/api/v1/red-flags`
- **Method:** `GET`
- **URL Params:** `None`
- **Request Body:** `None`
- **Success Response**
  - **Code:** `200`
  - **Content:**

  ```http
    [
      {
        "status": 200,
        "data": [
          {
            "id": 1,
            "creadedOn": "Fri Nov 30 2018 11:15:34 GMT+0100 (West Africa Standard Time)",
            "type": "intervention",
            "location": "-42.7871,138.0694",
            "comment": "Temporibus dolores nobis nisi sapiente modi qui corrupti cum fuga. Est omnis nostrum in. Quis quo corrupti.",
            "images": [
              "https://via.placeholder.com/650x450",
              "https://via.placeholder.com/650x450"
            ],
            "status": "draft"
          },
      },
    ]
  ```
- **Usage Sample:**

    ```http
    GET https://irepot.herokuapp.com/api/v1/red-flags
    HTTP/1.1
    Accept: application/json

    HTTP/1.1 200 OK
    Content-Type: application/json

    {
      "status": 200,
      "data": [
        {
          "id": 1,
          "creadedOn": "Fri Nov 30 2018 11:15:34 GMT+0100 (West Africa Standard Time)",
          "type": "intervention",
          "location": "-42.7871,138.0694",
          "comment": "Temporibus dolores nobis nisi sapiente modi qui corrupti cum fuga. Est omnis nostrum in. Quis quo corrupti.",
          "images": [
            "https://via.placeholder.com/650x450",
            "https://via.placeholder.com/650x450"
          ],
          "videos": [
            "https://via.placeholder.com/sample-video.mp4",
          ],
          "status": "draft"
        },
      ]
    },
    ```

### 8.2. Fetch a specific red-flag record
API endpoint that represents a single red-flags records
- **URL Endpoint:** `/api/v1/red-flags/{id}`
- **Method:** `GET`
- **URL Params:**

  Name | Type | Description
  ----------|------|------------
  `id` | `integer` | **[Required]** The record's id
  
- **Request Body:** `None`
- **Success Response**
  - **Code:** `200`
  - **Content:**
  ```http
    {
      "status": 200,
      "data": [
        {
          "id": 1,
          "creadedOn": "Fri Nov 30 2018 11:15:34 GMT+0100 (West Africa Standard Time)",
          "type": "intervention",
          "location": "-42.7871,138.0694",
          "comment": "Temporibus dolores nobis nisi sapiente modi qui corrupti cum fuga. Est omnis nostrum in. Quis quo corrupti.",
          "images": [
            "https://via.placeholder.com/650x450",
            "https://via.placeholder.com/650x450"
          ],
          "videos": [
            "https://via.placeholder.com/sample-video.mp4",
          ],
          "status": "draft"
        }
    }
  ```
- **Error Response**
  - **Code:** `404 - NOT FOUND`
  - **Content:**
    ```http
      {
        "status": 404,
        "error": "Resource not found"
      }
    ```

- **Usage Sample:**

    ```http
    GET https://irepot.herokuapp.com/api/v1/red-flags/1
    HTTP/1.1
    Accept: application/json

    HTTP/1.1 200 OK
    Content-Type: application/json

    [
      {
        "status": 200,
        "data": [
          {
            "id": 1,
            "creadedOn": "Fri Nov 30 2018 11:15:34 GMT+0100 (West Africa Standard Time)",
            "type": "intervention",
            "location": "-42.7871,138.0694",
            "comment": "Temporibus dolores nobis nisi sapiente modi qui corrupti cum fuga. Est omnis nostrum in. Quis quo corrupti.",
            "images": [
              "https://via.placeholder.com/650x450",
              "https://via.placeholder.com/650x450"
            ],
            "status": "draft"
          }
        ]
      }
    ]
    ```

### 8.3. Create a red-flag record

API endpoint that represents the creation of red-flag record
- **URL Endpoint:** `/api/v1/red-flags`
- **Method:** `POST`
- **URL Params:** `None`
- **Header Options:**
  - Authorization: Bearer `access_token`
- **Request Body:**
  
  Name | Type | Description
  ----------|------|------------
  `type` | `string` | **[Required]** The incident type (red-flag or intervention)
  `location` | `string` | **[Required]** The incident location
  `images` | `image` | **[Required]** Attached images
  `videos` | `video` | **[Required]** Attached videos
  `comment` | `string` | **[Required]** The record's comment

- **Success Response**
  - **Code:** `201`
  - **Content:**
  ```http
    {
      "status": 201,
      "data": [
        {
          "id": 3,
          "message": "Created red-flag record"
        }
      ]
    }
  ```

### 8.4. Edit the location of a specific red-flag record

API endpoint that represents editing the location of red-flag record
- **URL Endpoint:** `/api/v1/red-flags/{id}/location`
- **Method:** `PATCH`
- **URL Params:**
  
  Name | Type | Description
  ----------|------|------------
  `id` | `integer` | **[Required]** The record id

- **Request Body:** 

  
  Name | Type | Description
  ----------|------|------------
  `location` | `string` | **[Required]** The incident's new location

- **Success Response**
  - **Code:** `200`
  - **Content:**
  ```http
    {
      "status": 200,
      "data": [
        {
          "id": 3,
          "message": "Updated red-flag record's location"
        }
      ]
    }
  ```

### 8.5. Edit the comment of a specific red-flag record

API endpoint that represents editing a specific red-flag record
- **URL Endpoint:** `/api/v1/red-flags/{id}/comment`
- **Method:** `PATCH`
- **URL Params:** 
  
  Name | Type | Description
  ----------|------|------------
  `id` | `integer` | **[Required]** The record id

- **Request Body:** 

  Name | Type | Description
  ----------|------|------------
  `comment` | `string` | **[Required]** The record's comment

- **Success Response**
  - **Code:** `200`
  - **Content:**
  ```http
    {
      "status": 200,
      "data": [
        {
          "id": 3,
          "message": "Updated red-flag record's comment"
        }
      ]
    }
  ```

### 8.6. Delete a specific red-flag record

API endpoint that represents deleting a specific red-flag record
- **URL Endpoint:** `/api/v1/red-flags/{id}`
- **Method:** `DELETE`
- **URL Params:** `None`
- **Request Body:** 

  Name | Type | Description
  ----------|------|------------
  `id` | `integer` | **[Required]** The record's id

- **Success Response**
  - **Code:** `200`
  - **Content:**
  ```http
    {
      "status": 200,
      "data": [
        {
          "id": 3,
          "message": "Red-flag record has been deleted"
        }
      ]
    }
  ```

## 9. :pencil: License

The iReporter REST API is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
