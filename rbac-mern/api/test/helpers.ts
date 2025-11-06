import request from 'supertest';
import app from '../src/app';
import { UserModel } from '../src/models/user.model';
import bcrypt from 'bcryptjs';

export async function createUser(email: string, role: 'Admin'|'Editor'|'Viewer', pwd='Passw0rd!') {
  const passwordHash = await bcrypt.hash(pwd, 10);
  const user = await UserModel.create({ email, passwordHash, role });
  return user;
}

export async function login(email: string, password='Passw0rd!') {
  const res = await request(app)
    .post('/auth/login')
    .send({ email, password });
  return res.body.accessToken as string;
}

export function auth(token: string) {
  return { Authorization: `Bearer ${token}` };
}
