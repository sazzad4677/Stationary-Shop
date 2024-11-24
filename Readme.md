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

| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| POST   | `/products`            | Add product to the inventory |
| PUT    | `/products/:productId` | update the product           |
| DELETE | `/products/:productId` | Delete a product by ID       |
| GET    | `/products/:productId` | Get details of a product     |
| GET    | `/products`            | Get all products             |

#### Orders

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| POST   | `/orders`         | Place an order      |
| GET    | `/orders/revenue` | Fetch total revenue |

---

## Available Scripts

- **`yarn start-dev`**: Start the app in development mode with hot reloading.
- **`yarn start-prod`**: Run the compiled app in production mode.
- **`yarn format`**: Format the code using Prettier.
- **`yarn lint`**: Check for linting errors using ESLint.
- **`yarn lint:fix`**: Fix linting issues automatically.

---

## Dependencies

### Core Dependencies

- **Express**: Web framework for building APIs.
- **Mongoose**: ODM for MongoDB.
- **dotenv**: Environment variable management.
- **cors**: Enable cross-origin requests.

### Development Dependencies

- **TypeScript**: Type-safe JavaScript.
- **ts-node-dev**: Hot reloading for development.
- **ESLint**: Static code analysis.
- **Prettier**: Code formatter.

---

## Contributing

Contributions are welcome! Please fork this repository, create a feature branch, and submit a pull request.

## License

This project is licensed under the [ISC License](LICENSE).
