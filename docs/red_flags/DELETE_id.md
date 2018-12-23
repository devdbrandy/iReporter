# Delete red-flag

API endpoint that represents deleting a specific red-flag record

- **URL Endpoint:** `/api/v1/red-flags/{id}`
- **Method:** `DELETE`
- **URL Params:** `None`
- **Request Body:**

  | Name | Type      | Required           | Description       |
  |------|-----------|--------------------|-------------------|
  | `id` | `integer` | :white_check_mark: | The red-flag's id |

- **Header Options:**
  - Authorization: Bearer `access_token`
- **Success Response**
  - **Code:** `200 OK`
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

- **Usage Sample:**

  ```http
  DELETE https://irepot.herokuapp.com/api/v1/red-flags/3
  HTTP/1.1
  Accept: application/json

  HTTP/1.1 200 OK
  Content-Type: application/json

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
