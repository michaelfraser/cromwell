import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
import { registerService, loginService } from '../../../src/services/authService';
import User from '../../../src/models/userModel';

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock('bcrypt', () => ({
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  hash: jest.fn(),
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  compare: jest.fn(),
}));

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock('jsonwebtoken', () => ({
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  sign: jest.fn(),
}));

// @ts-expect-error TS(2304): Cannot find name 'jest'.
jest.mock('../../../src/models/userModel', () => ({
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  findOne: jest.fn(),
  // @ts-expect-error TS(2304): Cannot find name 'jest'.
  create: jest.fn(),
}));

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('AuthService', () => {
  // @ts-expect-error TS(2304): Cannot find name 'afterEach'.
  afterEach(() => {
    // @ts-expect-error TS(2304): Cannot find name 'jest'.
    jest.clearAllMocks();
    // @ts-expect-error TS(2304): Cannot find name 'jest'.
    jest.resetModules(); // Reset modules to clear any cached environment variables
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('registerService', () => {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if the email is invalid', async () => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(registerService('invalid-email', 'Valid@123', 'John Doe'))
        .rejects.toThrow('Invalid email format');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if the password is invalid', async () => {
      const invalidPassword = 'short';
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(registerService('test@example.com', invalidPassword, 'John Doe'))
        .rejects.toThrow(/Invalid password:/);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if the user already exists', async () => {
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(registerService('test@example.com', 'Valid@123', 'John Doe'))
        .rejects.toThrow('User already exists');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should hash the password and save a new user', async () => {
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      User.findOne.mockResolvedValue(null);
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      hash.mockResolvedValue('hashedPassword');

      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      User.create.mockResolvedValue({
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'John Doe',
      });

      const result = await registerService('test@example.com', 'Valid@123', 'John Doe');

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(hash).toHaveBeenCalledWith('Valid@123', 10);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(User.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'John Doe',
      });
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toMatchObject({
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'John Doe',
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should handle errors during password hashing', async () => {
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      User.findOne.mockResolvedValue(null);
      // @ts-expect-error TS(2339): Property 'mockRejectedValue' does not exist on typ... Remove this comment to see the full error message
      hash.mockRejectedValue(new Error('Hashing failed'));

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(registerService('test@example.com', 'Valid@123', 'John Doe'))
        .rejects.toThrow('Hashing failed');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should handle database errors during user creation', async () => {
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      User.findOne.mockResolvedValue(null);
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      hash.mockResolvedValue('hashedPassword');
      // @ts-expect-error TS(2339): Property 'mockRejectedValue' does not exist on typ... Remove this comment to see the full error message
      User.create.mockRejectedValue(new Error('Database error'));

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(registerService('test@example.com', 'Valid@123', 'John Doe'))
        .rejects.toThrow('Database error');
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('loginService', () => {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if the user is not found', async () => {
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      User.findOne.mockResolvedValue(null);

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(loginService('test@example.com', 'Valid@123'))
        .rejects.toThrow('Invalid email or password');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should throw an error if the password is incorrect', async () => {
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      User.findOne.mockResolvedValue({
        email: 'test@example.com',
        password: 'hashedPassword',
      });

      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      compare.mockResolvedValue(false);

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(loginService('test@example.com', 'WrongPassword'))
        .rejects.toThrow('Invalid email or password');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a token if login is successful', async () => {
      const mockUser = {
        _id: '123456',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      User.findOne.mockResolvedValue(mockUser);
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      compare.mockResolvedValue(true);
      // @ts-expect-error TS(2339): Property 'mockReturnValue' does not exist on type ... Remove this comment to see the full error message
      pkg.sign.mockReturnValue('mockToken');

      process.env.JWT_SECRET = 'secret';
      process.env.JWT_EXPIRATION_TIME = '1h';

      const token = await loginService('test@example.com', 'Valid@123');

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(compare).toHaveBeenCalledWith('Valid@123', 'hashedPassword');
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(pkg.sign).toHaveBeenCalledWith(
        { userId: mockUser._id, email: mockUser.email },
        'secret',
        { expiresIn: '1h' }
      );
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(token).toBe('mockToken');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should handle errors during password comparison', async () => {
      const mockUser = {
        _id: '123456',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      User.findOne.mockResolvedValue(mockUser);
      // @ts-expect-error TS(2339): Property 'mockRejectedValue' does not exist on typ... Remove this comment to see the full error message
      compare.mockRejectedValue(new Error('Comparison failed'));

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(loginService('test@example.com', 'Valid@123'))
        .rejects.toThrow('Comparison failed');
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should handle missing JWT_SECRET', async () => {
      const mockUser = {
        _id: '123456',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      User.findOne.mockResolvedValue(mockUser);
      // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
      compare.mockResolvedValue(true);

      // Ensure JWT_SECRET is deleted
      delete process.env.JWT_SECRET;

      // Mock jsonwebtoken.sign to throw an error when JWT_SECRET is missing
      // @ts-expect-error TS(2339): Property 'mockImplementation' does not exist on ty... Remove this comment to see the full error message
      pkg.sign.mockImplementation(() => {
        throw new Error('JWT_SECRET is not defined');
      });

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      await expect(loginService('test@example.com', 'Valid@123'))
        .rejects.toThrow('JWT_SECRET is not defined');
    });
  });
});
