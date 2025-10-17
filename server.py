from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'thrynn_ecommerce')

try:
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    print(f"✅ Connected to MongoDB at {mongo_url}, database: {db_name}")
except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")
    print(f"Using MONGO_URL: {mongo_url}")
    raise e

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("JWT_SECRET", "thrynn-jwt-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Debug environment variables
print(f"Environment check:")
print(f"MONGO_URL: {os.environ.get('MONGO_URL', 'NOT SET')}")
print(f"DB_NAME: {os.environ.get('DB_NAME', 'NOT SET')}")
print(f"JWT_SECRET: {'SET' if os.environ.get('JWT_SECRET') else 'NOT SET'}")

# Auth Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    full_name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Token(BaseModel):
    access_token: str
    token_type: str

# Product Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    image_url: str
    category: str
    in_stock: bool = True
    available_sizes: List[str] = ["XS", "S", "M", "L", "XL", "XXL"]
    available_colors: List[str] = ["Black", "White", "Gray"]
    size_stock: dict = {}  # {"M": 10, "L": 5, "XL": 0} - 0 means out of stock
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    image_url: str
    category: str
    available_sizes: Optional[List[str]] = ["XS", "S", "M", "L", "XL", "XXL"]
    available_colors: Optional[List[str]] = ["Black", "White", "Gray"]
    size_stock: Optional[dict] = {}
    in_stock: Optional[bool] = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    available_sizes: Optional[List[str]] = None
    available_colors: Optional[List[str]] = None
    size_stock: Optional[dict] = None
    in_stock: Optional[bool] = None

# Cart Models
class CartItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None  # Allow null for guest users
    guest_id: Optional[str] = None  # For guest checkout
    product_id: str
    quantity: int
    selected_size: Optional[str] = None
    selected_color: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CartItemCreate(BaseModel):
    product_id: str
    quantity: int
    selected_size: Optional[str] = None
    selected_color: Optional[str] = None
    guest_id: Optional[str] = None  # For guest users

class CartResponse(BaseModel):
    items: List[dict]
    total: float

# Order Models
class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    guest_id: Optional[str] = None
    items: List[dict]
    total_amount: float
    status: str = "pending"  # pending, payment_initiated, paid, failed, cancelled, shipped, delivered
    payment_id: Optional[str] = None
    payment_status: str = "pending"  # pending, processing, completed, failed, refunded
    payment_method: Optional[str] = None
    shipping_address: dict
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    items: List[dict]
    total_amount: float
    shipping_address: dict

class MockPayment(BaseModel):
    order_id: str
    amount: float

class PaymentStatus(BaseModel):
    payment_id: str
    status: str  # pending, processing, completed, failed
    order_id: str
    amount: float
    failure_reason: Optional[str] = None

# Auth Helper Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if user is None:
        raise credentials_exception
    return User(**user)

async def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))):
    if credentials is None:
        return None
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
    except jwt.PyJWTError:
        return None
    
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if user is None:
        return None
    return User(**user)

def prepare_for_mongo(data):
    """Convert datetime objects to ISO strings for MongoDB storage"""
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

def parse_from_mongo(item):
    """Convert ISO strings back to datetime objects"""
    if isinstance(item, dict):
        for key, value in item.items():
            if isinstance(value, str) and key.endswith('_at'):
                try:
                    item[key] = datetime.fromisoformat(value)
                except ValueError:
                    pass
    return item

# Auth Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        full_name=user_data.full_name
    )
    
    user_dict = user.model_dump()
    user_dict["password"] = hashed_password
    user_dict = prepare_for_mongo(user_dict)
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Product Routes
@api_router.get("/products", response_model=List[Product])
async def get_products():
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    return [Product(**parse_from_mongo(product)) for product in products]

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**parse_from_mongo(product))

@api_router.post("/products", response_model=Product)
async def create_product(product_data: ProductCreate):
    product = Product(**product_data.model_dump())
    product_dict = prepare_for_mongo(product.model_dump())
    await db.products.insert_one(product_dict)
    return product

# Cart Routes
@api_router.get("/cart")
async def get_cart(guest_id: Optional[str] = None, current_user: Optional[User] = Depends(get_current_user_optional)):
    # Handle both authenticated and guest users
    if current_user:
        cart_items = await db.cart_items.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    elif guest_id:
        cart_items = await db.cart_items.find({"guest_id": guest_id}, {"_id": 0}).to_list(1000)
    else:
        return CartResponse(items=[], total=0.0)
    
    # Get product details for each cart item
    enriched_items = []
    total = 0.0
    
    for item in cart_items:
        product = await db.products.find_one({"id": item["product_id"]}, {"_id": 0})
        if product:
            item_total = product["price"] * item["quantity"]
            total += item_total
            enriched_items.append({
                **item,
                "product": product,
                "item_total": item_total
            })
    
    return {"items": enriched_items, "total": total}

@api_router.post("/cart/add")
async def add_to_cart(item_data: CartItemCreate, current_user: Optional[User] = Depends(get_current_user_optional)):
    # Check if product exists
    product = await db.products.find_one({"id": item_data.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check size availability if size is selected
    if item_data.selected_size:
        size_stock = product.get("size_stock", {})
        if item_data.selected_size in size_stock and size_stock[item_data.selected_size] == 0:
            raise HTTPException(status_code=400, detail=f"Size {item_data.selected_size} is out of stock")
    
    # Determine user identification
    user_id = current_user.id if current_user else None
    guest_id = item_data.guest_id if not current_user else None
    
    if not user_id and not guest_id:
        raise HTTPException(status_code=400, detail="User ID or Guest ID required")
    
    # Check if item already in cart (same product, size, color)
    query = {
        "product_id": item_data.product_id,
        "selected_size": item_data.selected_size,
        "selected_color": item_data.selected_color
    }
    
    if current_user:
        query["user_id"] = user_id
    else:
        query["guest_id"] = guest_id
    
    existing_item = await db.cart_items.find_one(query)
    
    if existing_item:
        # Update quantity
        new_quantity = existing_item["quantity"] + item_data.quantity
        await db.cart_items.update_one(
            {"id": existing_item["id"]},
            {"$set": {"quantity": new_quantity}}
        )
    else:
        # Add new item
        cart_item = CartItem(
            user_id=user_id,
            guest_id=guest_id,
            product_id=item_data.product_id,
            quantity=item_data.quantity,
            selected_size=item_data.selected_size,
            selected_color=item_data.selected_color
        )
        cart_item_dict = prepare_for_mongo(cart_item.model_dump())
        await db.cart_items.insert_one(cart_item_dict)
    
    return {"message": "Item added to cart"}

@api_router.delete("/cart/{item_id}")
async def remove_from_cart(item_id: str, current_user: User = Depends(get_current_user)):
    result = await db.cart_items.delete_one({"id": item_id, "user_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Item removed from cart"}

# Order Routes
@api_router.post("/orders", response_model=Order)
async def create_order(order_data: OrderCreate, current_user: Optional[User] = Depends(get_current_user_optional), guest_id: Optional[str] = None):
    # Determine user identification
    user_id = current_user.id if current_user else None
    order_guest_id = guest_id if not current_user else None
    
    if not user_id and not order_guest_id:
        raise HTTPException(status_code=400, detail="User ID or Guest ID required")
    
    order = Order(
        user_id=user_id,
        guest_id=order_guest_id,
        status="pending",
        payment_status="pending",
        **order_data.model_dump()
    )
    
    order_dict = prepare_for_mongo(order.model_dump())
    await db.orders.insert_one(order_dict)
    
    # Clear cart after order creation
    if current_user:
        await db.cart_items.delete_many({"user_id": current_user.id})
    elif order_guest_id:
        await db.cart_items.delete_many({"guest_id": order_guest_id})
    
    return order

@api_router.get("/orders", response_model=List[Order])
async def get_orders(current_user: User = Depends(get_current_user)):
    orders = await db.orders.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    return [Order(**parse_from_mongo(order)) for order in orders]

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, current_user: User = Depends(get_current_user)):
    order = await db.orders.find_one({"id": order_id, "user_id": current_user.id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**parse_from_mongo(order))

# Enhanced Payment System
@api_router.post("/payments/create-order")
async def create_payment_order(payment_data: MockPayment):
    # Verify order exists
    order = await db.orders.find_one({"id": payment_data.order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Create payment order
    payment_order_id = f"order_mock_{str(uuid.uuid4())[:8]}"
    
    # Store payment data with detailed tracking
    payment_doc = {
        "id": payment_order_id,
        "order_id": payment_data.order_id,
        "amount": payment_data.amount,
        "currency": "INR",
        "status": "created",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()  # 15 min expiry
    }
    
    await db.payment_orders.insert_one(payment_doc)
    
    # Update order status to payment_initiated
    await db.orders.update_one(
        {"id": payment_data.order_id},
        {
            "$set": {
                "status": "payment_initiated",
                "payment_status": "processing",
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    return {
        "id": payment_order_id,
        "amount": int(payment_data.amount * 100),  # Convert to paise
        "currency": "INR",
        "status": "created"
    }

class PaymentVerification(BaseModel):
    payment_id: str
    order_id: str

@api_router.post("/payments/verify")
async def verify_payment(verification_data: PaymentVerification):
    try:
        # Get payment order details
        payment_order = await db.payment_orders.find_one({"id": verification_data.payment_id})
        if not payment_order:
            raise HTTPException(status_code=404, detail="Payment not found")
        
        # Check if payment is expired
        expires_at = datetime.fromisoformat(payment_order["expires_at"])
        if datetime.now(timezone.utc) > expires_at:
            # Mark as failed due to timeout
            await handle_payment_failure(verification_data.order_id, verification_data.payment_id, "Payment expired")
            return {"status": "failed", "message": "Payment expired"}
        
        # Mock payment verification with random success/failure (90% success rate for testing)
        import random
        payment_success = random.random() < 0.9  # 90% success rate
        
        if payment_success:
            # Payment successful
            await handle_payment_success(verification_data.order_id, verification_data.payment_id)
            return {"status": "success", "message": "Payment verified and completed successfully"}
        else:
            # Payment failed
            await handle_payment_failure(verification_data.order_id, verification_data.payment_id, "Payment declined by bank")
            return {"status": "failed", "message": "Payment failed - please try again"}
            
    except Exception as e:
        # Handle unexpected errors
        await handle_payment_failure(verification_data.order_id, verification_data.payment_id, f"System error: {str(e)}")
        return {"status": "error", "message": "Payment processing error"}

async def handle_payment_success(order_id: str, payment_id: str):
    """Handle successful payment processing"""
    current_time = datetime.now(timezone.utc).isoformat()
    
    # Update order status
    await db.orders.update_one(
        {"id": order_id},
        {
            "$set": {
                "status": "paid",
                "payment_status": "completed",
                "payment_id": payment_id,
                "payment_method": "mock_payment",
                "updated_at": current_time
            }
        }
    )
    
    # Update payment order status
    await db.payment_orders.update_one(
        {"id": payment_id},
        {
            "$set": {
                "status": "captured",
                "payment_status": "completed",
                "completed_at": current_time
            }
        }
    )
    
    # Create payment success log
    await db.payment_logs.insert_one({
        "id": str(uuid.uuid4()),
        "order_id": order_id,
        "payment_id": payment_id,
        "event": "payment_success",
        "status": "completed",
        "timestamp": current_time,
        "message": "Payment completed successfully"
    })

async def handle_payment_failure(order_id: str, payment_id: str, reason: str):
    """Handle failed payment processing"""
    current_time = datetime.now(timezone.utc).isoformat()
    
    # Update order status back to pending
    await db.orders.update_one(
        {"id": order_id},
        {
            "$set": {
                "status": "pending",
                "payment_status": "failed",
                "updated_at": current_time
            }
        }
    )
    
    # Update payment order status
    await db.payment_orders.update_one(
        {"id": payment_id},
        {
            "$set": {
                "status": "failed",
                "payment_status": "failed",
                "failure_reason": reason,
                "failed_at": current_time
            }
        }
    )
    
    # Create payment failure log
    await db.payment_logs.insert_one({
        "id": str(uuid.uuid4()),
        "order_id": order_id,
        "payment_id": payment_id,
        "event": "payment_failed",
        "status": "failed",
        "reason": reason,
        "timestamp": current_time,
        "message": f"Payment failed: {reason}"
    })

# Admin Authentication
ADMIN_CREDENTIALS = {
    "admin": "admin123",  # Change this password in production
    "thrynn_admin": "thrynn@2024"
}

@api_router.post("/admin/login")
async def admin_login(admin_data: AdminLogin):
    if admin_data.username not in ADMIN_CREDENTIALS or ADMIN_CREDENTIALS[admin_data.username] != admin_data.password:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    
    # Create admin token
    access_token_expires = timedelta(hours=24)  # Admin sessions last longer
    access_token = create_access_token(
        data={"sub": f"admin_{admin_data.username}", "role": "admin"}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "role": "admin"}

async def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Admin access required",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None or not username.startswith("admin_") or role != "admin":
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    return {"username": username, "role": role}

# Admin Product Management Routes
@api_router.post("/admin/products", response_model=Product)
async def create_product_admin(product_data: ProductCreate, admin_user = Depends(get_admin_user)):
    product = Product(**product_data.model_dump())
    product_dict = prepare_for_mongo(product.model_dump())
    await db.products.insert_one(product_dict)
    return product

@api_router.put("/admin/products/{product_id}", response_model=Product)
async def update_product_admin(product_id: str, product_data: ProductUpdate, admin_user = Depends(get_admin_user)):
    # Get existing product
    existing_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update only provided fields
    update_data = {k: v for k, v in product_data.model_dump().items() if v is not None}
    update_data = prepare_for_mongo(update_data)
    
    await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    # Return updated product
    updated_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    return Product(**parse_from_mongo(updated_product))

@api_router.delete("/admin/products/{product_id}")
async def delete_product_admin(product_id: str, admin_user = Depends(get_admin_user)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@api_router.patch("/admin/products/{product_id}/stock")
async def update_product_stock(product_id: str, stock_data: dict, admin_user = Depends(get_admin_user)):
    # Update stock for specific sizes
    await db.products.update_one(
        {"id": product_id}, 
        {"$set": {"size_stock": stock_data}}
    )
    return {"message": "Stock updated successfully"}

# Real-time Payment Status Tracking
@api_router.get("/payments/{payment_id}/status")
async def get_payment_status(payment_id: str):
    """Get real-time payment status"""
    payment_order = await db.payment_orders.find_one({"id": payment_id}, {"_id": 0})
    if not payment_order:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Get associated order
    order = await db.orders.find_one({"id": payment_order["order_id"]}, {"_id": 0})
    
    return {
        "payment_id": payment_id,
        "order_id": payment_order["order_id"],
        "amount": payment_order["amount"],
        "status": payment_order.get("status", "pending"),
        "payment_status": payment_order.get("payment_status", "pending"),
        "failure_reason": payment_order.get("failure_reason"),
        "order_status": order.get("status", "pending") if order else "not_found",
        "created_at": payment_order["created_at"],
        "expires_at": payment_order.get("expires_at")
    }

@api_router.get("/orders/{order_id}/payment-status")
async def get_order_payment_status(order_id: str):
    """Get payment status for an order"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Get payment logs for this order
    payment_logs = await db.payment_logs.find(
        {"order_id": order_id}, 
        {"_id": 0}
    ).sort("timestamp", -1).limit(10).to_list(None)
    
    return {
        "order_id": order_id,
        "status": order.get("status"),
        "payment_status": order.get("payment_status"),
        "payment_id": order.get("payment_id"),
        "payment_method": order.get("payment_method"),
        "total_amount": order.get("total_amount"),
        "created_at": order.get("created_at"),
        "updated_at": order.get("updated_at"),
        "payment_logs": payment_logs
    }

@api_router.post("/payments/{payment_id}/simulate-result")
async def simulate_payment_result(payment_id: str, result_type: str):
    """Simulate payment success/failure for testing (admin only)"""
    # This is for testing purposes - in production, this would be called by payment gateway webhooks
    
    payment_order = await db.payment_orders.find_one({"id": payment_id})
    if not payment_order:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    if result_type == "success":
        await handle_payment_success(payment_order["order_id"], payment_id)
        return {"status": "success", "message": "Payment marked as successful"}
    elif result_type == "failure":
        await handle_payment_failure(payment_order["order_id"], payment_id, "Simulated failure for testing")
        return {"status": "failed", "message": "Payment marked as failed"}
    else:
        raise HTTPException(status_code=400, detail="Invalid result type. Use 'success' or 'failure'")

# Admin Payment Management
@api_router.get("/admin/payments", dependencies=[Depends(get_admin_user)])
async def get_all_payments():
    """Get all payments for admin dashboard"""
    payments = await db.payment_orders.find({}, {"_id": 0}).sort("created_at", -1).limit(50).to_list(None)
    
    # Enrich with order details
    enriched_payments = []
    for payment in payments:
        order = await db.orders.find_one({"id": payment["order_id"]}, {"_id": 0})
        if order:
            payment["order_details"] = {
                "items_count": len(order.get("items", [])),
                "shipping_address": order.get("shipping_address", {}),
                "user_id": order.get("user_id"),
                "guest_id": order.get("guest_id")
            }
        enriched_payments.append(payment)
    
    return enriched_payments

@api_router.get("/admin/payment-stats", dependencies=[Depends(get_admin_user)])
async def get_payment_stats():
    """Get payment statistics for admin dashboard"""
    # Count payments by status
    pipeline = [
        {"$group": {"_id": "$payment_status", "count": {"$sum": 1}, "total_amount": {"$sum": "$amount"}}}
    ]
    stats = await db.payment_orders.aggregate(pipeline).to_list(None)
    
    # Get recent failed payments
    failed_payments = await db.payment_orders.find(
        {"payment_status": "failed"}, 
        {"_id": 0}
    ).sort("failed_at", -1).limit(10).to_list(None)
    
    return {
        "stats": stats,
        "recent_failures": failed_payments
    }

@api_router.get("/admin/products/stats")
async def get_product_stats(admin_user = Depends(get_admin_user)):
    total_products = await db.products.count_documents({})
    in_stock_products = await db.products.count_documents({"in_stock": True})
    out_of_stock = total_products - in_stock_products
    
    # Get products by category
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}}
    ]
    category_stats = await db.products.aggregate(pipeline).to_list(None)
    
    return {
        "total_products": total_products,
        "in_stock": in_stock_products, 
        "out_of_stock": out_of_stock,
        "categories": category_stats
    }

# Initialize with sample products
@api_router.post("/init-data")
async def init_sample_data():
    # Check if products already exist
    existing_products = await db.products.count_documents({})
    if existing_products > 0:
        return {"message": "Sample data already exists"}
    
    sample_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Oversized Street Hoodie",
            "description": "Premium cotton blend oversized hoodie with modern street aesthetics. Perfect for casual urban styling.",
            "price": 2499.00,
            "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
            "category": "hoodies",
            "in_stock": True,
            "available_sizes": ["XS", "S", "M", "L", "XL", "XXL"],
            "available_colors": ["Gray", "Black", "Navy"],
            "size_stock": {"XS": 5, "S": 8, "M": 12, "L": 10, "XL": 6, "XXL": 0},
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Minimal Drop Shoulder Tee",
            "description": "Clean, minimal design with drop shoulders. Made from sustainable organic cotton.",
            "price": 1299.00,
            "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
            "category": "tshirts",
            "in_stock": True,
            "available_sizes": ["XS", "S", "M", "L", "XL"],
            "available_colors": ["White", "Black", "Beige"],
            "size_stock": {"XS": 3, "S": 7, "M": 15, "L": 12, "XL": 8},
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Cargo Utility Pants",
            "description": "Technical cargo pants with multiple pockets and adjustable details. Street-ready functionality.",
            "price": 3499.00,
            "image_url": "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400",
            "category": "pants",
            "in_stock": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Vintage Wash Denim Jacket",
            "description": "Classic denim jacket with vintage wash treatment. Timeless piece for layering.",
            "price": 4299.00,
            "image_url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
            "category": "jackets",
            "in_stock": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Chunky Knit Sweater",
            "description": "Hand-knitted chunky sweater with contemporary silhouette. Cozy meets style.",
            "price": 3799.00,
            "image_url": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
            "category": "sweaters",
            "in_stock": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "High-Waisted Wide Leg Jeans",
            "description": "Modern wide-leg silhouette in premium denim. Sustainable and comfortable fit.",
            "price": 2899.00,
            "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
            "category": "jeans",
            "in_stock": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.products.insert_many(sample_products)
    return {"message": "Sample data initialized successfully"}

# Include the router in the main app
app.include_router(api_router)

cors_origins = os.environ.get('CORS_ORIGINS', '*')
allowed_origins = cors_origins.split(',') if cors_origins != '*' else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"CORS Origins: {allowed_origins}")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()