USE CafeRestaurant;

-- 创建厨房完成菜品
CREATE TABLE KitchenCom(
	KitchenComID INT AUTO_INCREMENT PRIMARY KEY,
    TableID INT,        
    MenuItemID INT,
    Quantity INT NOT NULL,
    ItemStatus VARCHAR(50),
    FOREIGN KEY (MenuItemID) REFERENCES MenuItems(MenuItemID)
);