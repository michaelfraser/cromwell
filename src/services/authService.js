import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
import Joi from 'joi';
import User from '../models/userModel.js';

const { sign } = pkg;

const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .message('Invalid email format')
  .required();

const passwordSchema = Joi.object({
  password: Joi.string()
    .min(8).message('Password must be at least 8 characters long')
    .pattern(/[A-Z]/).message('Password must contain at least one uppercase letter')
    .pattern(/[a-z]/).message('Password must contain at least one lowercase letter')
    .pattern(/[0-9]/).message('Password must contain at least one number')
    .pattern(/[^a-zA-Z0-9]/).message('Password must contain at least one special character')
    .required(),
});

// Register a new user
export async function registerService(email, password, name) {
  const { error: emailError } = emailSchema.validate(email);
  if (emailError) {
    throw new Error(emailError.message);
  }

  const { error: passwordError } = passwordSchema.validate({ password }, { abortEarly: false });
  if (passwordError) {
    const messages = passwordError.details.map(detail => detail.message);
    throw new Error(`Invalid password:\n- ${messages.join('\n- ')}`);
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    name,
  });

  return newUser;
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
