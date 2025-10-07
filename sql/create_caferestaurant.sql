DROP DATABASE IF EXISTS CafeRestaurant;

-- Create database
CREATE DATABASE IF NOT EXISTS CafeRestaurant;
USE CafeRestaurant;

-- table information
CREATE TABLE Tables (
    TableID INT AUTO_INCREMENT PRIMARY KEY,
    Capacity INT NOT NULL CHECK (Capacity >= 0 AND Capacity < 99),
    IsOccupied BOOLEAN NOT NULL DEFAULT FALSE
);

-- menucategories
CREATE TABLE MenuCategories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    DisplayOrder INT
);

-- menuitems
CREATE TABLE MenuItems (
    MenuItemID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryID INT,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Ingredients TEXT,
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    ImagePath VARCHAR(255),
    DisplayOrder INT,
    FOREIGN KEY (CategoryID) REFERENCES MenuCategories(CategoryID)
);

-- orders information
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    TableID INT,
    Status VARCHAR(50),
    OrderTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TableID) REFERENCES Tables(TableID)
);

-- bills information
CREATE TABLE Bills (
	BillDetailID INT PRIMARY KEY,
    BillID INT,
    MenuItemID INT,
    Quantity INT NOT NULL,
    ItemStatus VARCHAR(50),
    FOREIGN KEY (MenuItemID) REFERENCES MenuItems(MenuItemID)
);

-- kitchen items which are completed
CREATE TABLE KitchenCom(
	KitchenComID INT AUTO_INCREMENT PRIMARY KEY,
    TableID INT,        
    MenuItemID INT,
    Quantity INT NOT NULL,
    ItemStatus VARCHAR(50),
    FOREIGN KEY (MenuItemID) REFERENCES MenuItems(MenuItemID)
);

-- kitchen items which are unfinished
CREATE TABLE KitchenView (
	KitchenDetailID INT PRIMARY KEY,
    TableID INT,        
    MenuItemID INT,
    Quantity INT NOT NULL,
    ItemStatus VARCHAR(50),
    FOREIGN KEY (MenuItemID) REFERENCES MenuItems(MenuItemID)
);

-- orderdetails
CREATE TABLE OrderDetails (
    OrderDetailID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    MenuItemID INT,
    Quantity INT NOT NULL,
    ItemStatus VARCHAR(50),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (MenuItemID) REFERENCES MenuItems(MenuItemID)
);

-- waitercall
CREATE TABLE WaiterCalls (
    WaiterCallID INT AUTO_INCREMENT PRIMARY KEY,
    TableID INT,
    Status VARCHAR(50),
    RequestTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    HandledTime DATETIME,
    FOREIGN KEY (TableID) REFERENCES Tables(TableID) ON DELETE CASCADE
);

-- staff(future)
CREATE TABLE Staff (
    StaffID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Role VARCHAR(50) NOT NULL,
	Username VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL
);




