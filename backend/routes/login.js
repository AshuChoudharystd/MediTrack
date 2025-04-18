import express from 'express';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password, role } = req.body;

  console.log('Received data:', req.body);

  try {
    let user;
    if (role === 'doctor') {
      user = await Doctor.findOne({ email });
    } else if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else {
      user = await User.findOne({ email, role });
    }
    
    if (!user) {
      return res.status(400).send({ error: 'Invalid email or role' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.send({ token, role: user.role });

  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

export default router;
