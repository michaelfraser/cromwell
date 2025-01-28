import { registerService, loginService } from '../services/authService.js';

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    // Validate request body
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Register the user via authService
    const user = await registerService(email, password, name);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Authenticate user via authService
    const token = await loginService(email, password);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(401).json({ error: 'Login failed', details: error.message });
  }
}
