# Delete intervention

API endpoint that represents deleting a specific intervention record

- **URL Endpoint:** `/api/v1/interventions/{id}`
- **Method:** `DELETE`
- **URL Params:** `None`
- **Request Body:**

  | Name | Type      | Required           | Description           |
  |------|-----------|--------------------|-----------------------|
  | `id` | `integer` | :white_check_mark: | The intervention's id |

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
          "message": "Intervention record has been deleted"
        }
      ]
    }
  ```

- **Usage Sample:**

  ```http
  DELETE https://irepot.herokuapp.com/api/v1/interventions/3
  HTTP/1.1
  Accept: application/json

  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    "status": 200,
    "data": [
      {
        "id": 3,
        "message": "Intervention record has been deleted"
      }
    ]
  }
  ```
