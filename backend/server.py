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
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("JWT_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Auth Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
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
    user_id: str
    items: List[dict]
    total_amount: float
    status: str = "pending"
    payment_id: Optional[str] = None
    shipping_address: dict
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    items: List[dict]
    total_amount: float
    shipping_address: dict

class MockPayment(BaseModel):
    order_id: str
    amount: float

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
async def get_cart(guest_id: Optional[str] = None, current_user: Optional[User] = Depends(get_current_user)):
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
    
    return CartResponse(items=enriched_items, total=total)

@api_router.post("/cart/add")
async def add_to_cart(item_data: CartItemCreate, current_user: User = Depends(get_current_user)):
    # Check if product exists
    product = await db.products.find_one({"id": item_data.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if item already in cart
    existing_item = await db.cart_items.find_one({
        "user_id": current_user.id,
        "product_id": item_data.product_id
    })
    
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
            user_id=current_user.id,
            product_id=item_data.product_id,
            quantity=item_data.quantity
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
async def create_order(order_data: OrderCreate, current_user: User = Depends(get_current_user)):
    order = Order(
        user_id=current_user.id,
        **order_data.model_dump()
    )
    
    order_dict = prepare_for_mongo(order.model_dump())
    await db.orders.insert_one(order_dict)
    
    # Clear cart after order creation
    await db.cart_items.delete_many({"user_id": current_user.id})
    
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

# Mock Payment Routes
@api_router.post("/payments/create-order")
async def create_payment_order(payment_data: MockPayment):
    # Mock Razorpay order creation
    mock_order_id = f"order_mock_{str(uuid.uuid4())[:8]}"
    
    # Store mock payment data
    payment_doc = {
        "id": mock_order_id,
        "order_id": payment_data.order_id,
        "amount": payment_data.amount,
        "currency": "INR",
        "status": "created",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.mock_payments.insert_one(payment_doc)
    
    return {
        "id": mock_order_id,
        "amount": int(payment_data.amount * 100),  # Convert to paise
        "currency": "INR",
        "status": "created"
    }

class PaymentVerification(BaseModel):
    payment_id: str
    order_id: str

@api_router.post("/payments/verify")
async def verify_payment(verification_data: PaymentVerification):
    # Mock payment verification (always succeeds in mock)
    # Update order status
    await db.orders.update_one(
        {"id": verification_data.order_id},
        {"$set": {"status": "paid", "payment_id": verification_data.payment_id}}
    )
    
    # Update mock payment status
    await db.mock_payments.update_one(
        {"id": verification_data.payment_id},
        {"$set": {"status": "captured"}}
    )
    
    return {"status": "success", "message": "Payment verified successfully"}

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

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()