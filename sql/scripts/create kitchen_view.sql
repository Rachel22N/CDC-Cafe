USE CafeRestaurant;

-- 创建厨房待做菜品
CREATE TABLE KitchenView (
	KitchenDetailID INT PRIMARY KEY,
    TableID INT,        
    MenuItemID INT,
    Quantity INT NOT NULL,
    ItemStatus VARCHAR(50),
    FOREIGN KEY (MenuItemID) REFERENCES MenuItems(MenuItemID)
);