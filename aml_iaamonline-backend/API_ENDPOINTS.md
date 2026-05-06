# IAAM Journal Management System - API Endpoints

## Overview

The Laravel backend provides RESTful API endpoints for the IAAM Journal Management System. All endpoints return JSON responses.

## Authentication

- **Public Endpoints**: Submit and track endpoints do not require authentication
- **Reviewer Endpoints**: Use email verification with verification codes
- **Editor Endpoints**: Use Laravel Sanctum token-based authentication

## Endpoints

### Author Submission

#### POST `/api/submit`
Submit a new manuscript for review.

**Request Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
```json
{
  "title": "Manuscript Title",
  "authors": "Author One, Author Two",
  "author_email": "author@example.com",
  "author_affiliation": "University Name",
  "abstract": "Brief summary of research (200-300 words)",
  "keywords": "keyword1, keyword2, keyword3",
  "category": "nanotechnology|materials-science|polymers|composites|functional-materials|sustainable|other",
  "pdf": "file"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "submission_id": "SUB-XXXXXXXXXXXX",
  "message": "Manuscript submitted successfully",
  "data": {
    "id": 1,
    "submission_id": "SUB-XXXXXXXXXXXX",
    "title": "...",
    "status": "submitted",
    "submitted_at": "2025-04-25T10:30:00Z",
    "files": [...]
  }
}
```

---

#### POST `/api/track`
Track manuscript submission status.

**Request Body:**
```json
{
  "submission_id": "SUB-XXXXXXXXXXXX",
  "email": "author@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "submission_id": "SUB-XXXXXXXXXXXX",
    "title": "...",
    "authors": "...",
    "status": "submitted|editor-review|under-review|revision-requested|accepted|rejected",
    "submitted_at": "2025-04-25T10:30:00Z",
    "final_decision": "pending|accepted|rejected|revision-requested",
    "decision_date": null
  }
}
```

---

### Reviewer Verification & Review

#### POST `/api/reviewer/verify-email`
Send verification code to reviewer's email.

**Request Body:**
```json
{
  "email": "reviewer@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "expires_in": "10 minutes"
}
```

---

#### POST `/api/reviewer/verify-code`
Verify the 6-digit code and get access token.

**Request Body:**
```json
{
  "email": "reviewer@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "review-token-xxxxx",
  "message": "Email verified successfully"
}
```

---

#### GET `/api/reviewer/manuscripts`
Get list of assigned manuscripts (requires token).

**Headers:**
```
Authorization: Bearer <review-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "submission_id": "SUB-XXXX",
      "title": "...",
      "authors": "...",
      "category": "...",
      "abstract": "...",
      "review_assignment_id": 1,
      "status": "invited|accepted|declined|completed"
    }
  ]
}
```

---

#### GET `/api/reviewer/manuscript/{id}`
Get manuscript details and PDF preview URL (requires token).

**Headers:**
```
Authorization: Bearer <review-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "...",
    "authors": "...",
    "abstract": "...",
    "category": "...",
    "pdf_preview_url": "/api/reviewer/pdf/{review-assignment-id}",
    "created_at": "..."
  }
}
```

---

#### POST `/api/reviewer/review`
Submit review (requires token).

**Headers:**
```
Authorization: Bearer <review-token>
```

**Request Body:**
```json
{
  "review_assignment_id": 1,
  "recommendation": "accept|minor-revisions|major-revisions|reject",
  "strengths": "...",
  "weaknesses": "...",
  "comments": "...",
  "questions": "...",
  "quality_score": 8,
  "novelty_score": 7,
  "relevance_score": 9
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "id": 1,
    "is_submitted": true,
    "submitted_at": "2025-04-25T14:30:00Z"
  }
}
```

---

### Editor Management (requires Sanctum authentication)

#### GET `/api/editor/manuscripts`
Get all manuscripts with filtering.

**Query Parameters:**
```
?status=submitted|editor-review|under-review|revision-requested|accepted|rejected
?category=nanotechnology|materials-science|...
?sort=newest|oldest
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "submission_id": "SUB-XXXX",
      "title": "...",
      "authors": "...",
      "status": "under-review",
      "reviewer_count": 2,
      "final_decision": "pending",
      "submitted_at": "..."
    }
  ]
}
```

---

#### GET `/api/editor/manuscript/{id}`
Get detailed manuscript information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "submission_id": "SUB-XXXX",
    "title": "...",
    "authors": "...",
    "abstract": "...",
    "status": "...",
    "file_path": "...",
    "reviewer_count": 2,
    "reviews": [...],
    "review_assignments": [...]
  }
}
```

---

#### POST `/api/editor/invite-reviewer`
Invite a reviewer for manuscript.

**Request Body:**
```json
{
  "manuscript_id": 1,
  "reviewer_email": "reviewer@example.com",
  "reviewer_name": "Dr. Name",
  "due_date": "2025-05-25"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reviewer invited successfully",
  "data": {
    "review_assignment_id": 1,
    "token": "review-token-xxxxx",
    "verification_code": "123456"
  }
}
```

---

#### POST `/api/editor/decision`
Make final editorial decision on manuscript.

**Request Body:**
```json
{
  "manuscript_id": 1,
  "final_decision": "accepted|rejected|revision-requested",
  "decision_notes": "..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Decision recorded successfully",
  "data": {
    "manuscript_id": 1,
    "final_decision": "accepted",
    "decision_date": "2025-04-25T15:00:00Z"
  }
}
```

---

#### GET `/api/editor/stats`
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_manuscripts": 50,
    "new_submissions": 5,
    "under_review": 20,
    "revision_requested": 10,
    "accepted": 12,
    "rejected": 3,
    "average_review_time_days": 45
  }
}
```

---

## Error Responses

All errors return appropriate HTTP status codes with JSON error messages:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["error message"]
  }
}
```

### Common Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity (validation errors)
- `500` - Server Error

---

## Security Features

1. **Input Validation**: All inputs validated on backend
2. **File Upload Protection**: PDF files only, max 50MB, MIME type validation
3. **Token Security**: Long random tokens, hashed storage
4. **Verification Codes**: 6-digit codes, 10-minute expiry, rate limiting
5. **Audit Logging**: All sensitive actions logged
6. **IP Tracking**: Request IP addresses logged for security
7. **Watermarking**: PDFs marked for reviewers (future)
8. **Non-downloadable PDFs**: Protected from direct download (future)

---

## Rate Limiting

- Submission: 1 per day per email
- Verification code: 3 attempts per 15 minutes
- API requests: 60 per minute (will be configurable)

---

## Migration to PostgreSQL

These endpoints are configured to work with both SQLite (development) and PostgreSQL (production). When PostgreSQL is available, run:

```bash
php artisan migrate --database=pgsql
```
