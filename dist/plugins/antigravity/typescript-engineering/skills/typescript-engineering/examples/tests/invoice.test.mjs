import test from 'node:test';
import assert from 'node:assert/strict';
import { parseInvoiceRequest, readInvoice, resultStatus } from '../dist/invoice.js';

const alice = { id: 'alice', tenantId: 'north' };
const invoice = {
  id: 'inv-1', ownerId: 'alice', tenantId: 'north', amountCents: 1250,
  internalNote: 'restricted',
};

test('accepts a bounded ID and constructs only the allowed request field', () => {
  assert.deepEqual(parseInvoiceRequest({ invoiceId: 'inv-1', actorId: 'admin' }),
    { ok: true, value: { invoiceId: 'inv-1' } });
});

test('rejects invalid shapes, unsafe IDs and boundary overflow', () => {
  for (const value of [null, [], 1, 'inv-1', {}, { invoiceId: 1 },
    { invoiceId: '' }, { invoiceId: ' ' }, { invoiceId: '../x' },
    { invoiceId: 'a'.repeat(65) }]) {
    assert.deepEqual(parseInvoiceRequest(value), { ok: false, error: 'invalid_input' });
  }
  assert.equal(parseInvoiceRequest({ invoiceId: 'a'.repeat(64) }).ok, true);
});

test('malformed JSON returns a stable error without internal exception detail', () => {
  assert.deepEqual(readInvoice('{', alice, [invoice]), { ok: false, error: 'invalid_input' });
});

test('well-formed invalid input is rejected before lookup', () => {
  assert.deepEqual(readInvoice('{"invoiceId":false}', alice, [invoice]),
    { ok: false, error: 'invalid_input' });
});

test('missing trusted actor is unauthenticated', () => {
  assert.deepEqual(readInvoice('{"invoiceId":"inv-1"}', null, [invoice]),
    { ok: false, error: 'unauthenticated' });
});

test('authorized read returns only public fields, including zero amount', () => {
  assert.deepEqual(readInvoice('{"invoiceId":"inv-1"}', alice, [{ ...invoice, amountCents: 0 }]),
    { ok: true, value: { id: 'inv-1', amountCents: 0 } });
});

test('a forged body actor cannot access another user resource', () => {
  const bob = { id: 'bob', tenantId: 'north' };
  assert.deepEqual(readInvoice('{"invoiceId":"inv-1","actorId":"alice"}', bob, [invoice]),
    { ok: false, error: 'not_found' });
});

test('matching actor ID in a different tenant cannot access the resource', () => {
  assert.deepEqual(readInvoice('{"invoiceId":"inv-1"}', { ...alice, tenantId: 'south' }, [invoice]),
    { ok: false, error: 'not_found' });
});

test('missing resource has the same public response as denied resource', () => {
  assert.deepEqual(readInvoice('{"invoiceId":"missing"}', alice, [invoice]),
    { ok: false, error: 'not_found' });
});

test('maps each outcome to its intentional transport status', () => {
  assert.equal(resultStatus({ ok: true, value: { id: 'inv-1', amountCents: 0 } }), 200);
  assert.equal(resultStatus({ ok: false, error: 'invalid_input' }), 400);
  assert.equal(resultStatus({ ok: false, error: 'unauthenticated' }), 401);
  assert.equal(resultStatus({ ok: false, error: 'not_found' }), 404);
});
