import express from 'express';
import User from '../models/UserSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'يرجى ملء جميع الحقول' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'البريد مسجل مسبقًا' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.SECRET_KEY,
      { expiresIn: '1w' }
    );

    return res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'حدث خطأ في السيرفر', error });
  }
});


router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'يرجى ملء جميع الحقول' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'المستخدم غير موجود' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'كلمة المرور غير صحيحة' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1w' });

    return res.status(200).json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'حدث خطأ في السيرفر', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'حدث خطأ في السيرفر', error });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'معرف المستخدم غير صالح' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(400).json({ message: 'المستخدم غير موجود' });
    }

    return res.status(200).json({ message: 'تم حذف المستخدم بنجاح' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'حدث خطأ في السيرفر', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const id = req.params.id.trim();

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, password, role },
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    return res.status(200).json(user);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
