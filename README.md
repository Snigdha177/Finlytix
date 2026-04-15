# Finlytix – Professional Money Management

Finlytix is a full-stack personal finance analytics platform built using the MERN stack. It helps users track expenses, manage budgets, and gain intelligent insights into their spending habits.

## 🎯 Features

### Core Features
- ✅ **User Authentication** - Secure JWT-based authentication with password hashing
- ✅ **Dashboard** - Real-time financial overview with charts and statistics
- ✅ **Transaction Management** - Track income and expenses with detailed categorization
- ✅ **Budget Tracking** - Create monthly budgets and monitor spending with visual progress
- ✅ **Category Management** - Organize transactions with custom expense/income categories
- ✅ **Advanced Analytics** - 30-day trends, category breakdown, spending patterns
- ✅ **Dark/Light Mode** - Beautiful UI with theme toggle support
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### Advanced Features
- 📊 **Interactive Charts** - Line charts for trends, pie charts for category breakdown
- 💾 **CSV Export** - Download transaction data for analysis
- 🔔 **Budget Alerts** - Visual warnings when approaching budget limits
- 🎨 **Customizable** - Multiple currencies, notification thresholds, preferences
- 📱 **Mobile Optimized** - Touch-friendly interface and responsive layout
- ⚡ **Real-time Updates** - Socket.IO integration for live notifications

## 🛠 Tech Stack

### Frontend
- **React 18.2** - UI library with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS 3.3** - Utility-first styling
- **Zustand** - Lightweight state management
- **Recharts** - Beautiful charts and visualizations
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **date-fns** - Date manipulation

### Backend
- **Node.js + Express 4.18** - Web server framework
- **MongoDB + Mongoose 7.5** - Database and ODM
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **Socket.IO** - Real-time communication
- **Nodemailer** - Email notifications
- **express-validator** - Input validation

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Environment Variables** - Configuration management

## 📁 Project Structure

```
Finance Tracker/
├── server/                    # Backend
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── email.js          # Nodemailer setup
│   ├── middleware/
│   │   └── auth.js           # JWT authentication & error handling
│   ├── models/
│   │   ├── User.js           # User schema with password hashing
│   │   ├── Transaction.js    # Transaction schema
│   │   ├── Category.js       # Category schema
│   │   ├── Budget.js         # Budget schema
│   │   ├── Notification.js   # Notification schema
│   │   └── Attachment.js     # File attachment schema
│   ├── controllers/
│   │   ├── authController.js       # Auth operations
│   │   ├── transactionController.js # Transaction CRUD
│   │   ├── categoryController.js    # Category CRUD
│   │   ├── budgetController.js      # Budget CRUD
│   │   └── notificationController.js # Notification management
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── budgetRoutes.js
│   │   └── notificationRoutes.js
│   ├── utils/
│   │   ├── jwt.js            # JWT token utilities
│   │   └── response.js       # Standard response formatter
│   ├── services/
│   │   └── emailService.js   # Email sending service
│   ├── scripts/
│   │   └── seedData.js       # Database seeding
│   ├── server.js             # Main Express app
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   └── .env.example
│
└── client/                    # Frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── TransactionChart.jsx
    │   │   ├── CategoryChart.jsx
    │   │   ├── RecentTransactions.jsx
    │   │   └── BudgetOverview.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── TransactionsPage.jsx
    │   │   ├── CategoriesPage.jsx
    │   │   ├── BudgetsPage.jsx
    │   │   └── SettingsPage.jsx
    │   ├── services/
    │   │   └── api.js         # API client with interceptors
    │   ├── store/
    │   │   ├── authStore.js   # Auth state management
    │   │   └── dataStore.js   # Data state management
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   └── useData.js
    │   ├── utils/
    │   │   └── helpers.js     # Utility functions
    │   ├── App.jsx
    │   ├── index.jsx
    │   ├── index.css
    │   └── .env.example
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## License

MIT License - feel free to use this project

## 🤝 Support

For issues or questions, create an issue in the repository.

## 📧 Contact

Built with ❤️ for financial tracking excellence.
