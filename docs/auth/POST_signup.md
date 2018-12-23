# Account signup

API endpoint that represents the creation of a new user account

- **URL Endpoint:** `/auth/signup`
- **Method:** `POST`
- **URL Params:** `None`
- **Request Body:**
  
  | Name          | Type     | Required           | Description        |
  |---------------|----------|--------------------|--------------------|
  | `firstname`   | `string` | :white_check_mark: | User first name    |
  | `lastname`    | `string` | :white_check_mark: | User last name     |
  | `othernames`  | `string` | :x:                | User other names   |
  | `phoneNumber` | `string` | :white_check_mark: | User phone number  |
  | `username`    | `string` | :white_check_mark: | Unique username    |
  | `email`       | `string` | :white_check_mark: | User email address |
  | `pasword`     | `string` | :white_check_mark: | User password      |

- **Success Response**
  - **Code:** `201 Created`
  - **Content:**

  ```http
    {
      "status": 201,
      "data": [
        {
          "token": "...",
          "user": {}
        }
      ]
    }
  ```
