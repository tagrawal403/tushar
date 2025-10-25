import requests
import sys
import json
from datetime import datetime

class ThrynneCommerceAPITester:
    def __init__(self, base_url="https://thrynn-wear.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f", Expected: {expected_status}"
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"

            self.log_test(name, success, details)
            
            if success:
                try:
                    return response.json()
                except:
                    return {}
            return None

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return None

    def test_sample_data_initialization(self):
        """Test sample data initialization"""
        print("\n🔧 Testing Sample Data Initialization...")
        result = self.run_test(
            "Initialize Sample Data",
            "POST",
            "init-data",
            200
        )
        return result is not None

    def test_user_registration(self):
        """Test user registration"""
        print("\n👤 Testing User Registration...")
        test_user_data = {
            "email": f"test_user_{datetime.now().strftime('%H%M%S')}@thrynn.com",
            "password": "TestPass123!",
            "full_name": "Test User"
        }
        
        result = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if result and 'access_token' in result:
            self.token = result['access_token']
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        print("\n🔐 Testing User Login...")
        # First register a user
        test_email = f"login_test_{datetime.now().strftime('%H%M%S')}@thrynn.com"
        register_data = {
            "email": test_email,
            "password": "TestPass123!",
            "full_name": "Login Test User"
        }
        
        # Register user
        register_result = self.run_test(
            "Register User for Login Test",
            "POST",
            "auth/register",
            200,
            data=register_data
        )
        
        if not register_result:
            return False
        
        # Now test login
        login_data = {
            "email": test_email,
            "password": "TestPass123!"
        }
        
        result = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if result and 'access_token' in result:
            self.token = result['access_token']
            return True
        return False

    def test_get_current_user(self):
        """Test getting current user info"""
        print("\n👤 Testing Get Current User...")
        if not self.token:
            self.log_test("Get Current User", False, "No token available")
            return False
            
        result = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        
        if result and 'id' in result:
            self.user_id = result['id']
            return True
        return False

    def test_products_api(self):
        """Test products API"""
        print("\n🛍️ Testing Products API...")
        
        # Test get all products
        products = self.run_test(
            "Get All Products",
            "GET",
            "products",
            200
        )
        
        if not products or len(products) == 0:
            self.log_test("Products Available", False, "No products found")
            return False
        
        self.log_test("Products Available", True, f"Found {len(products)} products")
        
        # Test get single product
        first_product = products[0]
        product_detail = self.run_test(
            "Get Single Product",
            "GET",
            f"products/{first_product['id']}",
            200
        )
        
        return product_detail is not None

    def test_cart_functionality(self):
        """Test cart functionality"""
        print("\n🛒 Testing Cart Functionality...")
        
        if not self.token:
            self.log_test("Cart Test", False, "No authentication token")
            return False
        
        # Get products first
        products = self.run_test(
            "Get Products for Cart Test",
            "GET",
            "products",
            200
        )
        
        if not products or len(products) == 0:
            self.log_test("Cart Test", False, "No products available for cart test")
            return False
        
        # Test empty cart
        empty_cart = self.run_test(
            "Get Empty Cart",
            "GET",
            "cart",
            200
        )
        
        if not empty_cart:
            return False
        
        # Add item to cart
        first_product = products[0]
        add_result = self.run_test(
            "Add Item to Cart",
            "POST",
            "cart/add",
            200,
            data={"product_id": first_product['id'], "quantity": 2}
        )
        
        if not add_result:
            return False
        
        # Get cart with items
        cart_with_items = self.run_test(
            "Get Cart with Items",
            "GET",
            "cart",
            200
        )
        
        if cart_with_items and len(cart_with_items.get('items', [])) > 0:
            self.log_test("Cart Has Items", True, f"Cart has {len(cart_with_items['items'])} items")
            
            # Test remove item from cart
            cart_item_id = cart_with_items['items'][0]['id']
            remove_result = self.run_test(
                "Remove Item from Cart",
                "DELETE",
                f"cart/{cart_item_id}",
                200
            )
            
            return remove_result is not None
        
        return False

    def test_order_functionality(self):
        """Test order creation and management"""
        print("\n📦 Testing Order Functionality...")
        
        if not self.token:
            self.log_test("Order Test", False, "No authentication token")
            return False
        
        # Add item to cart first
        products = self.run_test(
            "Get Products for Order Test",
            "GET",
            "products",
            200
        )
        
        if not products or len(products) == 0:
            return False
        
        # Add item to cart
        first_product = products[0]
        self.run_test(
            "Add Item for Order Test",
            "POST",
            "cart/add",
            200,
            data={"product_id": first_product['id'], "quantity": 1}
        )
        
        # Get cart
        cart = self.run_test(
            "Get Cart for Order",
            "GET",
            "cart",
            200
        )
        
        if not cart or len(cart.get('items', [])) == 0:
            return False
        
        # Create order
        order_data = {
            "items": cart['items'],
            "total_amount": cart['total'],
            "shipping_address": {
                "fullName": "Test User",
                "email": "test@thrynn.com",
                "phone": "9876543210",
                "address": "123 Test Street",
                "city": "Test City",
                "state": "Test State",
                "pincode": "123456",
                "country": "India"
            }
        }
        
        order_result = self.run_test(
            "Create Order",
            "POST",
            "orders",
            200,
            data=order_data
        )
        
        if not order_result:
            return False
        
        order_id = order_result['id']
        
        # Test get orders
        orders = self.run_test(
            "Get User Orders",
            "GET",
            "orders",
            200
        )
        
        if orders and len(orders) > 0:
            self.log_test("Orders Retrieved", True, f"Found {len(orders)} orders")
            
            # Test get single order
            single_order = self.run_test(
                "Get Single Order",
                "GET",
                f"orders/{order_id}",
                200
            )
            
            return single_order is not None
        
        return False

    def test_payment_functionality(self):
        """Test mock payment functionality"""
        print("\n💳 Testing Payment Functionality...")
        
        # Test create payment order
        payment_data = {
            "order_id": "test_order_123",
            "amount": 2500.00
        }
        
        payment_order = self.run_test(
            "Create Payment Order",
            "POST",
            "payments/create-order",
            200,
            data=payment_data
        )
        
        if not payment_order or 'id' not in payment_order:
            return False
        
        payment_id = payment_order['id']
        
        # Test verify payment
        verify_result = self.run_test(
            "Verify Payment",
            "POST",
            "payments/verify",
            200,
            data={"payment_id": payment_id, "order_id": "test_order_123"}
        )
        
        return verify_result is not None

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Thrynn E-commerce API Tests...")
        print(f"Testing against: {self.base_url}")
        
        # Initialize sample data
        self.test_sample_data_initialization()
        
        # Test authentication
        if not self.test_user_registration():
            print("❌ Registration failed, stopping tests")
            return False
        
        if not self.test_get_current_user():
            print("❌ Get current user failed")
        
        # Test login separately
        self.test_user_login()
        
        # Test products
        if not self.test_products_api():
            print("❌ Products API failed")
            return False
        
        # Test cart functionality
        if not self.test_cart_functionality():
            print("❌ Cart functionality failed")
        
        # Test order functionality
        if not self.test_order_functionality():
            print("❌ Order functionality failed")
        
        # Test payment functionality
        if not self.test_payment_functionality():
            print("❌ Payment functionality failed")
        
        return True

    def print_summary(self):
        """Print test summary"""
        print(f"\n📊 Test Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed < self.tests_run:
            print("\n❌ Failed Tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['details']}")

def main():
    tester = ThrynneCommerceAPITester()
    
    try:
        tester.run_all_tests()
        tester.print_summary()
        
        # Return appropriate exit code
        if tester.tests_passed == tester.tests_run:
            print("\n🎉 All tests passed!")
            return 0
        else:
            print(f"\n⚠️ {tester.tests_run - tester.tests_passed} tests failed")
            return 1
            
    except Exception as e:
        print(f"❌ Test execution failed: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())