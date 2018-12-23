# Edit intervention's location

API endpoint that represents editing the location of intervention record

- **URL Endpoint:** `/api/v1/intervention/{id}/location`
- **Method:** `PATCH`
- **URL Params:**
  
  | Name | Type      | Required           | Description           |
  |------|-----------|--------------------|-----------------------|
  | `id` | `integer` | :white_check_mark: | The intervention's id |

- **Header Options:**
  - Authorization: Bearer `access_token`
- **Request Body:**
  
  | Name       | Type     | Required           | Description       |
  |------------|----------|--------------------|-------------------|
  | `location` | `string` | :white_check_mark: | Proposed location |

- **Success Response**
  - **Code:** `200 OK`
  - **Content:**

  ```http
    {
      "status": 200,
      "data": [
        {
          "id": 3,
          "message": "Updated intervention record's location"
        }
      ]
    }
  ```
