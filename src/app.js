import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import routes from './routes/index.js';

const { json } = pkg;

config();

const app = express();
const port = process.env.DOCKER_INTERNAL_PORT;
const uiPort = process.env.UI_PORT;

app.use(json());

// Configure CORS
app.use(cors({
  origin: 'http://localhost:' + uiPort,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // If using cookies/auth
}));

app.use('/', routes);

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});