# Fetch all red-flag records

API endpoint that represents a list of red-flag records

- **URL Endpoint:** `/api/v1/red-flags`
- **Method:** `GET`
- **URL Params:** `None`
- **URL Query (Optional):**
  
  | Name        | Type      | Description                     | Query                     |
  |-------------|-----------|---------------------------------|---------------------------|
  | `user`      | `integer` | Filter by user id               | `/red-flags?user=1`         |
  | `published` | `boolean` | Filter published records        | `/red-flags?published=true` |
  | `order`     | `string`  | Order result by `ASC` or `DESC` | `/red-flags?order=DESC`     |

  Sample query (combined): `/red-flags?user=1&published=true&order=DESC`
  
- **Header Options:**
  - Authorization: Bearer `access_token`
- **Request Body:** `None`
- **Success Response**
  - **Code:** `200 OK`
  - **Content:**

  ```http
    [
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
    ]
  ```

- **Usage Sample:**

  ```http
  GET https://irepot.herokuapp.com/api/v1/red-flags
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
      },
      {
        "id": 2,
        "createdBy": 2,
        "type": "red-flag",
        "location": "-42.2078,121.213",
        "images": ["https://via.placeholder.com/650x450"],
        "videos": ["https://via.placeholder.com/sample-video.mp4"],
        "title": "Bridge constuction",
        "comment": "Newly created red-flag record",
        "status": "draft",
        "createdOn": "2019-01-27T19:49:36.098Z"
      }
    ]
  }
  ```
