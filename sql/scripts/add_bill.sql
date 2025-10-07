USE CafeRestaurant;

-- 创建账单
CREATE TABLE Bills (
	BillDetailID INT AUTO_INCREMENT PRIMARY KEY,
    BillID INT,
    MenuItemID INT,
    Quantity INT NOT NULL,
    ItemStatus VARCHAR(50),
    FOREIGN KEY (MenuItemID) REFERENCES MenuItems(MenuItemID)
);