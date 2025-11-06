import request from 'supertest';
import app from '../src/app';
import { createUser } from '../test/helpers';

describe('Auth', () => {
  it('rejects invalid login payload', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'bad', password: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('logs in and returns access token', async () => {
    await createUser('admin@demo.com', 'Admin');
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@demo.com', password: 'Passw0rd!' });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });
});
