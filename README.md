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
- [2. Authentication](#2-authentication)
- [3. Installation](#3-installation)
  - [3.1. Run locally](#31-run-locally)
  - [3.2. Test Locally](#32-test-locally)
- [4. Usage](#4-usage)
  - [4.1 Fetch all red-flag records](#41-fetch-all-red-flag-records)
  - [4.2. Fetch a specific red-flag record](#42-fetch-a-specific-red-flag-record)
  - [4.3. Create a red-flag record](#43-create-a-red-flag-record)
  - [4.4. Edit the location of a specific red-flag record](#44-edit-the-location-of-a-specific-red-flag-record)
  - [4.5. Edit the comment of a specific red-flag record](#45-edit-the-comment-of-a-specific-red-flag-record)
  - [4.6. Delete a specific red-flag record](#46-delete-a-specific-red-flag-record)
- [5. :pencil: License](#5-pencil-license)

## 2. Authentication

Access to the API is granted by providing your username and password using HTTP basic authentication. The username and password used 


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

## 4. Usage

### 4.1 Fetch all red-flag records

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

### 4.2. Fetch a specific red-flag record
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

### 4.3. Create a red-flag record

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

### 4.4. Edit the location of a specific red-flag record

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

### 4.5. Edit the comment of a specific red-flag record

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

### 4.6. Delete a specific red-flag record

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

## 5. :pencil: License

The iReporter REST API is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
