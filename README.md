# Final Project: Alay-ay E-Commerce Website

**Collaborators:**  
**DEV 1:** MONTERO, Nico Antiono  
**DEV 2:** SILAPAN, Francheska Marie  
**DEV 3:** REYES, Erix Laud
**DEV 4:** FERMO, Jesella  

**Section:** U-V4L  

## Get Started

**Under Github:**
- Download the file via ZIP folder or fork the repository (for self-experimentation).
- Select the unzipped folder on your corresponding path.
- Open a terminal and run the following commands:

```bash
# TERMINAL 1
cd frontend
npm i
npm run dev
```

- Open another terminal and run the following commands:

```bash
# TERMINAL 2
cd backend
npm i
npm start
```

- Click on the set local host: [http://localhost:5173](http://localhost:5173) and the website is up and running!

## Project Description

"Farm-to-table" means a social movement emphasizing a direct link between consumers and farmers as the source of food. Your task involves developing an e-commerce website that will be used by the Department of Agriculture (DA) to facilitate transactions between farmers and customers directly. The DA will have the capability to compile a catalog of items for sale in the public market.

### Why Alay-ay?
Alay-ay is a Filipino dialect term for a scarecrow, highlighting the website's edge against other competitions.

### Features
FOR REGULAR USERS:
- Authentication (Sign In and Sign Up)
- Store
- Checkout
- Buyer Profile

FOR ADMIN USERS:
- Admin Dashboard
- Order Fulfillment
- Sales Reports
- Product Listing
- User Account

## CODE EXPLANATION 

The code is split into two main folders namely backend, and frontend.

### FRONTEND

**ASSETS**
Mainly used for User Design:

- background (mp4, jpg, png)
- elements (png) 

**SRC**
- App - Main Router
- Home (CSS and JSX) - HomePage
- Header - Widget

**SRC/STORE**
- AccountProfile - Buyer's Profile
- CartDisplay (JSX and CSS) - for Displaying the Cart
- FilterByType (JSX and CSS) - Filter Widget
- Pagination - Navigate Widget
- Store (JSX and CSS) - Main store, where products here are listed 

**SRC/COMPONENTS**
- Main - main render
- ErrorPage - Notification Page
- Login CSS and SignIn JSX - authenticator
- Register CSS and SignUp JSX - authenticator
- UserContext.jsx 

**ADMIN**
- SRC/assets - specific assets folder for images used for admin pages
- Admin Dashboard (CSS and JSX) - to be able to access and navigate to the other admin pages 
- Order Fulfillment (CSS AND JSX) - access orders to confirm or cancel
- Sales Reports (CSS AND JSX) - view Weekly, Monthly, Annual, and Product Sales
- Product Listing (CSS AND JSX) - allows editing, deleting, and adding products
- Edit Product (CSS AND JSX) - works with product listing for editing product
- User Account (CSS AND JSX) - view and search user accounts details



### BACKEND

Developed using Express.js and MongoDB, provides the API endpoints for managing products, users, transactions and more.

**Product**
- POST /api/products: For adding a new product
- GET /api/products: For fetching all products
- GET /api/products/:productId: For fetching a product by ID
- PUT /api/products/:productId: For updating a product by ID
- PUT /api/products/delete/:productId: For deleting a product

**User**
- POST /api/signup: Sign up a new user
- POST /api/signin: Sign in an existing user
- GET /api/users: Fetch all users (Admin access only)
- GET /api/users/:userId: Fetch a user by ID
- PATCH /api/user/:userId: Update user details (username, password)

**Transaction**
- POST /api/checkout: for checking out and creating a new transaction
- GET /api/transactions: for fetching all transactions
- PATCH /api/transactions/:transactionId: for updating transaction status
- PATCH /api/transactions/cancel/:transactionId: used to cancel transactions by transaction ID
- GET /api/sales/:duration: for fetching sales data for weekly, monthly, or annual periods

### MORE REPOSITORIES (COMMIT VIEWING)

linked here is a github repository for testing frontend design, commits can be seen [https://github.com/silapan/cmsc100-extra-repo.git](here).

## RESOURCES
- [unsplash.com](unsplash.com)
- [pexels.com](pexels.com)
- [fonts.google.com](fonts.google.com)
