# Fetch a specific user resource

API endpoint that represents a single user recource

- **URL Endpoint:** `/api/v1/users/{id}`
- **Method:** `GET`
- **URL Params:**

  | Name | Type      | Required           | Description   |
  |------|-----------|--------------------|---------------|
  | `id` | `integer` | :white_check_mark: | The user's id |

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
  GET https://irepot.herokuapp.com/api/v1/users/1
  HTTP/1.1
  Accept: application/json
  Authorization: Bearer {access_token}

  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    "status": 200,
    "data": [
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
