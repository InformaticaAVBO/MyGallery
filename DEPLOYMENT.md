# MyGallery Deployment Guide

## Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open browser to `http://localhost:3000`

4. Login with default credentials:
   - Username: `admin` / Password: `password123`
   - Username: `user` / Password: `pass456`

## Production Deployment

### Environment Variables

Set these environment variables for production:

```bash
# Required
NODE_ENV=production
SESSION_SECRET=your-long-random-secret-here

# Optional
PORT=3000
```

### Security Recommendations

For production deployments, consider implementing:

1. **HTTPS**: Use a reverse proxy (nginx, Apache) or hosting platform that provides SSL/TLS
2. **Rate Limiting**: Install and configure `express-rate-limit`
   ```bash
   npm install express-rate-limit
   ```
3. **Database**: Replace the in-memory user store with a proper database (PostgreSQL, MongoDB, etc.)
4. **Password Hashing**: Use bcrypt to hash passwords
5. **Additional CSRF Protection**: Consider adding `csurf` middleware for additional CSRF token validation
6. **File Storage**: Use cloud storage (AWS S3, Azure Blob Storage) for images
7. **Input Validation**: Add more robust validation using libraries like `joi` or `express-validator`
8. **Logging**: Implement proper logging with `winston` or similar
9. **Monitoring**: Add application monitoring and error tracking

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t mygallery .
docker run -p 3000:3000 -e SESSION_SECRET=your-secret-here -e NODE_ENV=production mygallery
```

### Nginx Reverse Proxy (Recommended)

Example nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Backup and Maintenance

### Backup Images

The `uploads/` directory contains all uploaded images. Backup regularly:

```bash
tar -czf backup-$(date +%Y%m%d).tar.gz uploads/
```

### Clear Old Sessions

Sessions are stored in memory by default. For production, use a persistent session store like:
- `connect-redis`
- `connect-mongo`
- `express-session-file-store`

## Monitoring

Monitor these metrics in production:
- Disk space in `uploads/` directory
- Memory usage
- Response times
- Error rates
- Authentication attempts

## Troubleshooting

### Port Already in Use

Change the port:
```bash
PORT=3001 npm start
```

### Upload Failures

Check:
- Disk space available
- File permissions on `uploads/` directory
- File size (max 10MB by default)
- File type (must be image)

### Session Issues

Ensure:
- `SESSION_SECRET` is set in production
- Cookies are enabled in browser
- HTTPS is used if `secure` cookie flag is set
