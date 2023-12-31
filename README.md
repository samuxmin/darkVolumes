# Manga Book Library App

Welcome to the Manga Book Library App! This application allows users to manage a collection of Manga books, perform CRUD operations, buy books, and more.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Contributors](#contributors)


## Technologies Used

- NodeJS
- Express
- TypeScript
- MySQL
- mysql2 Node library

## Getting Started
the main file is the index.ts file, it uses the routers in the routes folder, wich uses the files in the services folder to do all the logic needed

## API Documentation
### USERS
#### POST
- `/api/user/register/` Create user, date must be string with Year-Month-Date order. Body example: 
  ```json
  {
    "email":"sam@mail.com",
    "nick":"samuxmin",
    "password":"1234",
    "birthdate":"2002-07-22"
  }

- `/api/user/login/` Login as user. Body example:
  ```json
  {
    "email":"sam@mail.com",
    "password":"1234"
  }
  This will return "ok" if the credentials are valid, and the token for operations that require authorization
  { 
    "ok":true,
    "msg": "Login successful",
    "token":"123456"
  }
  Else
  {
    "ok": false,
    "msg": "login unsuccesful"
  }
#### GET
- `/api/user/email/:email` get user by email (without sensitive information)
- `/api/user/email/:nick` get user by nick (without sensitive information)


### Volumes

#### GET

- `/api/volumes/` Get all volumes
- `/api/volumes/id/:id` Get volume by id
- `/api/volumes/isbn/:isbn` Get volume by ISBN
- `/api/volumes/sortby/:sort` Get all volumes sorted (sort value: "id" | "isbn" | "title" | "author" | "year" | "stock" | "description")
- `/api/volumes/search/:text` Get all volumes with description, title, year, author containing the text

#### POST

- `/api/admin/createbook` Create volume. You need to be logged as admin and pass the token, see the USER actions. Body example:
  ```json
  {
    "author": "Author Name",
    "title": "Title of the Book",
    "description": "Description of the book",
    "isbn": "1234511456773",
    "year": 2023,
    "image": "https://example.com/book_image.jpg",
    "stock": 10,
    "categories": ["Fiction", "Science Fiction"],
    "price":20,
    "token":"12345678"
  }
#### PUT
- `/api/admin/modifybook/id/:id` body similar to previous one, update the book

#### DELETE
- `/api/admin/deletebook/id/:id` delete book identified by id


### CATEGORIES
#### GET
- `/api/categories/` return all categories
#### POST
- `/api/admin/createcategory` Create category. Body example:
  ```json
  {
	  "category":"Fiction"
  }
#### DELETE
- `/api/admin/deletecategory/:category` Delete category

### SALES
#### POST
- `/api/buy/` buy a book. Body example:
  ```json
  {
  "user":"sam@mail.com",
  "books":
    [
      {
        "book":{"id":10},
        "amount":40
      },
      {
        "book":{"id":10},
        "amount":40
      }
    ]
  }


### CART
For all the cart functions, the user will be parsed from the token sent in the request 
#### GET 
- `/api/cart/` get cart from user
  ```json
  {
    "token":"123456"
  }
- This will return all the data from the volume and the amount in the cart

#### DELETE
- `/api/cart/drop` Empty cart, is needed to pass the user email in the body, as above
#### POST
- `/api/cart/add` Add items to cart. Body example
  ```json
  {
    "token":"123456",
    "items":[
      {"id":1,"amount":4},
      {"id":2,"amount":3}
    ]
  }
- `/api/cart/remove` Remove items from cart. Body example
  ```json
  {
    "token":"123456",
    "items":[
      {"id":3,"amount":4},
      {"id":4,"amount":3}
    ]
  }

### TO DO
 - automate testing for all the endpoints
 - frontend :)

 ### Prerequisites

Make sure you have the following installed on your machine:

- NodeJS: [Download NodeJS](https://nodejs.org/)
- MySQL Server: [Download MySQL Server](https://dev.mysql.com/downloads/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/samuxmin/darkVolumes.git

### Contributors
This page is currently being developed by samuxmin (me)
I am a student searching for his first job experience, located in Uruguay
https://github.com/samuxmin/
Contact me via email: mindlersamuel@gmail.com