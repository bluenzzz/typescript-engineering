export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export type InvoiceRequest = { readonly invoiceId: string };
export type ReadError = 'invalid_input' | 'unauthenticated' | 'not_found';

// Construct this context in trusted authentication middleware, never from body data.
export type Actor = { readonly id: string; readonly tenantId: string };
export type Invoice = {
  readonly id: string;
  readonly ownerId: string;
  readonly tenantId: string;
  readonly amountCents: number;
  readonly internalNote: string;
};
export type InvoiceView = Pick<Invoice, 'id' | 'amountCents'>;

// Policy: ASCII opaque IDs, 1..64 characters; ignore unknown keys by projection.
export function parseInvoiceRequest(value: unknown): Result<InvoiceRequest, 'invalid_input'> {
  if (typeof value !== 'object' || value === null || Array.isArray(value) ||
      !('invoiceId' in value) || typeof value.invoiceId !== 'string' ||
      !/^[A-Za-z0-9_-]{1,64}$/.test(value.invoiceId)) {
    return { ok: false, error: 'invalid_input' };
  }
  return { ok: true, value: { invoiceId: value.invoiceId } };
}

// In-memory, synchronous read: transport limits and authenticated context are adapter duties.
export function readInvoice(
  body: string,
  actor: Actor | null,
  invoices: readonly Invoice[],
): Result<InvoiceView, ReadError> {
  if (actor === null) return { ok: false, error: 'unauthenticated' };

  let value: unknown;
  try {
    value = JSON.parse(body);
  } catch {
    return { ok: false, error: 'invalid_input' };
  }
  const parsed = parseInvoiceRequest(value);
  if (!parsed.ok) return parsed;

  const invoice = invoices.find(candidate =>
    candidate.id === parsed.value.invoiceId &&
    candidate.ownerId === actor.id && candidate.tenantId === actor.tenantId);
  // Deliberately avoid exposing whether a denied resource exists.
  if (invoice === undefined) return { ok: false, error: 'not_found' };
  return { ok: true, value: { id: invoice.id, amountCents: invoice.amountCents } };
}

export const errorStatus = {
  invalid_input: 400,
  unauthenticated: 401,
  not_found: 404,
} satisfies Record<ReadError, number>;

export function assertNever(value: never): never {
  throw new Error('Unexpected result variant');
}

export function resultStatus(result: Result<InvoiceView, ReadError>): number {
  if (result.ok) return 200;
  const error = result.error;
  switch (error) {
    case 'invalid_input': return errorStatus.invalid_input;
    case 'unauthenticated': return errorStatus.unauthenticated;
    case 'not_found': return errorStatus.not_found;
    default: return assertNever(error);
  }
}
