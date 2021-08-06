# API Deliah Resto
This API is made to facilitate the management of a restaurant. For this purpose it has three entities users, products and orders with the necessary CRUD operations.

## Resources
- Node.js
- Express.js
- Dotenv
- Swagger
- JWT
- Mysql

## Installation
#### 1. Clone the project
```
git clone https://gitlab.com/DDVS/deliah-resto-api.git
```
#### 2. Install dependencies
```
npm install
```

#### 3. Create .env file
Create a file on the project folder
Linux and mac os:
```
touch .env
```

Put this enviroment variables inside

PORT  
DB_HOST  
DB_NAME  
DB_PASSWORD  
DB_USER  
ACCESS_TOKEN_KEY  

#### 3. Run the server
```
npm run start
```
or
```
npm run dev
```
## Documentation 
[Documentation](http://localhost:3000/api-docs) can be accessed at http://localhost:3000/api-docs

Credentials:
| Email          | Pass |
|----------------|------|
| admin@mail.com | 1234 |
| abby@mail.com  | 1234 |

**\* Login in swagger documentation with email and pass**