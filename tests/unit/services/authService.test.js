import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
import Joi from 'joi';

import { registerService, loginService } from '../../../src/services/authService.js';
import User from '../../../src/models/userModel.js';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('../../../src/models/userModel.js', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerService', () => {
    it('should throw an error if the email is invalid', async () => {
      await expect(registerService('invalid-email', 'Valid@123', 'John Doe'))
        .rejects.toThrow('Invalid email format');
    });

    it('should throw an error if the password is invalid', async () => {
      const invalidPassword = 'short';
      await expect(registerService('test@example.com', invalidPassword, 'John Doe'))
        .rejects.toThrow(/Invalid password:/);
    });

    it('should throw an error if the user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      await expect(registerService('test@example.com', 'Valid@123', 'John Doe'))
        .rejects.toThrow('User already exists');
    });

    it('should hash the password and save a new user', async () => {
      User.findOne.mockResolvedValue(null);
      hash.mockResolvedValue('hashedPassword');

      User.create.mockResolvedValue({
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'John Doe',
      });

      const result = await registerService('test@example.com', 'Valid@123', 'John Doe');

      expect(hash).toHaveBeenCalledWith('Valid@123', 10);
      expect(User.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'John Doe',
      });
      expect(result).toMatchObject({
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'John Doe',
      });
    });
  });

  describe('loginService', () => {
    it('should throw an error if the user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(loginService('test@example.com', 'Valid@123'))
        .rejects.toThrow('Invalid email or password');
    });

    it('should throw an error if the password is incorrect', async () => {
      User.findOne.mockResolvedValue({
        email: 'test@example.com',
        password: 'hashedPassword',
      });

      compare.mockResolvedValue(false);

      await expect(loginService('test@example.com', 'WrongPassword'))
        .rejects.toThrow('Invalid email or password');
    });

    it('should return a token if login is successful', async () => {
      const mockUser = {
        _id: '123456',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      User.findOne.mockResolvedValue(mockUser);
      compare.mockResolvedValue(true);
      pkg.sign.mockReturnValue('mockToken');

      process.env.JWT_SECRET = 'secret';
      process.env.JWT_EXPIRATION_TIME = '1h';

      const token = await loginService('test@example.com', 'Valid@123');

      expect(compare).toHaveBeenCalledWith('Valid@123', 'hashedPassword');
      expect(pkg.sign).toHaveBeenCalledWith(
        { userId: mockUser._id, email: mockUser.email },
        'secret',
        { expiresIn: '1h' }
      );
      expect(token).toBe('mockToken');
    });
  });
});