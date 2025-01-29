import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
import User from '../models/userModel.js';

const { sign } = pkg;

// Register a new user
export async function registerService(email, password, name) {
  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hash(password, 10);

  // Create a new user
  const newUser = new User({
    email,
    password: hashedPassword,
    name,
  });

  return await newUser.save();
}

// Authenticate a user and generate a JWT token
export async function loginService(email, password) {
  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify the password
  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate a JWT token
  const token = sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME
  });

  return token;
}