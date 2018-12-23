# Account login

API endpoint that represents an account login

- **URL Endpoint:** `/auth/login`
- **Method:** `POST`
- **URL Params:** `None`
- **Request Body:**
  
  | Name       | Type     | Required           | Description   |
  |------------|----------|--------------------|---------------|
  | `username` | `string` | :white_check_mark: | Username      |
  | `pasword`  | `string` | :white_check_mark: | User password |

- **Success Response**
  - **Code:** `200 OK`
  - **Content:**

  ```http
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
