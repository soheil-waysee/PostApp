import { validateAgainstSchema, EventSchema } from './validation';

describe('validateAgainstSchema', () => {
  it('returns valid for correct input', () => {
    const input = {
      timestamp: new Date().toISOString(),
      status: 'pending',
      location: 'Warehouse',
      details: 'Packed and ready',
    };

    const result = validateAgainstSchema(input, EventSchema);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('fails when required fields are missing', () => {
    const input = {
      location: 'Somewhere',
    };

    const result = validateAgainstSchema(input, EventSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('timestamp is required');
    expect(result.errors).toContain('status is required');
  });

  it('fails on invalid timestamp format', () => {
    const input = {
      timestamp: 'not-a-date',
      status: 'pending',
    };

    const result = validateAgainstSchema(input, EventSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('timestamp must be a valid ISO date');
  });

  it('fails when status is not in enum list', () => {
    const input = {
      timestamp: new Date().toISOString(),
      status: 'shipped',
    };

    const result = validateAgainstSchema(input, EventSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'status must be one of: pending, in_transit, delivered, cancelled',
    );
  });

  it('passes with only required fields', () => {
    const input = {
      timestamp: new Date().toISOString(),
      status: 'delivered',
    };

    const result = validateAgainstSchema(input, EventSchema);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('fails if location is wrong type', () => {
    const input = {
      timestamp: new Date().toISOString(),
      status: 'pending',
      location: 123,
    };

    const result = validateAgainstSchema(input, EventSchema);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('location must be a string');
  });
});
