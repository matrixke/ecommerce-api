# E-Commerce API Documentation

Complete REST API documentation for the E-Commerce platform.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### Authentication

#### Register
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

---

### Products

#### List Products
```http
GET /products?page=1&limit=10&category=electronics&minPrice=10&maxPrice=100&search=laptop
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| category | string | Filter by category |
| minPrice | number | Minimum price filter |
| maxPrice | number | Maximum price filter |
| search | string | Text search query |
| sortBy | string | Field to sort by (default: createdAt) |
| order | string | Sort order: asc/desc (default: desc) |

**Response:**
```json
{
  "products": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Wireless Headphones",
      "description": "High-quality wireless headphones with noise cancellation",
      "price": 99.99,
      "category": "electronics",
      "images": ["/uploads/products/img1.jpg"],
      "stock": 50,
      "sku": "WH-001",
      "averageRating": 4.5,
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "totalProducts": 48
}
```

#### Get Single Product
```http
GET /products/:id
```

#### Create Product (Admin)
```http
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 49.99,
  "category": "electronics",
  "stock": 100,
  "sku": "PROD-001",
  "tags": ["wireless", "bluetooth"]
}
```

#### Update Product (Admin)
```http
PUT /products/:id
Authorization: Bearer <admin_token>
```

#### Delete Product (Admin)
```http
DELETE /products/:id
Authorization: Bearer <admin_token>
```

#### Add Product Review
```http
POST /products/:id/reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "review": "Great product! Highly recommended."
}
```

---

### Cart

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": "65a1b2c3d4e5f6g7h8i9j0k1",
  "items": [
    {
      "product": {
        "_id": "prod_id",
        "name": "Product Name",
        "images": ["/uploads/products/img1.jpg"]
      },
      "quantity": 2,
      "price": 49.99
    }
  ],
  "totalAmount": 99.98,
  "updatedAt": "2024-01-15T12:00:00Z"
}
```

#### Add to Cart
```http
POST /cart/add
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /cart/update
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /cart/remove/:productId
Authorization: Bearer <token>
```

#### Clear Cart
```http
DELETE /cart/clear
Authorization: Bearer <token>
```

---

### Orders

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "_id": "order_id",
  "user": "user_id",
  "items": [...],
  "totalAmount": 149.99,
  "orderStatus": "pending",
  "paymentStatus": "pending",
  "createdAt": "2024-01-15T12:00:00Z"
}
```

#### Get My Orders
```http
GET /orders
Authorization: Bearer <token>
```

#### Get Order Details
```http
GET /orders/:id
Authorization: Bearer <token>
```

#### Get All Orders (Admin)
```http
GET /orders/admin/all?page=1&limit=20&status=pending
Authorization: Bearer <admin_token>
```

#### Update Order Status (Admin)
```http
PUT /orders/:id/status
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "orderStatus": "shipped"
}
```

---

### Payment

#### Create Payment Intent
```http
POST /payment/create-payment-intent
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "order_id"
}
```

**Response:**
```json
{
  "clientSecret": "pi_123_secret_456",
  "publishableKey": "pk_test_..."
}
```

#### Confirm Payment
```http
POST /payment/confirm
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "order_id",
  "paymentIntentId": "pi_123"
}
```

---

### Admin

#### Upload Product Images
```http
POST /admin/products/:id/upload
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `images`: File array (max 5 files, JPEG/PNG/WebP only, max 5MB each)

#### Get Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "stats": {
    "totalProducts": 150,
    "totalOrders": 320,
    "totalUsers": 85,
    "totalRevenue": 15420.50
  },
  "recentOrders": [...],
  "ordersByStatus": [
    { "_id": "pending", "count": 10 },
    { "_id": "shipped", "count": 25 }
  ]
}
```

#### Get Low Stock Products
```http
GET /admin/low-stock?threshold=10
Authorization: Bearer <admin_token>
```

#### Get Sales Report
```http
GET /admin/sales-report?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <admin_token>
```

---

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Product Categories

- `electronics`
- `clothing`
- `food`
- `home`
- `sports`
- `books`
- `other`

---

## Order Status Values

- `pending` - Order received, awaiting processing
- `processing` - Order being prepared
- `shipped` - Order dispatched
- `delivered` - Order delivered
- `cancelled` - Order cancelled

---

## Payment Status Values

- `pending` - Awaiting payment
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

---

## Rate Limits

- General API: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes per IP

---

## Webhook Events

### Stripe Webhook

Endpoint: `POST /payment/webhook`

**Events handled:**
- `payment_intent.succeeded` - Updates order payment status

Configure your Stripe dashboard to send webhooks to this endpoint.
