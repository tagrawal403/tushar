# THRYNN E-commerce Backend

FastAPI backend for THRYNN streetwear e-commerce platform.

## Features
- JWT Authentication
- Product Management  
- Shopping Cart
- Order Processing
- Payment Tracking (Mock Razorpay)
- Admin Dashboard
- Guest Checkout

## Railway Deployment

### Environment Variables Required:
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=thrynn_ecommerce
JWT_SECRET=your-secret-key
CORS_ORIGINS=*
```

### Auto-Deploy:
Railway will automatically detect FastAPI and deploy using:
- `requirements.txt` for dependencies
- `Procfile` for start command
- `railway.json` for configuration

### API Endpoints:
- `GET /api/products` - List products
- `POST /api/auth/register` - User registration
- `POST /api/cart/add` - Add to cart
- `POST /api/orders` - Create order
- `GET /api/admin/products/stats` - Admin stats

## Local Development:
```bash
pip install -r requirements.txt
uvicorn server:app --reload
```
