// State management
let isAuthenticated = false;
let currentUser = null;

// DOM elements
const loginForm = document.getElementById('login-form');
const userInfo = document.getElementById('user-info');
const uploadSection = document.getElementById('upload-section');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const usernameDisplay = document.getElementById('username-display');
const uploadForm = document.getElementById('upload-form');
const imageInput = document.getElementById('image-input');
const uploadMessage = document.getElementById('upload-message');
const gallery = document.getElementById('gallery');

// Initialize app
async function init() {
    await checkAuthStatus();
    await loadGallery();
}

// Check authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (data.authenticated) {
            isAuthenticated = true;
            currentUser = data.username;
            showAuthenticatedUI();
        } else {
            isAuthenticated = false;
            currentUser = null;
            showUnauthenticatedUI();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        showUnauthenticatedUI();
    }
}

// Show UI for authenticated users
function showAuthenticatedUI() {
    loginForm.classList.add('hidden');
    userInfo.classList.remove('hidden');
    uploadSection.classList.remove('hidden');
    usernameDisplay.textContent = `Welcome, ${currentUser}!`;
}

// Show UI for unauthenticated users
function showUnauthenticatedUI() {
    loginForm.classList.remove('hidden');
    userInfo.classList.add('hidden');
    uploadSection.classList.add('hidden');
}

// Login handler
loginBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            isAuthenticated = true;
            currentUser = data.username;
            usernameInput.value = '';
            passwordInput.value = '';
            showAuthenticatedUI();
            await loadGallery();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
});

// Logout handler
logoutBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            isAuthenticated = false;
            currentUser = null;
            showUnauthenticatedUI();
            await loadGallery();
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Upload form handler
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const file = imageInput.files[0];
    if (!file) {
        showUploadMessage('Please select an image', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showUploadMessage('Image uploaded successfully!', 'success');
            imageInput.value = '';
            await loadGallery();
            
            // Clear message after 3 seconds
            setTimeout(() => {
                uploadMessage.textContent = '';
                uploadMessage.className = '';
            }, 3000);
        } else {
            showUploadMessage(data.error || 'Upload failed', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showUploadMessage('Upload failed. Please try again.', 'error');
    }
});

// Show upload message
function showUploadMessage(message, type) {
    uploadMessage.textContent = message;
    uploadMessage.className = type;
}

// Load gallery
async function loadGallery() {
    try {
        const response = await fetch('/api/images');
        const images = await response.json();
        
        if (images.length === 0) {
            gallery.innerHTML = '<p class="loading">No images yet. Upload your first image!</p>';
            return;
        }
        
        gallery.innerHTML = '';
        
        images.forEach(image => {
            const item = createGalleryItem(image);
            gallery.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
        gallery.innerHTML = '<p class="loading">Failed to load images</p>';
    }
}

// Create gallery item
function createGalleryItem(image) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.src = image.url;
    img.alt = image.filename;
    img.loading = 'lazy';
    
    div.appendChild(img);
    
    // Add delete button for authenticated users
    if (isAuthenticated) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '🗑️ Delete';
        deleteBtn.onclick = () => deleteImage(image.filename);
        div.appendChild(deleteBtn);
    }
    
    return div;
}

// Delete image
async function deleteImage(filename) {
    if (!confirm('Are you sure you want to delete this image?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/images/${filename}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadGallery();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to delete image');
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete image. Please try again.');
    }
}

// Handle Enter key in login form
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        passwordInput.focus();
    }
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginBtn.click();
    }
});

// Initialize app on page load
init();
