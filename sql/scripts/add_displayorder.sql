ALTER TABLE caferestaurant.menuitems ADD COLUMN DisplayOrder INT;

SET @row_num = 0;
UPDATE caferestaurant.menuitems
SET displayorder = (@row_num:= @row_num + 1)
WHERE TRUE
ORDER BY `MenuItemID`;

SET @row_num = 0;
UPDATE caferestaurant.menucategories
SET displayorder = (@row_num:= @row_num + 1)
WHERE TRUE
ORDER BY `CategoryID`;