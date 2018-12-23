# Edit red-flag's location

API endpoint that represents editing the location of red-flag record

- **URL Endpoint:** `/api/v1/red-flags/{id}/location`
- **Method:** `PATCH`
- **URL Params:**
  
  | Name | Type      | Required           | Description       |
  |------|-----------|--------------------|-------------------|
  | `id` | `integer` | :white_check_mark: | The red-flag's id |

- **Header Options:**
  - Authorization: Bearer `access_token`
- **Request Body:**
  
  Name       | Type     | Required | Description
  -----------|----------|--------------------|----------------------------------------
  `location` | `string` | :white_check_mark: | Proposed location

- **Success Response**
  - **Code:** `200 OK`
  - **Content:**

  ```http
    {
      "status": 200,
      "data": [
        {
          "id": 3,
          "message": "Updated red-flag record's location"
        }
      ]
    }
  ```
