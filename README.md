<<<<<<< HEAD
# E-Commerce API

A robust, production-ready REST API for e-commerce applications built with Node.js and Express. Features JWT authentication, product catalog with advanced filtering, shopping cart logic, order management, Stripe payment integration, image uploads, and an admin dashboard.

## Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Product Catalog**: Full CRUD operations with search, filtering by category/price, and sorting
- **Shopping Cart**: Persistent cart with add/remove/update functionality
- **Order Management**: Complete order lifecycle from creation to fulfillment
- **Mock Payment Gateway**: Stripe integration for secure payments
- **Image Uploading**: Multer-based image upload for product photos (up to 5 images per product)
- **Admin Dashboard**: Inventory management, sales reports, and order tracking

### Advanced Features
- **Rate Limiting**: API protection with express-rate-limit
- **Security**: Helmet.js for security headers
- **Data Validation**: express-validator for input sanitization
- **Text Search**: MongoDB text indexes for product search
- **Pagination**: Efficient pagination for all list endpoints
- **Stock Management**: Automatic stock reduction on order completion

## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe API
- **File Upload**: Multer
- **Security**: Helmet, express-rate-limit, bcryptjs
- **Validation**: express-validator
- **Testing**: Jest, Supertest

## How to Install

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- Stripe account (for payment features)

### Installation Steps

```bash
# Clone or navigate to the repository
cd "E-Commerce API"

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Create uploads directory
mkdir -p uploads/products

# Start the server (development)
npm run dev

# Or start in production mode
npm start
```

### Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

## API Documentation

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Product Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products (with filters) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Soft delete product (Admin) |
| POST | `/api/products/:id/reviews` | Add product review |

### Cart Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update` | Update cart item quantity |
| DELETE | `/api/cart/remove/:productId` | Remove item from cart |
| DELETE | `/api/cart/clear` | Clear entire cart |

### Order Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order from cart |
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get order details |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/low-stock` | Low stock alerts |
| GET | `/api/admin/sales-report` | Sales analytics |
| POST | `/api/admin/products/:id/upload` | Upload product images |
| GET | `/api/orders/admin/all` | All orders (admin) |
| PUT | `/api/orders/:id/status` | Update order status |

### Payment Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-payment-intent` | Create Stripe payment |
| POST | `/api/payment/confirm` | Confirm payment |

## Query Parameters

### Products
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category
- `minPrice` / `maxPrice` - Price range filter
- `search` - Text search query
- `sortBy` - Field to sort by
- `order` - Sort order (asc/desc)

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

The test suite includes:
- Authentication flows (register, login)
- Product CRUD operations
- Cart management
- Order creation
- Admin functionality

## Project Structure

```
E-Commerce API/
├── src/
│   ├── server.js          # Entry point
│   ├── models/            # Database models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── admin.js
│   │   └── payment.js
│   └── middleware/        # Custom middleware
│       └── auth.js
├── tests/                 # Unit tests
├── uploads/               # File uploads
├── package.json
├── .env.example
└── README.md
```

## License

MIT
=======
# ecommerce-api
Production-ready E-Commerce REST API with JWT authentication, product catalog, shopping cart, Stripe payments, and admin dashboard
>>>>>>> 58707dbb558287661c0f260fad13062d732faf21
