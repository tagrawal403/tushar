#!/usr/bin/env python3
"""
Test MongoDB Atlas Connection
Run this to verify your connection string works
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys

async def test_mongodb_connection(connection_string):
    """Test MongoDB connection"""
    print("🔍 Testing MongoDB connection...")
    print(f"Connection: {connection_string[:50]}...")
    
    try:
        # Create client
        client = AsyncIOMotorClient(connection_string)
        
        # Test connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        
        # List databases
        db_list = await client.list_database_names()
        print(f"📊 Available databases: {db_list}")
        
        # Test your specific database
        db = client['thrynn_ecommerce']
        collections = await db.list_collection_names()
        print(f"📦 Collections in thrynn_ecommerce: {collections}")
        
        # Insert test document
        test_doc = {"test": "connection successful", "app": "thrynn"}
        result = await db.test_collection.insert_one(test_doc)
        print(f"✅ Test document inserted with ID: {result.inserted_id}")
        
        # Clean up test document
        await db.test_collection.delete_one({"_id": result.inserted_id})
        print("🧹 Test document cleaned up")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python test_mongodb.py 'your_connection_string'")
        print("Example: python test_mongodb.py 'mongodb+srv://user:pass@cluster.mongodb.net/'")
        sys.exit(1)
    
    connection_string = sys.argv[1]
    success = asyncio.run(test_mongodb_connection(connection_string))
    
    if success:
        print("\n🎉 Your MongoDB Atlas setup is perfect!")
        print("✅ You can now use this connection string for Railway deployment")
    else:
        print("\n❌ Please check your connection string and try again")
        print("💡 Common issues:")
        print("   - Wrong username/password")
        print("   - IP address not whitelisted (add 0.0.0.0/0)")
        print("   - Network connectivity issues")