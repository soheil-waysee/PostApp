import { sanitizeId } from './sanitizeId';

describe('sanitizeId', () => {
  it('replaces dashes with underscores', () => {
    expect(sanitizeId('event-id-123')).toBe('event_id_123');
  });

  it('replaces dots and exclamations', () => {
    expect(sanitizeId('hello.world!')).toBe('hello_world_');
  });

  it('replaces @ and dot in emails', () => {
    expect(sanitizeId('user@domain.com')).toBe('user_domain_com');
  });

  it('replaces spaces with underscores', () => {
    expect(sanitizeId('name with spaces')).toBe('name_with_spaces');
  });

  it('leaves valid string unchanged', () => {
    expect(sanitizeId('no_specials')).toBe('no_specials');
  });

  it('replaces multiple special characters', () => {
    expect(sanitizeId('$weird#chars%')).toBe('_weird_chars_');
  });

  it('returns empty string if input is empty', () => {
    expect(sanitizeId('')).toBe('');
  });
});
