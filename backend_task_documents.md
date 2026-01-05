# Backend Task: Secure Document Download Endpoint

## Problem
The mobile application is receiving a `401 Unauthorized` error when attempting to download document files from the portfolio (e.g., from `project.purchasedUnit.documents`).
- The mobile app **is sending** the valid `Authorization: Bearer <token>` header with the download request.
- The direct file URLs provided in the portfolio response (e.g., `/uploads/file.pdf` or complete S3 links) likely do not support this authentication method directly, or strictly require a session cookie/signature which the mobile app does not have in this context.

## Required Solution
To enable secure "Instant Preview" of documents on mobile, we need a dedicated API endpoint that validates the user's Bearer token and redirects to a temporary, public-access URL (Pre-signed URL) for the file.

### 1. New Endpoint
**GET** `/api/v1/documents/:id/download-url`  
*(Or similar, depending on your routing structure)*

**Headers:**
`Authorization: Bearer <access_token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "url": "https://s3.region.amazonaws.com/bucket/file.pdf?AWSAccessKeyId=...&Expires=...&Signature=..."
  }
}
```

### 2. Logic
1.  Backend receives the request and validates the `Authorization` token.
2.  Backend checks if the user has permission to access the document with ID `:id`.
3.  Backend generates a **Pre-signed URL** (e.g., AWS S3 `getSignedUrl`) for the requested file.
    *   Set the expiration time to short (e.g., 5-15 minutes).
4.  Backend returns this URL in the JSON response.

## Why this is needed
- **Security**: Keeps the files private; only authenticated users can generate a link.
- **Compatibility**: The pre-signed URL can be used by standard mobile file downloaders (iOS `FileSystem`, Android `DownloadManager`) and WebViews without needing to inject complex headers or cookies, which is often the cause of the `401` error on direct links.
