# 📚 Stationary Shop API

A feature-rich REST API for a stationary shop, built with **Node.js, Express, TypeScript, and MongoDB**. This API handles **authentication, user management, product inventory, order processing, and payments**.

---

## 📃 Live URL

[Stationary Shop Live](https://stationary-shop-ux3o.onrender.com/)

---

## 📌 Features

- 🔒 **Authentication** (Register, Login, Logout, Refresh Token)
- 👥 **User Management** (Profile Updates, Admin Controls)
- 🛋 **Product Management** (CRUD, Image Upload with Cloudinary)
- 🛒 **Order Management** (Create, Update, Refund, Stripe Payment)
- 📊 **Dashboard for Admin** (Revenue & Order Analytics)
- 🌐 **Middleware for Validation, Error Handling, and Security**
- ☁ **Cloudinary for Image Uploads**
- ⚡ **Deployed on Render**

---

## 🏭 Project Structure

```
Stationary-Shop/
├── src/
│   ├── app/
│   │   ├── config/           # Application Configuration
│   │   ├── errors/           # Custom Error Handlers
│   │   ├── helper/           # Response Helpers
│   │   ├── interface/        # TypeScript Interfaces
│   │   ├── middleware/       # Authentication, Validation, Error Handling
│   ├── modules/
│   │   ├── auth/             # Authentication & User Registration
│   │   ├── admin/            # Admin Controls (Block Users, Manage Data)
│   │   ├── users/            # User Management (Profile, Role-based Access)
│   │   ├── products/         # CRUD Operations for Products
│   │   ├── orders/           # Order Processing, Refunds, Payments
│   │   ├── dashboard/        # Admin Dashboard (Analytics)
│   ├── routes/               # Route Definitions
│   ├── utils/                # Utility Functions (Async Handling, Cloudinary)
│   ├── uploads/              # Image Uploads (Stored Temporarily)
│   ├── app.ts                # Express App Configuration
│   ├── server.ts             # Server Entry Point
├── .env                      # Environment Variables
├── package.json              # Dependencies & Scripts
├── tsconfig.json             # TypeScript Configurations
├── Readme.md                 # Documentation
```

---

## 🛠 Technologies Used

- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, Role-based Access Control
- **File Uploads:** Multer, Cloudinary
- **Payments:** Stripe
- **Deployment:** Render

---

## ⚡ Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local or Cloud)
- **Cloudinary Account** (For Image Uploads)
- **Stripe Account** (For Payments)

### 🛠 Steps

1️⃣ **Clone the Repository**
```bash
git clone https://github.com/sazzad4677/Stationary-Shop.git
cd Stationary-Shop
```

2️⃣ **Install Dependencies**
```bash
yarn install  # or npm install
```

3️⃣ **Create a `.env` file**
```env
PORT=5000
MONGO_URI=your-mongodb-url
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
STRIPE_SECRET_KEY=your-stripe-key
```

4️⃣ **Run the Server**
```bash
yarn start-dev  # Development Mode
yarn start-prod # Production Mode
```

---

## 🔗 API Endpoints

### **Authentication**
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login & get a token
- `POST /auth/logout` - Logout the user
- `POST /auth/refresh-token` - Refresh JWT token

### **User Management**
- `GET /user/me` - Get logged-in user info
- `PATCH /user/me` - Update user profile
- `GET /user` - Get all users (Admin Only)

### **Admin**
- `PATCH /admin/users/:userId/block` - Block a user (Admin)

### **Products**
- `POST /products` - Add a product (Admin)
- `PUT /products/:productId` - Update a product (Admin)
- `DELETE /products/:productId` - Delete a product (Admin)
- `GET /products` - List all products
- `GET /products/:productId` - Get a single product
- `POST /products/generate-product-description` - AI-based description

### **Orders**
- `POST /orders` - Place an order
- `GET /orders/get-my-order` - Get logged-in user’s orders
- `GET /orders/:id` - Get order details (Admin)
- `PATCH /orders/:id` - Update order (Admin)
- `GET /orders/revenue` - Get revenue analytics (Admin)
- `GET /orders/pay-now/:orderId` - Process Stripe Payment
- `GET /orders/cancel/:orderId` - Cancel an order
- `GET /orders/initiate-refund/:orderId` - Initiate Refund (Admin)
- `POST /orders/webhook` - Stripe Webhook for Payments

### **Dashboard**
- `GET /dashboard` - Get Dashboard Stats (Admin)

---

## 🚀 Deployment

### Deploy on **Render**
1. Connect the repository to Render
2. Set up environment variables
3. Deploy the service

---

## 🛠 Contributing

👋 Contributions are welcome! Please follow these steps:

1️⃣ **Fork** the repository  
2️⃣ **Create a feature branch** (`feature/new-feature`)  
3️⃣ **Commit changes** (`git commit -m "Add new feature"`)  
4️⃣ **Push to GitHub** (`git push origin feature/new-feature`)  
5️⃣ **Submit a pull request** ✅

---

## 🐝 License

This project is **MIT Licensed**. See [LICENSE](LICENSE) for details.

---

🚀 **Happy Coding!** 🚀

