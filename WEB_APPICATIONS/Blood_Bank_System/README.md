# Blood Bank Management System

A comprehensive web application for managing blood bank operations, connecting donors with recipients to save lives.

## Features

### Admin Dashboard
- **Real-time Analytics** - Monitor blood inventory, user activity, and system health
- **User Management** - Manage donors, recipients, and admin accounts
- **Request Management** - Approve/reject blood requests with status tracking
- **Inventory Control** - Track blood units with automatic updates and low stock alerts

### User Features
- **Blood Donation** - Easy donation registration and history tracking
- **Blood Requests** - Submit requests with urgency levels and hospital details
- **Availability Check** - Real-time blood availability before making requests
- **Personal Dashboard** - Track donations and requests

### System Features
- **Role-based Access** - Separate interfaces for admins and users
- **Auto-inventory Updates** - Automatic stock adjustments on approvals
- **Status Management** - Comprehensive request status tracking
- **Responsive Design** - Modern, mobile-friendly interface

## Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** authentication
- **bcryptjs** for password hashing

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd bloodbank-backend
npm install
cp .env.example .env  # Configure your environment variables
npm start
```

### Frontend Setup
```bash
cd bloodbank-frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory:
```
MONGO_URI=mongodb://localhost:27017/bloodbank
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Admin Routes
- `GET /api/admin/users` - Get all users
- `GET /api/admin/requests` - Get all requests
- `GET /api/admin/health` - System health check

### Inventory
- `GET /api/inventory/stats` - Get inventory statistics
- `POST /api/inventory` - Add inventory (donations)

### Requests
- `POST /api/recipient/request` - Submit blood request
- `GET /api/recipient/my-requests` - Get user's requests
- `PUT /api/recipient/requests/:id/status` - Update request status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For support or questions, please contact the development team.

---

**Blood Bank System** - Saving lives through technology 🩸