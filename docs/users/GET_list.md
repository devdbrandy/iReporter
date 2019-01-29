# Fetch all users

API endpoint that represents a list of all users

- **URL Endpoint:** `/api/v1/users`
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
            "firstname": "James",
            "lastname": "Bond",
            "othernames": "Administrator",
            "phoneNumber": "622-132-9223",
            "email": "admin@admin.com",
            "username": "admin",
            "registered": "2019-01-16T08:51:48.133Z",
            "isAdmin": true
          }
        ]
      }
    ]
  ```

- **Usage Sample:**

  ```http
  GET https://irepot.herokuapp.com/api/v1/users
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
        "firstname": "James",
        "lastname": "Bond",
        "othernames": "Administrator",
        "phoneNumber": "622-132-9223",
        "email": "admin@admin.com",
        "username": "admin",
        "registered": "2019-01-16T08:51:48.133Z",
        "isAdmin": true
      },
      {
        "id": 2,
        "firstname": "John",
        "lastname": "Doe",
        "othernames": "Bravo",
        "phoneNumber": "602-362-9283",
        "email": "user@user.com",
        "username": "user123",
        "registered": "2019-01-16T08:51:48.133Z",
        "isAdmin": false
      }
    ]
  }
  ```
