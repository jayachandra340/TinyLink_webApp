# TinyLink

A modern URL shortening web application built with Next.js, Tailwind CSS, and PostgreSQL (Neon).

## Features

- **Create Short Links**: Generate shortened URLs with optional custom codes
- **Link Management**: View, filter, sort, and delete all your links
- **Analytics**: Track clicks and view detailed statistics for each link
- **URL Validation**: Ensures valid URLs and unique codes
- **Responsive Design**: Beautiful, mobile-friendly UI with Tailwind CSS
- **Health Check**: Built-in health check endpoint for monitoring

## API Endpoints

### POST /api/links
Create a new shortened URL.

**Request Body:**
```json
{
  "url": "https://example.com",
  "code": "optional-custom-code"
}
```

**Response (201):**
```json
{
  "code": "abc123",
  "originalUrl": "https://example.com",
  "clicks": 0,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400`: Invalid URL or code format
- `409`: Code already exists
- `500`: Internal server error

### GET /api/links
List all links with optional filtering and sorting.

**Query Parameters:**
- `sortBy`: Sort column (created_at, clicks, code, original_url)
- `order`: Sort order (asc, desc)
- `filter`: Search filter for code or URL

**Response (200):**
```json
[
  {
    "code": "abc123",
    "originalUrl": "https://example.com",
    "clicks": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastClickedAt": "2024-01-02T00:00:00.000Z"
  }
]
```

### GET /api/links/:code
Get statistics for a specific link.

**Response (200):**
```json
{
  "code": "abc123",
  "originalUrl": "https://example.com",
  "clicks": 5,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastClickedAt": "2024-01-02T00:00:00.000Z"
}
```

**Error Responses:**
- `404`: Link not found
- `500`: Internal server error

### DELETE /api/links/:code
Delete a link.

**Response (200):**
```json
{
  "message": "Link deleted successfully"
}
```

**Error Responses:**
- `404`: Link not found
- `500`: Internal server error

### GET /:code
Redirect to the original URL (302 redirect) and track clicks.

**Error Responses:**
- Redirects to `/?error=notfound` if link doesn't exist

### GET /healthz
Health check endpoint. Returns system status and uptime information.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "uptimeFormatted": "1h 0m 0s"
}
```

**Error Responses:**
- `503`: Database connection failed
- `405`: Method not allowed

## Code Format

Custom codes must match the pattern: `[A-Za-z0-9]{6,8}` (6-8 alphanumeric characters).

## Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd url-shortener
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Neon PostgreSQL connection string:
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. Import your project in [Vercel](https://vercel.com).

3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string

4. Deploy! Vercel will automatically build and deploy your application.

## Database Schema

The application automatically creates the following table on first run:

```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_clicked_at TIMESTAMP
);
```

## Testing

The codebase is structured for easy testing. You can add test files using your preferred testing framework (Jest, Vitest, etc.).

## License

MIT

