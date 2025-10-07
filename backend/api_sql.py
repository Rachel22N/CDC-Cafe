from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import hashlib
import uuid
import pymysql
from datetime import datetime

app = Flask(__name__)

# Allow cross-domain access
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# MySQL configuration
db_config = {
    'user': 'root',
    'password': "pwd", # Enter your database password HERE
    'host': 'localhost',
    'database': 'caferestaurant',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}


# Creating a Database Connection Using Configuration
def get_db_connection():
    return pymysql.connect(**db_config)


# Creating a User Table
def create_table():
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                salt VARCHAR(255)
            )
        ''')
    conn.commit()
    conn.close()


@app.route('/kitchenloginpage', methods=['POST'])
@app.route('/waiterloginpage', methods=['POST'])
@app.route('/managerloginpage', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    auth_role = data.get('role')

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Finding a user by the Username field
            cursor.execute("SELECT Password, Role FROM Staff WHERE Username = %s", (username))
            user = cursor.fetchone()

            if user and user['Password'] == password and user['Role'] == auth_role:
                # If the passwords match, the login is successful
                return jsonify({'message': 'Login successful', 'role': user['Role']}), 200
            else:
                # If the user cannot be found or the password does not match, the login fails
                return jsonify({'error': 'Invalid username or password'}), 401
    finally:
        conn.close()


@app.route('/api/add_category', methods=['POST'])
def add_category():
    data = request.json
    category_name = data.get('categoryName')
    display_order = data.get('displayOrder')

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('INSERT INTO MenuCategories (Name, DisplayOrder) VALUES (%s, %s)',
                           (category_name, display_order))
            conn.commit()
            return jsonify({'message': 'New category added successfully'}), 201
    except pymysql.MySQLError as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/api/menucategories', methods=['GET'])
def get_menu_categories():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                'SELECT CategoryID, Name, DisplayOrder FROM MenuCategories ORDER BY DisplayOrder')
            categories = cursor.fetchall()
            return jsonify(categories), 200
    except pymysql.MySQLError as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/menucategories', methods=['PUT'])
def update_menu_category_display_order():
    # Parsing incoming JSON data
    conn = get_db_connection()
    body = request.get_json()
    try:
        for data in body:
            name = data['Name']
            display_order = data['DisplayOrder']
            category_ID = data['CategoryID']
            with conn.cursor() as cursor:
                # Preparing SQL Statements
                sql = """
                UPDATE MenuCategories
                SET Name = %s, DisplayOrder = %s
                WHERE CategoryID = %s
                """

                # Executing SQL Statements
                cursor.execute(sql, (name, display_order, category_ID))
                conn.commit()

        return jsonify({'message': 'Menu item display order updated successfully'}), 200
    except Exception as e:
        # If an error occurs, print the error and return the error message
        print(e)
        return jsonify({'error': 'An error occurred'}), 500
    finally:
        # Close the database connection
        conn.close()

@app.route('/api/menu', methods=['GET'])
def get_menu_data():
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Get all menu items
            cursor.execute('''
                SELECT MenuItemID, CategoryID, Title, Description, Ingredients, Price, IsActive, ImagePath, DisplayOrder
                FROM MenuItems
                WHERE IsActive = TRUE
                ORDER BY DisplayOrder
            ''')
            menu_items = cursor.fetchall()

            return jsonify(menu_items), 200
    except pymysql.MySQLError as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/api/add_table', methods=['POST'])
def add_table():
    data = request.json
    table_id = data.get('tableNumber')
    capacity = data.get('numberOfPeople')
    order_id = table_id
    IsOccupied = 1

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('INSERT INTO Tables(TableID, Capacity, IsOccupied) VALUES (%s, %s, %s)', (table_id, capacity, IsOccupied))
            cursor.execute('INSERT INTO Orders(OrderID, TableID) VALUES (%s, %s)', (order_id, table_id))
            conn.commit()
            return jsonify({'message': 'New table added successfully'}), 201
    except pymysql.MySQLError as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/api/delete_category/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    print(category_id)
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute('DELETE FROM MenuCategories WHERE CategoryID = %s', (category_id,))
            conn.commit()
            return jsonify({'message': 'Category deleted successfully'}), 200
    except pymysql.MySQLError as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/api/submitmenuitems', methods=['POST'])
def add_menu_item():
    title = request.form['title']
    price = request.form['price']
    ingredients = request.form['ingredients']
    CategoryID = request.form['categoryID']
    description = request.form['description']
    is_active = request.form["isActive"]
    image = request.form['image'] if 'image' in request.form else None
    display_order = request.form['DisplayOrder']


    # Insertion into the database
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Insert new menu item
            sql = """
            INSERT INTO MenuItems (CategoryID, Title, Description, Ingredients, Price, IsActive, ImagePath, DisplayOrder)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """

            cursor.execute(sql, (CategoryID, title, description, ingredients,price, is_active, image, display_order))

            conn.commit()
            return jsonify({'message': 'Menu item added successfully'}), 201
    except pymysql.MySQLError as e:
        ## current_app.logger.error(e)
        return jsonify({'error': 'Database error'}), 500
    finally:
        conn.close()

@app.route('/api/deletemenuitems/<int:menuitem_id>', methods=['DELETE'])
def delete_menu_item(menuitem_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Deletes the specified menu item
            cursor.execute('DELETE FROM MenuItems WHERE MenuItemID = %s', (menuitem_id,))
            conn.commit()

            # Verify that a record is actually deleted
            if cursor.rowcount == 0:
                return jsonify({'error': 'Menu item not found'}), 404

            return jsonify({'message': 'Menu item deleted successfully'}), 200
    except pymysql.MySQLError as e:
        # If there are deletion errors caused by foreign key constraints, they can be caught and handled here
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/menuitems/<int:menuitem_id>', methods=['PUT'])
def update_menu_item(menuitem_id):
    # Parsing incoming JSON data
    conn = get_db_connection()
    data = request.get_json()
    title = data['Title']
    description = data['Description']
    ingredients = data['Ingredients']
    category_id = data['CategoryID']
    price = data['Price']
    is_active = data['IsActive']
    ImagePath = data['ImagePath']
    # display_order = data['DisplayOrder']

    try:
        with conn.cursor() as cursor:
            # Preparing SQL Statements
            sql = """
            UPDATE MenuItems
            SET Title = %s, Description = %s, Ingredients = %s, CategoryID = %s, 
                Price = %s, IsActive = %s, ImagePath = %s
            WHERE MenuItemID = %s
            """
            # Executing SQL Statements
            cursor.execute(sql, (title, description, ingredients, category_id, price, is_active, ImagePath, menuitem_id))
            conn.commit()
            return jsonify({'message': 'Menu item updated successfully'}), 200
    except Exception as e:
        # If an error occurs, print the error and return the error message
        print(e)
        return jsonify({'error': 'An error occurred'}), 500
    finally:
        # Close the database connection
        conn.close()

@app.route('/api/menuitems', methods=['PUT'])
def update_menu_item_display_order():
    # Parsing incoming JSON data
    conn = get_db_connection()
    body = request.get_json()
    try:
        for data in body:
            menuitem_id = data['MenuItemID']
            title = data['Title']
            description = data['Description']
            ingredients = data['Ingredients']
            category_id = data['CategoryID']
            price = data['Price']
            is_active = data['IsActive']
            ImagePath = data['ImagePath']
            display_order = data['DisplayOrder']

            with conn.cursor() as cursor:
                # Preparing SQL Statements
                sql = """
                UPDATE MenuItems
                SET Title = %s, Description = %s, Ingredients = %s, CategoryID = %s, 
                    Price = %s, IsActive = %s, ImagePath = %s, DisplayOrder = %s
                WHERE MenuItemID = %s
                """

                # Executing SQL Statements
                cursor.execute(sql, (title, description, ingredients, category_id, price, is_active, ImagePath, display_order, menuitem_id))
                conn.commit()

        return jsonify({'message': 'Menu item display order updated successfully'}), 200
    except Exception as e:
        # If an error occurs, print the error and return the error message
        print(e)
        return jsonify({'error': 'An error occurred'}), 500
    finally:
        # Close the database connection
        conn.close()

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    data = request.json
    order_id = data.get('order_id')
    item_id = data.get('item_id')
    quantity = data.get('quantity')

    if not item_id or not quantity:
        return jsonify({'error': 'Item ID and quantity are required'}), 400

    conn = get_db_connection()
    with conn.cursor() as cursor:
        sql = "SELECT MenuItemID FROM OrderDetails WHERE MenuItemID = %s AND OrderID = %s"
        cursor.execute(sql, (item_id, order_id))
        existing_item = cursor.fetchone()
        if existing_item:
            sql = "UPDATE OrderDetails SET Quantity = %s WHERE MenuItemID = %s AND OrderID = %s"
            cursor.execute(sql, (quantity, item_id, order_id))
        else:
            cursor.execute("INSERT INTO OrderDetails(OrderID, MenuItemID, Quantity) VALUES (%s, %s, %s)",
                           (order_id, item_id, quantity))
        conn.commit()

    return jsonify({'message': 'Item added to cart successfully'}), 200


@app.route('/remove_from_cart', methods=['POST'])
def remove_from_cart():
    data = request.json
    order_id = data.get('order_id')
    item_id = data.get('item_id')

    if not item_id or not order_id:
        return jsonify({'error': 'Item ID is required'}), 400

    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM OrderDetails WHERE OrderID = %s AND MenuItemID = %s", (order_id,item_id))
        conn.commit()
    return jsonify({'message': 'Item removed from cart successfully'}), 200


@app.route('/get_cart', methods=['POST'])
def get_cart():
    data = request.json
    order_id = data.get('order_id')
    conn = get_db_connection()
    with conn.cursor() as cursor:
        sql = '''
                SELECT m.Title Title, o.MenuItemID MenuItemID, o.Quantity Quantity, m.Price Price
                FROM OrderDetails o JOIN MenuItems m ON o.MenuItemID = m.MenuItemID 
                WHERE OrderID = %s
            '''
        cursor.execute(sql, order_id)
        cart_items = cursor.fetchall()
    return jsonify({'cart': cart_items}), 200


@app.route('/kitchen_add', methods=['POST'])
def kitchen_add():
    data = request.json
    order_id = data.get('order_id')
    conn = get_db_connection()
    with conn.cursor() as cursor:
        sql = "SELECT * FROM OrderDetails WHERE OrderID = %s"
        cursor.execute(sql, order_id)
        cart_items = cursor.fetchall()
        for item in cart_items:
            sql = "INSERT INTO KitchenView (TableID, MenuItemID, Quantity, ItemStatus, KitchenDetailID) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(sql, (item['OrderID'], item['MenuItemID'], item['Quantity'], 'preparing', item['OrderDetailID']))
        conn.commit()
    return jsonify({'message': 'kitchen add successfully'}), 200


@app.route('/add_bill', methods=['POST'])
def add_bill():
    data = request.json
    order_id = data.get('order_id')
    conn = get_db_connection()
    with conn.cursor() as cursor:
        sql = "SELECT * FROM OrderDetails WHERE OrderID = %s"
        cursor.execute(sql, order_id)
        cart_items = cursor.fetchall()
        for item in cart_items:
            sql = "INSERT INTO Bills (BillID, MenuItemID, Quantity, BillDetailID) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (item['OrderID'], item['MenuItemID'], item['Quantity'], item['OrderDetailID']))
            cursor.execute("DELETE FROM OrderDetails WHERE OrderID = %s", order_id)
        conn.commit()
    return jsonify({'message': 'checkout successfully'}), 200


@app.route('/get_bill', methods=['POST'])
def get_bill():
    data = request.json
    order_id = data.get('order_id')
    conn = get_db_connection()
    with conn.cursor() as cursor:
        sql = '''
                    SELECT m.Title Title, b.MenuItemID MenuItemID, b.Quantity Quantity, m.Price Price, b.BillDetailID
                    FROM Bills b JOIN MenuItems m ON b.MenuItemID = m.MenuItemID 
                    WHERE BillID = %s
            '''
        cursor.execute(sql, order_id)
        bill_items = cursor.fetchall()
    return jsonify({'bill': bill_items}), 200


@app.route('/payment', methods=['POST'])
def payment():
    data = request.json
    order_id = data.get('order_id')
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM Bills WHERE BillID = %s", order_id)
        cursor.execute('DELETE FROM Orders WHERE OrderID = %s', order_id)
        cursor.execute('DELETE FROM Tables WHERE TableID = %s', order_id)
        conn.commit()
    return jsonify({'message': 'Payment successfully'}), 200


@app.route('/kitchen_view', methods=['POST'])
def kitchen_view():
    conn = get_db_connection()
    with conn.cursor() as cursor:
        sql = '''
                SELECT k.KitchenDetailID, k.TableID TableID, m.Title Title, k.MenuItemID MenuItemID, k.Quantity Quantity, k.ItemStatus
                 FROM KitchenView k JOIN MenuItems m ON k.MenuItemID = m.MenuItemID 
            '''
        cursor.execute(sql)
        kitchen_items = cursor.fetchall()
    return jsonify({'kitchen': kitchen_items}), 200


@app.route('/menu_completed', methods=['POST'])
def menu_completed():
    data = request.json
    kitchen_id = data.get('KitchenDetailID')
    table_id = data.get('orderId')
    menu_id = data.get('menuItemId')
    quantity = data.get('quantity')
    conn = get_db_connection()
    with conn.cursor() as cursor:
        sql = "INSERT INTO KitchenCom (TableID, MenuItemID, Quantity) VALUES (%s, %s, %s)"
        cursor.execute(sql, (table_id, menu_id, quantity))
        cursor.execute("DELETE FROM KitchenView WHERE KitchenDetailID = %s", kitchen_id)
        conn.commit()
    return jsonify({'message': 'complete successfully'}), 200


@app.route('/api/waitercalls', methods=['POST'])
def create_waiter_call():
    data = request.get_json()
    table_id = data['tableId']
    conn = get_db_connection()
    with conn.cursor() as cursor:
        sql = """
        INSERT INTO WaiterCalls (TableID, Status)
        VALUES (%s, 'pending')
        """
        cursor.execute(sql, (table_id,))
        conn.commit()
    return jsonify({'message': 'Waiter call created successfully'}), 201


@app.route('/api/waitercalls', methods=['GET'])
def get_waiter_calls():
    conn = get_db_connection()
    with conn.cursor() as cursor:
        sql = "SELECT * FROM WaiterCalls WHERE Status = 'pending'"
        cursor.execute(sql)
        calls = cursor.fetchall()
    return jsonify(calls), 200


@app.route('/api/waitercalls/<int:call_id>', methods=['PUT'])
def handle_waiter_call(call_id):
    conn = get_db_connection()
    with conn.cursor() as cursor:
        sql = """
        UPDATE WaiterCalls
        SET Status = 'handled', HandledTime = %s
        WHERE TableID = %s
        """
        cursor.execute(sql, (datetime.now(), call_id))
        conn.commit()
    return jsonify({'message': 'Waiter call handled successfully'}), 200


@app.route('/waiter_view', methods=['GET'])
def waiter_view():
    conn = get_db_connection()
    with conn.cursor() as cursor:
        sql = '''
                SELECT k.KitchenComID, k.TableID TableID, m.Title Title, k.MenuItemID MenuItemID, k.Quantity Quantity
                FROM KitchenCom k JOIN MenuItems m ON k.MenuItemID = m.MenuItemID 
            '''
        cursor.execute(sql)
        waiter_items = cursor.fetchall()
    return jsonify({'waiter': waiter_items}), 200


@app.route('/waiter_comp', methods=['POST'])
def waiter_comp():
    data = request.json
    waiter_id = data['KitchenComID']
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM KitchenCom WHERE KitchenComID = %s ", waiter_id)
        conn.commit()
    return jsonify({'message': 'complete successfully'}), 200


@app.route('/cancel', methods=['POST'])
def cancel():
    data = request.json
    id = data['BillDetailID']
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT ItemStatus FROM KitchenView WHERE KitchenDetailID = %s", id)
        state = cursor.fetchone()['ItemStatus']
        if state == 'preparing':
            cursor.execute("DELETE FROM KitchenView WHERE KitchenDetailID = %s", id)
            cursor.execute("DELETE FROM Bills WHERE BillDetailID = %s", id)
            conn.commit()
            return jsonify({'message': 'Cancel successfully'}), 200
        else:
            return jsonify({'message': 'Cancel error'}), 401


@app.route('/kitchen_view/<int:kitchen_detail_id>', methods=['PUT'])
def update_status(kitchen_detail_id):
    status = request.json.get('status')
    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute('UPDATE KitchenView SET ItemStatus = %s WHERE KitchenDetailID = %s', (status, kitchen_detail_id))
        conn.commit()
    # conn.close()
    return jsonify('Status updated'), 200


if __name__ == '__main__':
    app.run(debug=True)