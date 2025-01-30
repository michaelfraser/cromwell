"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService_1 = require("../../../src/services/authService");
const userModel_1 = __importDefault(require("../../../src/models/userModel"));
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
        it('should throw an error if the email is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            yield expect((0, authService_1.registerService)('invalid-email', 'Valid@123', 'John Doe'))
                .rejects.toThrow('Invalid email format');
        }));
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an error if the password is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidPassword = 'short';
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            yield expect((0, authService_1.registerService)('test@example.com', invalidPassword, 'John Doe'))
                .rejects.toThrow(/Invalid password:/);
        }));
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an error if the user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            userModel_1.default.findOne.mockResolvedValue({ email: 'test@example.com' });
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            yield expect((0, authService_1.registerService)('test@example.com', 'Valid@123', 'John Doe'))
                .rejects.toThrow('User already exists');
        }));
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should hash the password and save a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            userModel_1.default.findOne.mockResolvedValue(null);
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            bcrypt_1.hash.mockResolvedValue('hashedPassword');
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            userModel_1.default.create.mockResolvedValue({
                email: 'test@example.com',
                password: 'hashedPassword',
                name: 'John Doe',
            });
            const result = yield (0, authService_1.registerService)('test@example.com', 'Valid@123', 'John Doe');
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(bcrypt_1.hash).toHaveBeenCalledWith('Valid@123', 10);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(userModel_1.default.create).toHaveBeenCalledWith({
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
        }));
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should handle errors during password hashing', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            userModel_1.default.findOne.mockResolvedValue(null);
            // @ts-expect-error TS(2339): Property 'mockRejectedValue' does not exist on typ... Remove this comment to see the full error message
            bcrypt_1.hash.mockRejectedValue(new Error('Hashing failed'));
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            yield expect((0, authService_1.registerService)('test@example.com', 'Valid@123', 'John Doe'))
                .rejects.toThrow('Hashing failed');
        }));
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should handle database errors during user creation', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            userModel_1.default.findOne.mockResolvedValue(null);
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            bcrypt_1.hash.mockResolvedValue('hashedPassword');
            // @ts-expect-error TS(2339): Property 'mockRejectedValue' does not exist on typ... Remove this comment to see the full error message
            userModel_1.default.create.mockRejectedValue(new Error('Database error'));
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            yield expect((0, authService_1.registerService)('test@example.com', 'Valid@123', 'John Doe'))
                .rejects.toThrow('Database error');
        }));
    });
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('loginService', () => {
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an error if the user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            userModel_1.default.findOne.mockResolvedValue(null);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            yield expect((0, authService_1.loginService)('test@example.com', 'Valid@123'))
                .rejects.toThrow('Invalid email or password');
        }));
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should throw an error if the password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            userModel_1.default.findOne.mockResolvedValue({
                email: 'test@example.com',
                password: 'hashedPassword',
            });
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            bcrypt_1.compare.mockResolvedValue(false);
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            yield expect((0, authService_1.loginService)('test@example.com', 'WrongPassword'))
                .rejects.toThrow('Invalid email or password');
        }));
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should return a token if login is successful', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                _id: '123456',
                email: 'test@example.com',
                password: 'hashedPassword',
            };
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            userModel_1.default.findOne.mockResolvedValue(mockUser);
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            bcrypt_1.compare.mockResolvedValue(true);
            // @ts-expect-error TS(2339): Property 'mockReturnValue' does not exist on type ... Remove this comment to see the full error message
            jsonwebtoken_1.default.sign.mockReturnValue('mockToken');
            process.env.JWT_SECRET = 'secret';
            process.env.JWT_EXPIRATION_TIME = '1h';
            const token = yield (0, authService_1.loginService)('test@example.com', 'Valid@123');
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(bcrypt_1.compare).toHaveBeenCalledWith('Valid@123', 'hashedPassword');
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith({ userId: mockUser._id, email: mockUser.email }, 'secret', { expiresIn: '1h' });
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(token).toBe('mockToken');
        }));
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should handle errors during password comparison', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                _id: '123456',
                email: 'test@example.com',
                password: 'hashedPassword',
            };
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            userModel_1.default.findOne.mockResolvedValue(mockUser);
            // @ts-expect-error TS(2339): Property 'mockRejectedValue' does not exist on typ... Remove this comment to see the full error message
            bcrypt_1.compare.mockRejectedValue(new Error('Comparison failed'));
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            yield expect((0, authService_1.loginService)('test@example.com', 'Valid@123'))
                .rejects.toThrow('Comparison failed');
        }));
        // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
        it('should handle missing JWT_SECRET', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                _id: '123456',
                email: 'test@example.com',
                password: 'hashedPassword',
            };
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            userModel_1.default.findOne.mockResolvedValue(mockUser);
            // @ts-expect-error TS(2339): Property 'mockResolvedValue' does not exist on typ... Remove this comment to see the full error message
            bcrypt_1.compare.mockResolvedValue(true);
            // Ensure JWT_SECRET is deleted
            delete process.env.JWT_SECRET;
            // Mock jsonwebtoken.sign to throw an error when JWT_SECRET is missing
            // @ts-expect-error TS(2339): Property 'mockImplementation' does not exist on ty... Remove this comment to see the full error message
            jsonwebtoken_1.default.sign.mockImplementation(() => {
                throw new Error('JWT_SECRET is not defined');
            });
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            yield expect((0, authService_1.loginService)('test@example.com', 'Valid@123'))
                .rejects.toThrow('JWT_SECRET is not defined');
        }));
    });
});
