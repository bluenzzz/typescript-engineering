import { parseInvoiceRequest } from './invoice.js';
import type { Actor, InvoiceView, Result } from './invoice.js';

// This exported function is compiled but never invoked. Directives test rejections.
export function checkPublicContracts(): void {
  const parsed = parseInvoiceRequest({ invoiceId: 'inv-1' });
  if (parsed.ok) {
    const id: string = parsed.value.invoiceId;
    void id;
    // @ts-expect-error -- a successful result does not expose an error.
    void parsed.error;
  }
  // @ts-expect-error -- tenant identity is required for resource authorization.
  const actor: Actor = { id: 'alice' };
  // @ts-expect-error -- internal notes are not part of the public DTO.
  const view: InvoiceView = { id: 'inv-1', amountCents: 0, internalNote: 'secret' };
  // @ts-expect-error -- successful results must carry a value.
  const result: Result<string, 'invalid'> = { ok: true };
  const options: { label?: string } = {};
  // @ts-expect-error -- omission differs from explicit undefined under exact optional checking.
  options.label = undefined;
  const ids: string[] = [];
  // @ts-expect-error -- unchecked array access can be undefined.
  const first: string = ids[0];
  void [actor, view, result, options, first];
}
