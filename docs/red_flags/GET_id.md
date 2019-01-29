# Fetch a specific red-flag record

API endpoint that represents a single red-flag record

- **URL Endpoint:** `/api/v1/red-flags/{id}`
- **Method:** `GET`
- **URL Params:**

  Name | Type      | Required           | Description
  -----|-----------|--------------------|----------------
  `id` | `integer` | :white_check_mark: | The red-flag's id

- **Header Options:**
  - Authorization: Bearer `access_token`
- **Request Body:** `None`
- **Success Response**
  - **Code:** `200 OK`
  - **Content:**

  ```http
    {
      "status": 200,
      "data": [
        {
          "id": 1,
          "createdBy": 2,
          "type": "red-flag",
          "location": "-42.2078,98.33",
          "images": [
            "https://via.placeholder.com/650x450",
            "https://via.placeholder.com/650x450"
          ],
          "videos": ["https://via.placeholder.com/sample-video.mp4"],
          "title": "Record 1 title",
          "comment": "Bad roads",
          "status": "resolved",
          "createdOn": "2019-01-27T19:48:36.098Z"
        }
      ]
    }
  ```

- **Error Response**
  - **Code:** `404 NOT FOUND`
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
  Authorization: Bearer {access_token}

  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    "status": 200,
    "data": [
      {
        "id": 1,
        "createdBy": 2,
        "type": "red-flag",
        "location": "-42.2078,98.33",
        "images": [
          "https://via.placeholder.com/650x450",
          "https://via.placeholder.com/650x450"
        ],
        "videos": ["https://via.placeholder.com/sample-video.mp4"],
        "title": "Record 1 title",
        "comment": "Bad roads",
        "status": "resolved",
        "createdOn": "2019-01-27T19:48:36.098Z"
      }
    ]
  }
  ```
