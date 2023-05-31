# Arrivo Backend

Arrivo Backend is a Node.js application that follows the MVC (Model-View-Controller) architectural pattern. The app's codebase is organized into distinct folders: routes, controllers, models, and validators.

## Installation

To run the Arrivo Backend app locally, make sure you have Node.js and npm (Node Package Manager) installed. Then follow these steps:

1. Clone this repository:
``` 
git clone https://github.com/your-username/arrivo-backend.git
```
2. Install the dependencies:
```
npm install
```

3. Set up the environment variables:

Create a `.env` file in the root of the project and add the following environment variables:

```plaintext
DB_USER=postgres
DB_HOST=localhost
DB_NAME=arrivo
DB_PASSWORD=postgres
DB_PORT=5432

JWT_SECRET=29a901c8ae1bf5250e3d41a5b872c57bfb9e5a23d2c0a3d15b77d5e9f4c87c36
```
4. Start the app:
```
npm start
```
or 
```
nodemon
```

The app will be running at `http://localhost:3000`.

## Folder Structure

The app's folder structure is organized as follows:

- `routes`: Contains the route definitions for different endpoints.
- `src\controllers`: Handles the logic and request handling for each route.
- `src\models`: Represents the data and performs data-related operations.
- `src\services\validators`: Validates the input data for each request.

### User Routes

- **GET /users**: Retrieve a list of all users. (Requires admin token)
- **GET /users/:id**: Retrieve a specific user by their ID. (Requires admin token) 
- **POST /users**: Add a new user. (Requires admin token)
- **PUT /users/:id**: Update the details of a specific user. (Requires admin token)
- **DELETE /users/:id**: Delete a specific user. (Requires admin token)
- **POST /login**: User authentication route.

### Category Routes 
- **GET /categories**: Retrieve a list of all categories. (Requires token)
- **GET /categories/:id**: Retrieve a specific category by its ID. (Requires token)
- **POST /categories**: Create a new category. (Requires admin token)
- **PUT /categories/:id**: Update the details of a specific category. (Requires admin token)
- **DELETE /categories/:id**: Delete a specific category. (Requires admin token)

### Post Routes
- **GET /posts**: Retrieve a list of all posts. (Requires token)
- **GET /posts/:id**: Retrieve a specific post by its ID. (Requires token)
- **POST /posts**: Create a new post. (Requires admin token)
- **PUT /posts/:id**: Update the details of a specific post. (Requires admin token)
- **DELETE /posts/:id**: Delete a specific post. (Requires admin token)

### Payment Routes
- **GET /payments**: Retrieve a list of all payments. (Requires admin token)
- **GET /payments/:id**: Retrieve a specific payment by its ID. (Requires admin token)
- **POST /payments**: Create a new payment. (Requires token)
- **PUT /payments/:id**: Update the details of a specific payment. (Requires admin token)
- **DELETE /payments/:id**: Delete a specific payment. (Requires admin token)

#
