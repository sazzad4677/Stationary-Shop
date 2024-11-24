## Introduction to the Stationary Shop API.

The Stationary Shop API is built with **Node.js** and **TypeScript**, with a RESTful architecture implemented using **Express.js**. The use of **MongoDB** ensures dependable and efficient data management for both products and orders.

#### Highlighted Features:

1. **Product Management**

   - Manage inventory to keep the store current.
   - Change the product information or delete the entries.
   - Detailed information about single product or a complete list.

2. **Order Management**:
   - Place an Order.
   - Access total revenue.
---

### Installation Guide

#### Prerequisites

- Ensure that **Node.js** (version 16 or higher) is installed.
- A active **MongoDB** instance or cloud connection.

#### Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/sazzad4677/Stationary-Shop.git
   cd Stationary-Shop
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Environment Variables**
   Create a `.env` file with the following configurations:

   ```plaintext
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   ```

4. **Run the Application**
   For development:
   ```bash
   yarn start-dev
   ```
   For production:
   ```bash
   yarn start-prod
   ```

---

### Available Endpoints

#### Products

| Method | Endpoint               | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| POST   | `/products`            | Add product to the inventory       |
| PUT    | `/products/:productId` | update the product                 |
| DELETE | `/products/:productId` | Delete a product by ID             |
| GET    | `/products/:productId` | Get details of a product           |
| GET    | `/products`            | Get all products                   |

#### Orders

| Method | Endpoint          | Description                   |
| ------ | ----------------- | ----------------------------- |
| POST   | `/orders`         | Place an order                |
| GET    | `/orders/revenue` | Fetch total revenue           |

---

### Technologies used

This project employs a modern stack:

- **Node.js** and **Express.js** for API logic.
- **TypeScript** for type-safe development.
- **MongoDB** (via **Mongoose**) for database interactions.
- Tools like **ESLint** and **Prettier** ensure code quality.
