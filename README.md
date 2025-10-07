User manual
This guide provides detailed instructions on setting up the entire system environment, including installing necessary software, setting up the backend, configuring the database, and running the frontend.

【System requirements】

•	Operating System: Windows 10 or newer, MacOS X Yosemite or newer, Linux Ubuntu 16.04 or newer
•	At least 4GB of RAM
•	At least 10GB of free disk space
•	Internet Connection


【Software installation】

1.	Installing Python
•	Go to the Python official website: https://www.python.org/downloads/
•	Download Python 3.8 or later for your operating system.
•	Run the installer. Ensure to check "Add Python 3.8 to PATH" before clicking "Install Now".
•	After installation, open a command line interface and type python --version to verify the installation.

2.	Installing MySQL
•	Visit https://dev.mysql.com/downloads/mysql/ and download the MySQL Community Server for your operating system.
•	Install MySQL following the installer instructions. Note down the root password set during installation.
•	Optionally, install a MySQL GUI tool like MySQL Workbench for easier database management.

3.	Setting Up the MySQL Database
•	Open MySQL Command Line Client or MySQL Workbench.
•	Create your own MySQL database with username and password.
•	Run SQL commands in MySQL Workbench : File→Open SQL Script→then select the sql files in the sql folder →execute the chosen script (the yellow ligntning icon)
•	run the file sql/create_caferestaurant.sql to set up the necessary tables in your own database.
•	run the file 'sql/sample dataset.sql' to insert test cases including compulsory login credentials.

4.	Installing Node.js and npm (If the frontend uses Node.js)
•	Go to https://nodejs.org/en/download/ and download the LTS version suitable for your operating system.
•	Install Node.js; npm will be installed automatically.
•	Verify the installation by typing node --version and npm --version in your command line.

【Backend setup】
•	Navigate to the backend directory via command line.
•	Install required Python libraries: pip install Flask flask-cors pymysql.
•	Change the default password to your own database password before running the file /backend/api_sql.py
•	Start the backend server by directly running the file /backend/api_sql.py or using the command line operations
•	The backend server runs on http://localhost:5000 by default.

【Frontend setup】
•	Navigate to the frontend directory. Here is an example.
•	Install dependencies: 
             npm install @mui/material @emotion/react @emotion/styled
             npm install @mui/material @mui/styled-engine-sc styled-components
             npm install @fontsource/roboto
•	Install the tools for drag: npm install @hello-pangea/dnd
•	Start the frontend application by running the command under the frontend path: npm start. Here is an example.
•	Then the frontend should now be accessible by navigating to http://localhost:3000 (if not opened automatically).
•	You can test the responsive interactions of different types of users (i.e., customers, managers, kitchen staff and wait staff) by opening multiple tabs in the browser.

【Image setup】
•	Put all the food images that you want to use (for menu items) in the folder /frontend/public

【Getting started】
Before you begin, make sure your device is connected to the internet and that you have received your login credentials from the restaurant manager.
1.	Logging in
•	Open your web browser and go to the restaurant's homepage.
•	Click on the "Login" button at the top right corner of the page.
•	Enter your username and password, and then click "Submit".
2.	Navigating the dashboard
•	Upon successful login, you will be directed to your dashboard.
•	The dashboard provides a quick overview of active orders, menu items, and navigation links to various functionalities depending on your role (Customer, Chef, Manager).
Thank you for setting up the Restaurant Order Management System. You are now ready to start managing restaurant operations efficiently.
