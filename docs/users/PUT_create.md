# Update a specific user resource

API endpoint that represents updating a user recource

- **URL Endpoint:** `/api/v1/users/{id}`
- **Method:** `PUT`
- **URL Params:**
  
  | Name | Type      | Required           | Description   |
  |------|-----------|--------------------|---------------|
  | `id` | `integer` | :white_check_mark: | The user's id |
  
- **Header Options:**
  - Authorization: Bearer `access_token`
- **Request Body:**
  
  | Name          | Type     | Required           | Description             |
  |---------------|----------|--------------------|-------------------------|
  | `firstname`   | `string` | :white_check_mark: | The user's firstname    |
  | `lastname`    | `string` | :white_check_mark: | The user's lastname     |
  | `othernames`  | `string` | :white_check_mark: | The user's othernames   |
  | `phoneNumber` | `string` | :white_check_mark: | The user's phone number |
  | `gender`      | `string` | :white_check_mark: | The user's gender       |
  | `avatar`      | `string` | :white_check_mark: | The user's avatar       |
  | `bio`         | `string` | :white_check_mark: | The user's bio          |

- **Success Response**
  - **Code:** `201 Created`
  - **Content:**

  ```http
    {
      "status": 201,
      "data": [
        {
          "id": 2,
          "message": "User profile successfully updated",
          "payload": {
            "id": 2,
            "firstname": "Yemisi",
            "lastname": "Efunnuga",
            "othernames": "Cutie",
            "phoneNumber": "08123456789",
            "email": "user@user.com",
            "username": "user123",
            "registered": "2019-01-25T18:13:16.193Z",
            "isAdmin": false,
            "gender": "female",
            "avatar": "img/avatar.jpg",
            "bio": "Some bio info"
          }
        }
      ]
    }
  ```
