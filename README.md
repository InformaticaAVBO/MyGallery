# MyGallery
Una galleria di immagini editabile dagli utenti autorizzati

## Features
- 🖼️ Image gallery view for all visitors
- 🔐 User authentication system
- ⬆️ Image upload functionality for authorized users
- 🗑️ Image delete functionality for authorized users
- 📱 Responsive design

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`

3. Login with one of the default users:
   - Username: `admin` / Password: `password123`
   - Username: `user` / Password: `pass456`

## Features for Authorized Users

Once logged in, authorized users can:
- Upload new images to the gallery (max 10MB)
- Delete existing images
- Supported formats: JPEG, JPG, PNG, GIF, WebP

## Technology Stack

- **Backend**: Node.js with Express
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **File Upload**: Multer
- **Session Management**: express-session
- **Image Storage**: File system

## Security Notes

⚠️ This is a basic implementation for demonstration purposes. For production use, consider:
- Using a proper database for user authentication
- Implementing password hashing (bcrypt)
- Adding HTTPS
- Using environment variables for secrets
- Implementing rate limiting
- Adding CSRF protection
