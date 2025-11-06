import request from 'supertest';
import app from '../src/app';
import { AuditModel } from '../src/models/audit.model';
import { createUser, login, auth } from '../test/helpers';

describe('Admin user role update + audit', () => {
  it('Admin can change role; audit is created', async () => {
    const admin = await createUser('admin@demo.com', 'Admin');
    const target = await createUser('viewer@demo.com', 'Viewer');

    const adminToken = await login('admin@demo.com');

    const res = await request(app)
      .patch(`/admin/users/${target._id}/role`)
      .set(auth(adminToken))
      .send({ role: 'Editor' });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('Editor');

    const logs = await AuditModel.find({ targetUserId: target._id });
    expect(logs.length).toBe(1);
    expect(logs[0].oldRole).toBe('Viewer');
    expect(logs[0].newRole).toBe('Editor');
    expect(String(logs[0].actorId)).toBe(String(admin._id));
  });

  it('Non-admin cannot change role (403)', async () => {
    await createUser('viewer@demo.com', 'Viewer');
    const editor = await createUser('editor@demo.com', 'Editor');
    const editorToken = await login('editor@demo.com');

    const res = await request(app)
      .patch(`/admin/users/${editor._id}/role`)
      .set(auth(editorToken))
      .send({ role: 'Admin' });

    expect(res.status).toBe(403);
  });
});
