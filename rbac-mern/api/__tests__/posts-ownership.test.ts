import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import { PostModel } from '../src/models/post.model';
import { createUser, login, auth } from '../test/helpers';

describe('Posts ownership', () => {
  it('Editor can update own post but not others; Admin can update any', async () => {
    const editor = await createUser('editor@demo.com', 'Editor');
    const admin = await createUser('admin@demo.com', 'Admin');

    const editorToken = await login('editor@demo.com');
    const adminToken  = await login('admin@demo.com');

    const own = await PostModel.create({
      title: 'Editor Post',
      body: 'By editor',
      authorId: editor._id as mongoose.Types.ObjectId,
    });

    const others = await PostModel.create({
      title: 'Admin Post',
      body: 'By admin',
      authorId: admin._id as mongoose.Types.ObjectId,
    });

    // Editor updates own -> 200
    let res = await request(app)
      .put(`/posts/${own._id}`)
      .set(auth(editorToken))
      .send({ title: 'Updated by editor' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated by editor');

    // Editor updates other's -> 403
    res = await request(app)
      .put(`/posts/${others._id}`)
      .set(auth(editorToken))
      .send({ title: 'Should fail' });
    expect(res.status).toBe(403);

    // Admin updates other's -> 200
    res = await request(app)
      .put(`/posts/${others._id}`)
      .set(auth(adminToken))
      .send({ title: 'Updated by admin' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated by admin');
  });
});
