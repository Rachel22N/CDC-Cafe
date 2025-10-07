-- sample dataset
-- insert staff's account
INSERT INTO Staff (Name, Role, Username, Password) VALUES
('manager_test', 'Manager', 'manager', 'manager123'),
('kithchen_test', 'Kitchen', 'kitchen', 'kitchen123'),
('waiter_test', 'Waiter', 'waiter', 'waiter123');

-- insert test menuCategorys
INSERT INTO MenuCategories (Name, DisplayOrder) VALUES
('Sandwich', 0),
('Coffee', 1),
('Snack', 2),
('Special', 3);

-- insert test menuitems
INSERT INTO MenuItems (CategoryID, Title, Description, Ingredients, Price, IsActive, ImagePath, DisplayOrder)
VALUES
(1,'Classic Sandwich','A timeless combination of turkey, bacon, and fresh veggies layered between slices of toasted bread.','Turkey, bacon, lettuce, tomato, mayonnaise',7.99,TRUE, 'Classic Sandwich.jpg', 0),
(1,'Vegetarian Delight','A delicious vegetarian option with creamy hummus, ripe avocado, and crisp vegetables on whole-grain bread.','Hummus, avocado, cucumber, tomato, lettuce',5.99,TRUE, 'Vegetarian Delight.jpg', 1),
(1,'Spicy Chicken Sandwich','For spice lovers! Grilled chicken, melted cheese, and a zesty chipotle kick','Grilled chicken, pepper jack cheese, chipotle mayo, jalapeños',8.99,TRUE,'Spicy Chicken Sandwich.jpg', 2),
(1,'BLT - Bacon, Lettuce, Tomato','The classic BLT – crispy bacon, fresh lettuce, and juicy tomatoes with a dollop of mayo.','Crispy bacon, lettuce, tomato, mayo',5.59,TRUE, 'BLT.jpg', 3),
(1,'Italian Panini','An Italian-inspired panini featuring a savory blend of cured meats, melted cheese, and flavorful pesto.','Salami, ham, provolone, roasted red peppers, pesto',10.99,TRUE, 'Italian Panini.jpg', 4),
(1,'Caprese Ciabatta','A taste of Italy with sliced mozzarella, ripe tomatoes, and fragrant basil, drizzled with balsamic glaze.','Fresh mozzarella, tomatoes, basil, balsamic glaze',9.99,TRUE, 'Caprese Ciabatta.jpg', 5),
(1,'Turkey Cranberry Wrap','Thanksgiving flavors year-round! Roasted turkey, tangy cranberry sauce, and cream cheese wrapped in a soft tortilla.','Roasted turkey, cranberry sauce, cream cheese, spinach',11.99,TRUE, 'Turkey Cranberry Wrap.jpg', 6),
(1,'Grilled Cheese and Tomato Soup Combo',' A classic comfort combo – gooey grilled cheese sandwich paired with a warm bowl of tomato soup.','Melted cheddar and Swiss cheese on sourdough bread',6.99,TRUE, 'Grilled Cheese and Tomato Soup Combo.jpg', 7),
(1,'Pesto Chicken Panini','Grilled chicken meets the vibrant flavors of pesto, sun-dried tomatoes, and melted mozzarella on a panini.',' Grilled chicken, pesto, sun-dried tomatoes, mozzarella',7.99,TRUE, 'Pesto Chicken Panini.jpg', 8),
(1,'Tuna Salad Sub','A satisfying sub filled with a hearty portion of tuna salad, crisp lettuce, juicy tomatoes, and pickles.','Tuna salad, lettuce, tomato, pickles',7.50,TRUE, 'Tuna Salad Sub.jpg', 9),
(2,'Espresso','A strong and concentrated coffee shot, perfect for those who enjoy the pure essence of coffee.',' Finely ground coffee beans, hot water',2.50,TRUE, 'Espresso.jpg', 10),
(2,'Cappuccino','A classic Italian coffee with equal parts espresso, steamed milk, and velvety foam, creating a rich and satisfying flavor.',' Espresso, steamed milk, foam',4.50,TRUE,'Cappuccino.jpg', 11),
(2,'Iced Americano','A refreshing blend of espresso and cold water over ice, offering a cool and invigorating coffee experience.','Espresso, cold water, ice.',3.50,TRUE,'Iced Americano.jpg', 12),
(2,'Mocha','Indulge in the delightful combination of rich espresso, chocolate sweetness, and creamy steamed milk, topped with a dollop of whipped cream.','Espresso, chocolate syrup, steamed milk, whipped cream',5.1,TRUE, 'Mocha.jpg', 13),
(2,'Flat White','A smooth and creamy coffee with a higher coffee-to-milk ratio, topped with a thin layer of silky microfoam.','Espresso,steamed milk with fine, velvety bubbles.',5.50,TRUE, 'Flat White.jpg', 14),
(3,'Vegetable Spring Rolls','Light and flavorful spring rolls filled with a medley of fresh vegetables, served with hoisin dipping sauce.','Rice paper, vermicelli noodles, mixed vegetables, hoisin sauce',2.50,TRUE, 'Vegetable Spring Rolls.jpg', 15),
(3,'Classic Hummus with Pita Chips','A timeless favorite featuring smooth hummus served with crispy, oven-baked pita chips.',' Chickpeas, tahini, olive oil, garlic, lemon, pita chips',6.50,TRUE, 'Classic Hummus with Pita Chips.jpg', 16),
(3,'Spicy Buffalo Chicken Wings','Crispy chicken wings coated in tangy buffalo sauce, served with cool celery sticks and creamy blue cheese dressing.','Chicken wings, buffalo sauce, celery sticks, blue cheese dressing',7.50,TRUE, 'Spicy Buffalo Chicken Wings.jpg', 17),
(3,'Caprese Skewers','A delightful snack of skewered cherry tomatoes, mozzarella, and basil, drizzled with a balsamic glaze.','Cherry tomatoes, fresh mozzarella, basil, balsamic glaze',7.25,TRUE, 'Caprese Skewers.jpg', 18),
(3,'Garlic Parmesan Fries',' Crispy golden fries tossed in a savory blend of garlic, parmesan cheese, and fresh parsley.','French fries, garlic, parmesan cheese, parsley',4.50,TRUE, 'Garlic Parmesan Fries.jpg', 19),
(4,'Lemon Herb Grilled Chicken','Juicy grilled chicken breast marinated in a flavorful blend of lemon, herbs, and garlic, served with roasted vegetables.',' Chicken breast, lemon, garlic, rosemary, olive oil',14.99,TRUE, 'Lemon Herb Grilled Chicken.jpg', 20),
(4,'Vegetarian Pad Thai',' A delicious vegetarian twist on the classic Pad Thai, featuring rice noodles, tofu, and crunchy peanuts in a tangy tamarind sauce.',' Rice noodles, tofu, bean sprouts, peanuts, tamarind sauce',13.99,TRUE, 'Vegetarian Pad Thai.jpg', 21),
(4,'Filet Mignon with Red Wine Reduction','A gourmet delight of tender filet mignon steak cooked to perfection, accompanied by a rich red wine reduction sauce.','Filet mignon steak, red wine, shallots, thyme, butter',22.99,TRUE, 'Filet Mignon with Red Wine Reduction.jpg', 22),
(4,'Mediterranean Stuffed Bell Peppers','Colorful bell peppers stuffed with a savory mixture of quinoa, chickpeas, and feta cheese, seasoned with Mediterranean herbs.','Bell peppers, quinoa, chickpeas, feta cheese, Mediterranean herbs',17.99,TRUE, 'Mediterranean Stuffed Bell Peppers.jpg', 23),
(4,'Teriyaki Glazed Salmon','Grilled salmon fillet glazed with a sweet and savory teriyaki sauce, garnished with fresh ginger and green onions','Salmon fillet, teriyaki sauce, ginger, garlic, green onions',18.99,TRUE, 'Teriyaki Glazed Salmon.jpg', 24); 