# E-Commerce
Development of an E-Commerce application which purpose of selling nutritional supplements. The application was built with C#, .net 6.0 and MSSQL in the backend and HTML, CSS and JavaScript with Angular in the frontend.

User Side Frontend 

   ![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/f24db738-4b81-4516-8551-24f15cca25ed)
Figure 1: Navbar; 
  As seen in the figure 1, there is the logo in the upper left, the shop and home directors in the middle, and the basket, login and sign up directors in the upper right. If the user is on a page other than the “home” page, they are redirected to the “home” page by clicking the project logo in the upper left.
  
  ![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/eeaa6a5d-ce8f-4ae6-9df2-a392d10bb82e)
Figure 2: Updated Navbar;
   As seen in the figure 2, if the user has added products to the basket, they can see how many products they have added on the basket logo in the upper right. In addition, as the user changes the page, the website root in the upper left is also renamed and takes the name of the found page.
   
   ![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/5639cc5a-bbe4-4fc9-94d7-b96bf12982da)
Figure 3: Home Page;

After logging in to this e-commerce site, the user encounters the page shown in the figure 3. On this page, photos that modernize sports greet the user at the top, and at the bottom, the user displays the best-selling products.
  If the user wishes, he can see 2 options by hovering the mouse over the products, these are add to cart or product detail display icons. The user can easily add the product to the cart by pressing the cart icon. The user can proceed to the page with all the products by clicking the "view all products" button below.

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/5be58b78-5ee6-4566-b3e9-08773e99fb02)
Figure 4: Shop Page;
  The user can easily switch to the shop page in the figure 4 by clicking on the shop directive in the navbar.
   The products listed on this page welcome the user. Although the user primarily sees the popular products, the user can also sort the products alphabetically or by price. In addition, products can be listed by type or brand.
   The user can view how many products are listed in total as seen in the figure 4. However, since there are pages of products, it can move from the bottom to other pages. Instead of doing all these, he can easily search for the product he wants from the search box at the top right. Finally, when we hover over the products listed on this page, 2 icons appear on the home screen, and the user can look at the product details or add the product directly to the basket.
Product details vary depending on the stock quantity of the product.

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/2f475c8f-fced-4788-8cfb-fbae6183b827)
Figure 5: (in stock) Product Detail Page;
As seen in the figure 5, the user will view detailed information about the product in this section. However, the user can add the product to as many carts as he wants.

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/edc9e5a0-5dfc-4f68-a0bf-cb959eac6af1)
Figure 6: Warn Message;
There is a limit to the number of products that the user has set while adding the product to the cart, this limit cannot be exceeded and a warning message stating that it cannot be exceeded is shown to the user as in the figure 6.

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/daef6430-0b22-476e-9399-ae4b9ca299bd)
Figure 7: (out of stock) Product Detail Page; 
  If there is no stock of the product, which is detailed, the photograph is faded, as seen in the figure 7, and on the right, it encounters an inscription stating that it is out of stock. In this case, the user cannot add this product to the cart. As seen in the figure, the add button is unclickable.

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/817b0dc1-19d1-46c1-b177-4920478c6926)
Figure 8: Basket Page;
The user can access the page shown in the figure 8 by pressing the basket icon in the navbar. In this section, the user can see the product information they have added to their cart. In addition, the user can remove the product from the basket or increase or decrease the number of products as seen in the figure. 
   The total price is updated as the number of products increases, as well as the price to be paid in the lower right part of the figure.
   When the user clicks on the "proceed to the checkout" button, the product should go to the purchasing stages, but at this stage the user must now log in to the website, so the user is redirected to the login page
   
![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/f200a70b-6b74-40f7-b142-daa21a4d351e)
Figure 9: Login Page;
   The user can easily access the login page displayed in the figure 9 via the navbar. In this section, the user must enter his email and password. Password can be previewed easily. If the user forgot her password she can reset it If the user does not have an account, "Don't have an account?" Users can go to the sign up page with the director and sign up. If the user wishes, they can quickly log in to this site with their "Google" or "Facebook" user information.
   
 ![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/ee928cdb-42a8-4ecf-a0f6-46e4c7a48946)
Figure 10: Reset Password Page

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/2948b5be-4221-4f68-a058-e5121da749d6)
Figure 11: Password Renewal Request Mail
 
 ![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/5e210842-b3e5-4117-97d6-880f47623b8e)
Figure 12: Password Reset Page;
The user enters his e-mail as shown in the figure 10 and receives a confirmation mail from this site as in the figure 11. Then, by clicking on the link there, he is directed to the page in the figure 12 and the user can easily update his password.
 
 ![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/57b54c52-16a3-43c7-98ec-75336c4039bc)
Figure 13: Register Page with Warnings
 
![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/7c07cac0-1d49-4675-8e7f-3620f49c19de)
Figure 14: Register Page;      
As can be seen in figure 14 and figure 13, the user can easily register on the website. In addition to these, password warnings are shown as seen in figure 13. The user must set his password in accordance with his requirements.

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/15a291c4-d507-470c-9aa5-344b34972a97)
Figure 15: User Profile Informations;        
  When the user logs in to the site, as seen in the figure 15, the “sign in” and  “sign up “buttons in the navbar disappear and "Welcome UserName" appears instead. When the user clicks on his name, he can use the logout, view basket and view orders tabs.

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/786510db-2539-4041-b8a7-2c43af90a04f)
Figure 16: Checkout Address Page;
   In the address section of the payment steps shown in the figure 16, the user encounters the panel where he can enter the address information for the delivery of the order. He can save this address for his next orders.
   
![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/a2980614-6083-4d9e-a9a5-8f16c3ae83b8)
Figure 17: Checkout Delivery Page;
   As seen in the figure 17, there are 4 cargo options in the shipping section. The user selects the desired shipping company and the total amount to be paid on the right is updated according to the shipping money.
   
![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/6cdc6c9b-519f-4aca-947a-62405cc5f80c)
Figure 18: Checkout Review Page;
  As seen in the figure 18, in the review section, the user may want to take a last look at the products they will buy.

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/566cc09b-0fb4-405d-b9ad-fd7b5e64feef)
Figure 19: Checkout Payment Page;
    As seen in the figure 19, the user proceeds to the last stage, the payment section. Here the Stripe interface was used and the payment was undertaken by the stripe brokerage company. The user can easily pay with one of the proposed previously saved cards.

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/4325b2a3-2f04-4dde-a6b4-648d51ff58a9)
Figure 20: Order Success Page;
If the payment was successful, an information message page will be opened as in the figure 20. User can see their orders with "View your orders" button

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/a979aad3-7a50-4fb8-8719-2a9991163335)
Figure 21: All Orders of The User;
  On the page displayed in the figure 21, the user can view their previous orders with their information. You can view the order details by clicking on them.
  
![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/7325d080-d010-4e48-bc09-becffb831526)
Figure 22: Order Detail Page;
On the page shown in the figure 22, the user can follow the status of the product he has ordered.

5.2.4.2 Admin Side Frontend 
   Admin logs into the system with the same panel as other users, but has access to a few extra pages and functions other than existing pages.

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/bc4cd529-ef64-4714-90e0-70dc2e5e4a9d)
Figure 23: Navbar for Admin;
   As seen in the figure 23, the admin panel is actually embedded in the project's navbar. In other words, if the logged in user is admin, they can display a few more page directors in the navbar apart from normal users.
   
![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/7f94095b-587f-4574-8b8d-0d4b8dfe3ede)
Figure 24: Unauthorized Page;
   Users can discover page roots that are private to admin and want to log in to these roots. If a user wants to access one of the admin pages, he/she receives the warning message shown in the figure 24 and a button is shown to be directed to the homepage.
   
![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/0d8185ed-0760-4346-ac9c-6ee6b767c4fc)
Figure 25: Admin “Product” Page;
    On the page shown in the figure 25, admin can view the information of all products found in the database. In order to reach more detailed information, admin can go to the product admin wants to reach by clicking the "Show Details" button. In addition, a specified product can be deleted with the "Delete" button. Thanks to the "Add Product" button in the upper left, the admin can go to the page where he will add a new product.
      On this page, products can be searched by name, stock information or price information  etc., thanks to the filter section. If the admin moves the mouse over the stock information, an arrow appears up and down, and this arrow can update the table in ascending or descending stock information according to the number. It can change the number of products listed on a page by determining the number from the "items per page" section at the bottom right, and if there are lots of pages of products, it can move to the right or left.
      
  ![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/6ae9ab2b-0e9d-448d-b795-62bd36ee46a2)
Figure 26: Admin “Product” Detail Page;
   On the page shown in the figure 26, the admin can both preview detailed information about the product and update the product.

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/bc93d061-2b26-4616-9e9d-8d2d697c758c)
Figure 27: Admin “Product” Add Page;
     On this page shown in the figure 27, the user can add a new product. Actually, as noticed, this page is the same page as the product update page. This is done thanks to the feature of angular. If there is an existing product and it is desired to go into detail, the information of the product is bind to the inputs. If this page is opened directly, it means that there is no existing product, then the inputs are blank and the admin is expected to enter data.

![image](https://github.com/Mert-Bulutoglu/E-Commerce/assets/107191110/91811647-f298-42f5-a253-e1179d8d05c4)
Figure 28: Admin “User” Page;
As seen in the figure 28, the admin can preview and delete all users registered in the system, but cannot add new users. Since the table used in the product page is used in this section, the same features apply here as well.







