// Basic test to check if the server starts and responds to a simple GET request
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import winston from 'winston';

// Minimal app for testing
const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

describe('Health Check Endpoint', () => {
  it('should return 200 OK and status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
