import fetch from 'node-fetch';
import { MongoClient } from "mongodb";

let db;
let client;

beforeAll(async () => {
  client = await MongoClient.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = client.db("UsersDB");
});

afterAll(async () => {
  await client.close();
});

describe('Health API', () => {
  it('should return a 200 status and a valid response body', async () => {
    
    const url = 'http://localhost:9001/health';

    const response = await fetch(url);

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual(expect.objectContaining({
      message: 'API is running fine!',
    }));
  });
});

test("should clear the users collection and ensure it is empty", async () => {
  // Insert some mock data to the users collection
  await db.collection("users").insertMany([
    { name: "User1", email: "user1@example.com" },
    { name: "User2", email: "user2@example.com" },
  ]);

  // Verify that the collection initially contains data
  let count = await db.collection("users").countDocuments();
  expect(count).toBeGreaterThan(0);

  // Clear the users collection
  await db.collection("users").deleteMany({});

  // Verify that the collection is empty
  count = await db.collection("users").countDocuments();
  expect(count).toBe(0);
});

describe('Register API', () => {

  it('should successfully register a user and return the appropriate response', async () => {
    const url = 'http://localhost:9001/user/register';

    const payload = {
      name: 'John Doe',
      email: 'jd@test.com',
      password: 'jd',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(201);
    const data = await response.json();

    expect(data).toEqual(
      expect.objectContaining({
        message: 'User registered successfully',
        user: expect.objectContaining({
          name: 'John Doe',
          email: 'jd@test.com',
          password: expect.stringMatching(/^\$2b\$10\$.+/),
          _id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: 0,
        }),
      })
    );
  });

  it('should fail register a user and return the appropriate response', async () => {
    const url = 'http://localhost:9001/user/register';

    const payload = {
      name: 'John Doe',
      email: 'jd@test.com',
      password: 'jd',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(500);
    const data = await response.json();

    expect(data).toEqual(
      expect.objectContaining({
        error: 'Registration failed',
        details: "User already exists"
      })
    );
  });

});

describe('Login API', () => {

  it('should successfully log in a user and return a valid response', async () => {
    const url = 'http://localhost:9001/user/login';

    const payload = {
      email: 'jd@test.com',
      password: 'jd',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(200);
    const data = await response.json();

    expect(data).toEqual(
      expect.objectContaining({
        message: 'Login successful',
        token: expect.any(String),
      })
    );
  });

  it('should login with an invalid user and return an error response', async () => {
    const url = 'http://localhost:9001/user/login';

    const payload = {
      email: 'uknown@user.com',
      password: 'password',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(401);
    const data = await response.json();

    expect(data).toEqual(
      expect.objectContaining({
        error: 'Login failed',
        details: 'Invalid email or password',
      })
    );
  });    
  
});  