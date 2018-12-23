# Fetch all red-flag records

API endpoint that represents a list of red-flag records

- **URL Endpoint:** `/api/v1/red-flags`
- **Method:** `GET`
- **URL Params:** `None`
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
            "creadedOn": "Fri Nov 30 2018 11:15:34 GMT+0100 (West Africa Standard Time)",
            "type": "red-flag",
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
        "creadedOn": "Fri Nov 30 2018 11:15:34 GMT+0100 (West Africa Standard Time)",
        "type": "red-flag",
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
    ]
  }
  ```
