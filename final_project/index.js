
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes =
  require('./router/auth_users.js').authenticated;

const genl_routes =
  require('./router/general.js').general;

const app = express();
const PORT = 5000;
const JWT_SECRET = 'bookshop_demo_secret';

app.use(express.json());

app.use(
  '/customer',
  session({
    secret: 'fingerprint_customer',
    resave: false,
    saveUninitialized: false
  })
);

// Protect authenticated routes
app.use('/customer/auth/*', (req, res, next) => {
  const authorization = req.session.authorization;

  if (!authorization || !authorization.accessToken) {
    return res.status(401).json({
      message: 'Please login first'
    });
  }

  try {
    const decoded = jwt.verify(
      authorization.accessToken,
      JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
});

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
