# Create a red-flag record

API endpoint that represents the creation of red-flag record

- **URL Endpoint:** `/api/v1/red-flags`
- **Method:** `POST`
- **URL Params:** `None`
- **Header Options:**
  - Authorization: Bearer `access_token`
- **Request Body:**
  
  | Name       | Type     | Required           | Description             |
  |------------|----------|--------------------|-------------------------|
  | `location` | `string` | :white_check_mark: | The red-flag's location |
  | `images`   | `image`  | :white_check_mark: | Attached images         |
  | `videos`   | `video`  | :white_check_mark: | Attached videos         |
  | `comment`  | `string` | :white_check_mark: | The record's comment    |

- **Success Response**
  - **Code:** `201 Created`
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
