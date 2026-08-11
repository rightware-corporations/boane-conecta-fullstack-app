# API Contract

This document outlines the REST API endpoints provided by the Boane Conecta backend. All routes are prefixed with `/api/v1`.

## API Response Standard

All API responses follow a standardized format.

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Pagination Response

```json
{
  "success": true,
  "message": "Records found",
  "data": [],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5
  }
}
```

## Endpoints

### 1. Health

*   **Method:** `GET`
*   **Path:** `/api/v1/health`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Returns backend health status.

### 2. Auth

*   **Method:** `POST`
*   **Path:** `/api/v1/auth/register`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Registers a citizen account.

*   **Method:** `POST`
*   **Path:** `/api/v1/auth/login`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Authenticates a user and returns JWT tokens.

*   **Method:** `POST`
*   **Path:** `/api/v1/auth/refresh`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Refreshes an access token using a refresh token.

*   **Method:** `POST`
*   **Path:** `/api/v1/auth/logout`
*   **Auth Requirement:** Authenticated
*   **Roles:** Any
*   **Description:** Logs out the current user.

*   **Method:** `GET`
*   **Path:** `/api/v1/auth/me`
*   **Auth Requirement:** Authenticated
*   **Roles:** Any
*   **Description:** Returns the current user's profile.

*   **Method:** `POST`
*   **Path:** `/api/v1/auth/change-password`
*   **Auth Requirement:** Authenticated
*   **Roles:** Any
*   **Description:** Changes the current user's password.

#### Authentication Payloads

Register:

```json
{
  "fullName": "Ana Cossa",
  "email": "ana@example.com",
  "phone": "+258840000000",
  "password": "Citizen123!"
}
```

Login:

```json
{
  "email": "ana@example.com",
  "password": "Citizen123!"
}
```

Successful login response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<opaque-refresh-token>",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "<uuid>",
      "fullName": "Ana Cossa",
      "email": "ana@example.com",
      "phone": "+258840000000",
      "status": "ACTIVE",
      "emailVerified": false,
      "roles": ["CITIZEN"]
    }
  }
}
```

Refresh and logout:

```json
{
  "refreshToken": "<opaque-refresh-token>"
}
```

Change password:

```json
{
  "currentPassword": "Citizen123!",
  "newPassword": "Citizen456!"
}
```

#### Curl Examples

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Ana Cossa","email":"ana@example.com","phone":"+258840000000","password":"Citizen123!"}'

curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"Citizen123!"}'

curl http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer <access-token>"

curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh-token>"}'

curl -X POST http://localhost:8080/api/v1/auth/logout \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh-token>"}'
```

#### Postman Setup

1. Create `baseUrl`, `accessToken`, and `refreshToken` collection variables.
2. Use `{{baseUrl}}/api/v1/auth/login` with the login JSON body.
3. In the login test script, save `pm.response.json().data.accessToken` and `refreshToken`.
4. Use Bearer Token `{{accessToken}}` for authenticated requests.
5. Send `{"refreshToken":"{{refreshToken}}"}` to refresh or logout.

### 3. Admin Users

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/users`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Retrieves a list of users.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/users/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Retrieves a specific user by ID.

*   **Method:** `POST`
*   **Path:** `/api/v1/admin/users`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Creates a new user.

*   **Method:** `PUT`
*   **Path:** `/api/v1/admin/users/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Updates an existing user.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/admin/users/{id}/status`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Updates a user's status.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/admin/users/{id}/roles`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN
*   **Description:** Updates a user's roles.

*   **Method:** `DELETE`
*   **Path:** `/api/v1/admin/users/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN
*   **Description:** Deletes a user.

### 4. Citizen Profile

*   **Method:** `GET`
*   **Path:** `/api/v1/citizen/profile`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Retrieves the current citizen's profile.

*   **Method:** `PUT`
*   **Path:** `/api/v1/citizen/profile`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Updates the current citizen's profile.

### 5. Departments

*   **Method:** `GET`
*   **Path:** `/api/v1/public/departments`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a list of departments.

*   **Method:** `GET`
*   **Path:** `/api/v1/public/departments/{slug}`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a specific department by slug.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/departments`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Retrieves a list of departments for administration.

*   **Method:** `POST`
*   **Path:** `/api/v1/admin/departments`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Creates a new department.

*   **Method:** `PUT`
*   **Path:** `/api/v1/admin/departments/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Updates an existing department.

*   **Method:** `DELETE`
*   **Path:** `/api/v1/admin/departments/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN
*   **Description:** Deactivates a department by setting status to `INACTIVE`.

### 6. Districts

*   **Method:** `GET`
*   **Path:** `/api/v1/public/districts`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a list of districts.

*   **Method:** `GET`
*   **Path:** `/api/v1/public/districts/{slug}`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a specific district by slug.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/districts`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Retrieves a list of districts for administration.

*   **Method:** `POST`
*   **Path:** `/api/v1/admin/districts`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Creates a new district.

*   **Method:** `PUT`
*   **Path:** `/api/v1/admin/districts/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Updates an existing district.

*   **Method:** `DELETE`
*   **Path:** `/api/v1/admin/districts/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN
*   **Description:** Deactivates a district by setting status to `INACTIVE`.

### 7. Municipal Services

*   **Method:** `GET`
*   **Path:** `/api/v1/public/services`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a list of municipal services.

*   **Method:** `GET`
*   **Path:** `/api/v1/public/services/{slug}`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a specific municipal service by slug.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/services`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Retrieves a list of municipal services for administration.

*   **Method:** `POST`
*   **Path:** `/api/v1/admin/services`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Creates a new municipal service.

*   **Method:** `PUT`
*   **Path:** `/api/v1/admin/services/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Updates an existing municipal service.

*   **Method:** `DELETE`
*   **Path:** `/api/v1/admin/services/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN
*   **Description:** Archives a municipal service by setting status to `ARCHIVED`.

*   **Method:** `POST`
*   **Path:** `/api/v1/admin/services/{id}/requirements`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Adds requirements to a municipal service.

*   **Method:** `POST`
*   **Path:** `/api/v1/admin/services/{id}/fees`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Adds fees to a municipal service.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/services/{serviceId}/requirements`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Lists requirements belonging to the municipal service.

*   **Method:** `PUT`, `DELETE`
*   **Path:** `/api/v1/admin/services/{serviceId}/requirements/{requirementId}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Updates or permanently deletes a requirement belonging to the municipal service.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/services/{serviceId}/fees`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Lists fees belonging to the municipal service.

*   **Method:** `PUT`, `DELETE`
*   **Path:** `/api/v1/admin/services/{serviceId}/fees/{feeId}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN
*   **Description:** Updates or permanently deletes a fee belonging to the municipal service.

#### Catalog Module Behavior

- Public department and district routes return only `ACTIVE` records.
- Public municipal-service routes return only `PUBLISHED` records.
- Admin list routes include every status.
- Slugs are normalized and generated from the name/title when omitted.
- Department and district `DELETE` routes set `INACTIVE`.
- Municipal-service `DELETE` sets `ARCHIVED` and requires `SUPER_ADMIN`.
- Requirement and fee `DELETE` routes hard-delete the child record because those tables have no status column.
- Nested requirement/fee operations reject child IDs that do not belong to the supplied service ID.
- `GET /api/v1/admin/services` allows `SUPER_ADMIN`, `ADMIN`, and `MANAGER`; all service writes except delete allow `SUPER_ADMIN` and `ADMIN`.

Create department:

```json
{
  "name": "Urbanizacao e Construcao",
  "slug": "urbanizacao-e-construcao",
  "description": "Municipal urban-planning department",
  "status": "ACTIVE"
}
```

Create district:

```json
{
  "name": "Matola Rio",
  "description": "Administrative district",
  "status": "ACTIVE"
}
```

Create municipal service:

```json
{
  "departmentId": "<department-uuid>",
  "title": "Licenca de Construcao",
  "description": "Application for a municipal construction licence",
  "processingTime": "15 business days",
  "status": "PUBLISHED"
}
```

Create service requirement at `POST /api/v1/admin/services/{id}/requirements`:

```json
{
  "title": "Identity document",
  "description": "Valid identification document",
  "required": true
}
```

Create service fee at `POST /api/v1/admin/services/{id}/fees`:

```json
{
  "title": "Application fee",
  "amount": 250.00,
  "currency": "MZN"
}
```

The same request structures are used by the corresponding `PUT` routes. Currency is normalized to uppercase and defaults to `MZN`; fee amounts must be zero or greater.

Example requirement list response:

```json
{
  "success": true,
  "message": "Service requirements retrieved",
  "data": [
    {
      "id": "<requirement-uuid>",
      "serviceId": "<service-uuid>",
      "title": "Identity document",
      "description": "Valid identification document",
      "required": true
    }
  ]
}
```

Example fee list response:

```json
{
  "success": true,
  "message": "Service fees retrieved",
  "data": [
    {
      "id": "<fee-uuid>",
      "serviceId": "<service-uuid>",
      "title": "Application fee",
      "amount": 250.00,
      "currency": "MZN"
    }
  ]
}
```

Example municipal-service response:

```json
{
  "success": true,
  "message": "Municipal service retrieved",
  "data": {
    "id": "<service-uuid>",
    "departmentId": "<department-uuid>",
    "departmentName": "Urbanizacao e Construcao",
    "title": "Licenca de Construcao",
    "slug": "licenca-de-construcao",
    "description": "Application for a municipal construction licence",
    "processingTime": "15 business days",
    "status": "PUBLISHED",
    "requirements": [
      {
        "id": "<requirement-uuid>",
        "serviceId": "<service-uuid>",
        "title": "Identity document",
        "required": true
      }
    ],
    "fees": [
      {
        "id": "<fee-uuid>",
        "serviceId": "<service-uuid>",
        "title": "Application fee",
        "amount": 250.00,
        "currency": "MZN"
      }
    ]
  }
}
```

Frontend public consumption:

```text
GET /api/v1/public/departments
GET /api/v1/public/departments/{slug}
GET /api/v1/public/districts
GET /api/v1/public/districts/{slug}
GET /api/v1/public/services
GET /api/v1/public/services/{slug}
```

### 8. Citizen Requests

*   **Method:** `POST`
*   **Path:** `/api/v1/citizen/requests`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Submits a new citizen request.

*   **Method:** `GET`
*   **Path:** `/api/v1/citizen/requests`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Retrieves a list of the current citizen's requests.

*   **Method:** `GET`
*   **Path:** `/api/v1/citizen/requests/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Retrieves a specific request for the current citizen.

*   **Method:** `POST`
*   **Path:** `/api/v1/citizen/requests/{id}/documents`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Uploads documents for a specific request.

### 9. Admin Requests

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/requests`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE
*   **Description:** Retrieves a list of all citizen requests.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/requests/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE
*   **Description:** Retrieves a specific citizen request.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/admin/requests/{id}/assign`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Assigns a request to a user.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/admin/requests/{id}/status`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE
*   **Description:** Updates the status of a request.

### 10. Documents

*   **Method:** `POST`
*   **Path:** `/api/v1/documents/upload`
*   **Auth Requirement:** Authenticated
*   **Roles:** Any
*   **Description:** Uploads a document.

*   **Method:** `GET`
*   **Path:** `/api/v1/documents/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** Any (with ownership/admin rule)
*   **Description:** Retrieves document metadata.

*   **Method:** `GET`
*   **Path:** `/api/v1/documents/{id}/download`
*   **Auth Requirement:** Authenticated
*   **Roles:** Any (with ownership/admin rule)
*   **Description:** Downloads a document.

*   **Method:** `GET`
*   **Path:** `/api/v1/citizen/documents`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Retrieves a list of the current citizen's documents.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/documents`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE
*   **Description:** Retrieves a list of all documents.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/admin/documents/{id}/status`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE
*   **Description:** Updates the status of a document.

### 11. Complaints

*   **Method:** `POST`
*   **Path:** `/api/v1/public/complaints`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Submits a public complaint.

*   **Method:** `POST`
*   **Path:** `/api/v1/citizen/complaints`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Submits a complaint as a citizen.

*   **Method:** `GET`
*   **Path:** `/api/v1/citizen/complaints`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Retrieves a list of the current citizen's complaints.

*   **Method:** `GET`
*   **Path:** `/api/v1/citizen/complaints/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Retrieves a specific complaint for the current citizen.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/complaints`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE
*   **Description:** Retrieves a list of all complaints.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/complaints/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE
*   **Description:** Retrieves a specific complaint.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/admin/complaints/{id}/assign`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Assigns a complaint to a user.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/admin/complaints/{id}/status`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE
*   **Description:** Updates the status of a complaint.

### 12. Payments

*   **Method:** `GET`
*   **Path:** `/api/v1/citizen/payments`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Retrieves a list of the current citizen's payments.

*   **Method:** `GET`
*   **Path:** `/api/v1/citizen/payments/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Retrieves a specific payment for the current citizen.

*   **Method:** `POST`
*   **Path:** `/api/v1/citizen/payments/{id}/manual-proof`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Submits manual proof of payment.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/payments`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Retrieves a list of all payments.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/payments/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Retrieves a specific payment.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/admin/payments/{id}/confirm`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Confirms a payment.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/admin/payments/{id}/reject`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Rejects a payment.

### 13. Appointments

*   **Method:** `GET`
*   **Path:** `/api/v1/public/appointment-slots`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves available appointment slots.

*   **Method:** `POST`
*   **Path:** `/api/v1/citizen/appointments`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Schedules a new appointment.

*   **Method:** `GET`
*   **Path:** `/api/v1/citizen/appointments`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Retrieves a list of the current citizen's appointments.

*   **Method:** `GET`
*   **Path:** `/api/v1/citizen/appointments/{id}`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Retrieves a specific appointment for the current citizen.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/citizen/appointments/{id}/cancel`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Cancels an appointment.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/appointments`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE
*   **Description:** Retrieves a list of all appointments.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/admin/appointments/{id}/status`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE
*   **Description:** Updates the status of an appointment.

*   **Method:** `POST`
*   **Path:** `/api/v1/admin/appointment-slots`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Creates new appointment slots.

### 14. Notifications

*   **Method:** `GET`
*   **Path:** `/api/v1/citizen/notifications`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Retrieves a list of the current citizen's notifications.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/citizen/notifications/{id}/read`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Marks a notification as read.

*   **Method:** `PATCH`
*   **Path:** `/api/v1/citizen/notifications/read-all`
*   **Auth Requirement:** Authenticated
*   **Roles:** CITIZEN
*   **Description:** Marks all notifications as read.

*   **Method:** `POST`
*   **Path:** `/api/v1/admin/notifications`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Sends a notification to users.

### 15. Public Content

*   **Method:** `GET`
*   **Path:** `/api/v1/public/news`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a list of news articles.

*   **Method:** `GET`
*   **Path:** `/api/v1/public/news/{slug}`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a specific news article by slug.

*   **Method:** `GET`
*   **Path:** `/api/v1/public/notices`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a list of notices.

*   **Method:** `GET`
*   **Path:** `/api/v1/public/notices/{slug}`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a specific notice by slug.

*   **Method:** `GET`
*   **Path:** `/api/v1/public/projects`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a list of projects.

*   **Method:** `GET`
*   **Path:** `/api/v1/public/projects/{slug}`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a specific project by slug.

*   **Method:** `GET`
*   **Path:** `/api/v1/public/tenders`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a list of tenders.

*   **Method:** `GET`
*   **Path:** `/api/v1/public/tenders/{slug}`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a specific tender by slug.

*   **Method:** `GET`
*   **Path:** `/api/v1/public/gallery`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a list of gallery items.

*   **Method:** `GET`
*   **Path:** `/api/v1/public/faqs`
*   **Auth Requirement:** Public
*   **Roles:** None
*   **Description:** Retrieves a list of FAQs.

### 16. Admin Content

*   **Method:** `GET`, `POST`, `PUT`, `DELETE`
*   **Path:** `/api/v1/admin/news`, `/api/v1/admin/notices`, `/api/v1/admin/projects`, `/api/v1/admin/tenders`, `/api/v1/admin/gallery`, `/api/v1/admin/faqs`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, EDITOR
*   **Description:** CRUD operations for various content types.

### 17. Reports

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/reports/summary`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Retrieves a summary report.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/reports/requests`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Retrieves a report on requests.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/reports/payments`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Retrieves a report on payments.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/reports/complaints`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Retrieves a report on complaints.

*   **Method:** `GET`
*   **Path:** `/api/v1/admin/reports/appointments`
*   **Auth Requirement:** Authenticated
*   **Roles:** SUPER_ADMIN, ADMIN, MANAGER
*   **Description:** Retrieves a report on appointments.
