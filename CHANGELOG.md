# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Initial release with full e-commerce functionality
- JWT authentication with refresh tokens
- Product catalog with search, filtering, and pagination
- Shopping cart with stock validation
- Order management system
- Stripe payment integration
- Image upload with Multer (up to 5 images per product)
- Admin dashboard with sales analytics
- Rate limiting and security headers
- Comprehensive test suite with Jest

### Security
- Helmet.js for security headers
- Express-rate-limit for API protection
- bcrypt password hashing
- JWT token authentication
