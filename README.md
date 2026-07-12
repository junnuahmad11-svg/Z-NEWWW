# Video Editor Pro - Full-Stack CapCut-Style Video Editor

A complete video editing application with real template system, 100+ fonts support, and full admin control panel.

## Features

### 🎬 Editor Features
- Multi-track timeline editing
- Drag & drop interface
- Text layers with animations
- 100+ custom fonts
- Real-time preview
- Auto-save functionality
- Export to video (720p/1080p)

### 📋 Template System
- Dynamic template loading
- Fully editable templates
- Custom timeline structures
- Media placeholders
- Template preview system

### 🎨 Font System
- Upload custom fonts (.ttf/.otf)
- Font categorization
- Real-time font loading
- Font preview in editor

### 👑 Admin Panel
- Template CRUD operations
- Font management
- User management
- Analytics dashboard
- Template usage tracking

### 🔐 Authentication
- JWT-based auth
- Role-based access (User/Admin)
- Protected routes
- Secure API endpoints

## Tech Stack

### Backend
- Node.js + Express
- MongoDB
- Firebase (optional)
- FFmpeg for video export
- JWT authentication
- Multer for file uploads

### Frontend
- React + Vite
- Zustand (state management)
- React Router
- Axios
- Tailwind CSS
- Fabric.js (canvas rendering)

## Installation

### Prerequisites
- Node.js 18+
- MongoDB
- FFmpeg

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
# Start MongoDB
mongod

# Run server
npm run dev
