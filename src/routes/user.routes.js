import express from 'express';
import { register, login, logout } from '../controllers/auth.controllers.js';
import { validateUserInput, validateLoginInput } from '../middleware/validateUserMiddleware.js';
import { hashPassword } from '../middleware/hashPasswordMiddleware.js';
import verifyAccessToken from '../middleware/verifyAccessToken.js';

const router = express.Router();

// Register Route
router.post('/register', validateUserInput, hashPassword, register);

// Login Route
router.post('/login', validateLoginInput, login);
//logout Route
router.post('/logout', logout)
// Protected Route
router.get('/protected', verifyAccessToken, (req, res) => {
    res.status(200).json({
        message: "You have access to protected data",
        user: req.user,  // User info added by the verifyAccessToken middleware
    });
});

export default router;
