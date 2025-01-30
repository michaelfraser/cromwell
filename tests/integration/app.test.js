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
const node_fetch_1 = __importDefault(require("node-fetch"));
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const BASE_URL = `http://localhost:${process.env.DOCKER_EXTERNAL_PORT}`;
function buildUrl(path, queryParams = {}) {
    const url = new URL(path, BASE_URL);
    Object.keys(queryParams).forEach(key => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (queryParams[key] !== undefined && queryParams[key] !== null) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            url.searchParams.append(key, queryParams[key]);
        }
    });
    return url.toString();
}
let db;
let client;
// @ts-expect-error TS(2304): Cannot find name 'beforeAll'.
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    client = yield mongodb_1.MongoClient.connect("mongodb://localhost:27017", {
        // @ts-expect-error TS(2345): Argument of type '{ useNewUrlParser: boolean; useU... Remove this comment to see the full error message
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    db = client.db("UsersDB");
}));
// @ts-expect-error TS(2304): Cannot find name 'afterAll'.
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield client.close();
}));
// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Health API', () => {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should return a 200 status and a valid response body', () => __awaiter(void 0, void 0, void 0, function* () {
        const url = buildUrl('/health');
        const response = yield (0, node_fetch_1.default)(url);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(response.status).toBe(200);
        const data = yield response.json();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(data).toEqual(expect.objectContaining({
            message: 'API is running fine!',
        }));
    }));
});
// @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("should clear the users collection and ensure it is empty", () => __awaiter(void 0, void 0, void 0, function* () {
    // Insert some mock data to the users collection
    yield db.collection("users").insertMany([
        { name: "User1", email: "user1@example.com" },
        { name: "User2", email: "user2@example.com" },
    ]);
    // Verify that the collection initially contains data
    let count = yield db.collection("users").countDocuments();
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(count).toBeGreaterThan(0);
    // Clear the users collection
    yield db.collection("users").deleteMany({});
    // Verify that the collection is empty
    count = yield db.collection("users").countDocuments();
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(count).toBe(0);
}));
// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Register API', () => {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should successfully register a user and return the appropriate response', () => __awaiter(void 0, void 0, void 0, function* () {
        const url = buildUrl('/user/register');
        const payload = {
            name: 'John Doe',
            email: 'jd@test.com',
            password: 'JohnD0e!',
        };
        const response = yield (0, node_fetch_1.default)(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(response.status).toBe(201);
        const data = yield response.json();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(data).toEqual(
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect.objectContaining({
            message: 'User registered successfully',
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            user: expect.objectContaining({
                name: 'John Doe',
                email: 'jd@test.com',
                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                password: expect.stringMatching(/^\$2b\$10\$.+/),
                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                _id: expect.any(String),
                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                createdAt: expect.any(String),
                // @ts-expect-error TS(2304): Cannot find name 'expect'.
                updatedAt: expect.any(String),
                __v: 0,
            }),
        }));
    }));
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should fail register a user and return the appropriate response', () => __awaiter(void 0, void 0, void 0, function* () {
        const url = buildUrl('/user/register');
        const payload = {
            name: 'John Doe',
            email: 'jd@test.com',
            password: 'JohnD0e!',
        };
        const response = yield (0, node_fetch_1.default)(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(response.status).toBe(500);
        const data = yield response.json();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(data).toEqual(
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect.objectContaining({
            error: 'Registration failed',
            details: "User already exists"
        }));
    }));
});
// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Login API', () => {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should successfully log in a user and return a valid response', () => __awaiter(void 0, void 0, void 0, function* () {
        const url = buildUrl('/user/login');
        const payload = {
            email: 'jd@test.com',
            password: 'JohnD0e!',
        };
        const response = yield (0, node_fetch_1.default)(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(response.status).toBe(200);
        const data = yield response.json();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(data).toEqual(
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect.objectContaining({
            message: 'Login successful',
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            token: expect.any(String),
        }));
    }));
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should login with an invalid user and return an error response', () => __awaiter(void 0, void 0, void 0, function* () {
        const url = buildUrl('/user/login');
        const payload = {
            email: 'uknown@user.com',
            password: 'password',
        };
        const response = yield (0, node_fetch_1.default)(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(response.status).toBe(401);
        const data = yield response.json();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(data).toEqual(
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect.objectContaining({
            error: 'Login failed',
            details: 'Invalid email or password',
        }));
    }));
});
// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('User API', () => {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should not find a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const url = buildUrl('/user/6799e630d1fbe49663807ed3');
        try {
            const response = yield (0, node_fetch_1.default)(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(response.status).toBe(404);
            const contentType = response.headers.get('content-type');
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(contentType).toContain('application/json');
            const data = yield response.json();
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(data).toEqual(
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect.objectContaining({
                error: 'User not found',
            }));
        }
        catch (error) {
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            throw new Error(`Fetch request failed: ${error.message}`);
        }
    }));
});
