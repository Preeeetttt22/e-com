# Eraya-ratna

[![Stars](https://img.shields.io/github/stars/Jeet-115/Eraya-ratna)](https://github.com/Jeet-115/Eraya-ratna/stargazers)
[![Forks](https://img.shields.io/github/forks/Jeet-115/Eraya-ratna)](https://github.com/Jeet-115/Eraya-ratna/network/members)

## Project Overview

This project is a full-stack e-commerce platform built using JavaScript, Node.js, and other modern web development technologies. It provides a comprehensive solution for managing products, categories, users, orders, and more. The frontend is located in the `erayaratna` directory, while the backend resides in the `backend` directory.

## Key Features & Benefits

- **User Authentication:** Secure user registration, login, and authentication.
- **Product Management:**  Admins can easily add, edit, and delete products.
- **Category Management:** Organize products into categories for easy navigation.
- **Shopping Cart:** Users can add products to their cart and proceed to checkout.
- **Order Processing:**  Seamless order creation, tracking, and management.
- **Payment Integration:**  Integration with payment gateways (e.g., Razorpay).
- **Admin Dashboard:** A comprehensive dashboard for managing the entire platform.
- **Address Management:** Users can manage their shipping addresses.
- **Event Management:** Display and manage events or promotions.
- **Newsletter Subscription:** Allows users to subscribe to a newsletter.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

- **Node.js:**  Version 14 or higher.
- **npm:** Node Package Manager (usually included with Node.js).
- **MongoDB:** A running instance of MongoDB for database storage.
- **Cloudinary Account:** For image storage.
- **Razorpay Account:** For payment processing.

## Installation & Setup Instructions

Follow these steps to set up the project:

### Backend Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Jeet-115/Eraya-ratna.git
    cd Eraya-ratna/backend
    ```

2.  **Install backend dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env` file in the `backend` directory and add the following variables:

    ```
    MONGO_URI=<your_mongodb_connection_string>
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    RAZORPAY_KEY_ID=<your_razorpay_key_id>
    RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
    JWT_SECRET=<your_jwt_secret>
    PORT=5000
    EMAIL_HOST=<your_email_host>
    EMAIL_PORT=<your_email_port>
    EMAIL_USER=<your_email_user>
    EMAIL_PASS=<your_email_password>
    ```

4.  **Start the backend server:**

    ```bash
    npm run start
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**

    ```bash
    cd ../erayaratna
    ```

2.  **Install frontend dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env` file in the `erayaratna` directory and add the following variables:

    ```
    VITE_API_BASE_URL=http://localhost:5000  # Or your deployed backend URL
    ```

4.  **Start the frontend development server:**

    ```bash
    npm run dev
    ```

## Usage Examples & API Documentation

### Backend API Endpoints

- **User Authentication:**
    - `POST /api/auth/register`: Register a new user.
    - `POST /api/auth/login`: Login an existing user.
    - `GET /api/auth/profile`: Get user profile information (requires authentication).

- **Product Management:**
    - `GET /api/products`: Get all products.
    - `GET /api/products/:id`: Get a specific product by ID.
    - `POST /api/products`: Create a new product (requires admin authentication).
    - `PUT /api/products/:id`: Update an existing product (requires admin authentication).
    - `DELETE /api/products/:id`: Delete a product (requires admin authentication).

- **Category Management:**
    - `GET /api/categories`: Get all categories.
    - `POST /api/categories`: Create a new category (requires admin authentication).

- **Cart Management:**
    - `POST /api/cart/add`: Add a product to the cart (requires authentication).
    - `GET /api/cart`: Get the user's cart (requires authentication).
    - `PUT /api/cart/update/:id`: Update the quantity of an item in the cart (requires authentication).
    - `DELETE /api/cart/remove/:id`: Remove an item from the cart (requires authentication).

- **Order Management:**
    - `POST /api/orders`: Create a new order (requires authentication).
    - `GET /api/orders/:id`: Get a specific order by ID (requires authentication).
    - `GET /api/orders/myorders`: Get all orders for the logged-in user (requires authentication).
    - `PUT /api/orders/:id/pay`: Update order to paid (requires authentication).
    - `GET /api/orders`: Get all orders (requires admin authentication).
    - `PUT /api/orders/:id/deliver`: Update order to delivered (requires admin authentication).
- **Address Management:**
    - `POST /api/address`: Add a new address (requires authentication).
    - `PUT /api/address/:id`: Update an existing address (requires authentication).
    - `DELETE /api/address/:id`: Delete an address (requires authentication).
- **Event Management:**
    - `GET /api/events`: Get all events.
    - `POST /api/events`: Create a new event (requires admin authentication).
    - `PUT /api/events/:id`: Update an event (requires admin authentication).
    - `DELETE /api/events/:id`: Delete an event (requires admin authentication).

### Frontend Usage

The frontend provides a user-friendly interface for browsing products, adding them to the cart, and placing orders. It also includes an admin dashboard for managing products, categories, users, and orders.  Refer to the `erayaratna/src` directory for component details and implementation.

## Configuration Options

- **Environment Variables:** Refer to the `.env` files in the `backend` and `erayaratna` directories for configurable settings.
- **Cloudinary Configuration:** The `cloudinaryConfig.js` file in the `backend/config` directory contains the Cloudinary configuration.
- **Database Connection:** The `db.js` file in the `backend/config` directory handles the MongoDB connection.

## Contributing Guidelines

Contributions are welcome! To contribute to this project, follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive commit messages.
4.  Push your changes to your forked repository.
5.  Submit a pull request to the main repository.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License Information

This project has no specified license. Please consult the repository owner, Jeet-115, for clarification.

## Acknowledgments

- This project utilizes the following open-source libraries and frameworks:
    - Node.js
    - Express.js
    - React
    - MongoDB
    - Mongoose
    - Cloudinary
    - Razorpay