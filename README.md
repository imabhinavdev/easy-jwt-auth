# Easy JWT Auth

Easy JWT Auth is a lightweight library designed to simplify the implementation of JWT authentication in your Node.js applications. This library provides methods to integrate JWT authentication seamlessly with your schema, handle user authentication, and manage token refresh and sign-out processes.

## Installation

You can install Easy JWT Auth using npm:

```bash
npm install easy-jwt-auth
```

## Usage

### Importing the Library

To use Easy JWT Auth, import the required functions into your application:

```javascript
import { addJWTMethodsToSchema, authMiddleware, signout, refreshToken } from 'easy-jwt-auth';
```

### Functions

#### `addJWTMethodsToSchema(schema, secret, uniqueKey, password)`

This function adds JWT methods to your schema for user authentication. It handles password hashing, token generation, and password comparison.

**Parameters:**
- `schema`: The Mongoose schema to which the JWT methods will be added.
- `secret`: The secret key used for signing JWTs.
- `uniqueKey` (optional): The unique key field in the schema (default is 'email').
- `password` (optional): The password field in the schema (default is 'password').

**Usage Example:**

```javascript
import mongoose from 'mongoose';
import { addJWTMethodsToSchema } from 'easy-jwt-auth';

const userSchema = new mongoose.Schema({
  // Define your schema fields here
});

addJWTMethodsToSchema(userSchema, 'your-secret-key');

const User = mongoose.model('User', userSchema);
```

**Methods Added to Schema:**
- `matchPassword(enteredPassword)`: Compares the entered password with the hashed password stored in the database.
- `generateToken(secret, expiresIn)`: Generates a JWT for the user.
- `generateRefreshToken(secret, expiresIn)`: Generates a refresh token for the user.

#### `authMiddleware({ secret, except, algorithms })`

This middleware function checks for a valid JWT in the request headers and attaches the decoded user data to the request object.

**Parameters:**
- `secret`: The secret key used for verifying JWTs.
- `except` (optional): An array of routes to exclude from authentication (default is an empty array).
- `algorithms` (optional): An array of algorithms to use for verifying the JWT (default is ["HS256"]).

**Usage Example:**

```javascript
import express from 'express';
import { authMiddleware } from 'easy-jwt-auth';

const app = express();

app.use(authMiddleware({ secret: 'your-secret-key', except: ['/login', '/register'] }));

app.get('/protected-route', (req, res) => {
  res.json({ message: 'You have access to this protected route', user: req.user });
});
```

#### `refreshToken(secret)`

This function handles refreshing the access token using a refresh token.

**Parameters:**
- `secret`: The secret key used for verifying the refresh token.

**Usage Example:**

```javascript
import express from 'express';
import { refreshToken } from 'easy-jwt-auth';

const app = express();

app.post('/refresh-token', refreshToken('your-secret-key'));
```

#### `signout(req, res)`

This function handles signing out the user by clearing the access and refresh tokens.

**Usage Example:**

```javascript
import express from 'express';
import { signout } from 'easy-jwt-auth';

const app = express();

app.post('/signout', signout);
```

## Example

Here is a complete example of how to use Easy JWT Auth in an Express application:

```javascript
import express from 'express';
import mongoose from 'mongoose';
import { addJWTMethodsToSchema, authMiddleware, signout, refreshToken } from 'easy-jwt-auth';

const app = express();
app.use(express.json());

app.use(authMiddleware({ secret: 'your-secret-key', except: ['/login', '/register'] }));

const userSchema = new mongoose.Schema({
  // Define your schema fields here
});

addJWTMethodsToSchema(userSchema, 'your-secret-key');
const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = user.generateToken('your-secret-key');
  const refreshToken = user.generateRefreshToken('your-secret-key');
  res.json({ token, refreshToken });
});


app.post('/refresh-token', refreshToken('your-secret-key'));

app.post('/signout', signout);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to contribute to this project by submitting issues or pull requests. Your feedback is highly appreciated!