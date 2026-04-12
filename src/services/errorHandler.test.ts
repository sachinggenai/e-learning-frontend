import { handleApiError } from './errorHandler';

describe('handleApiError', () => {
  it('maps validation errors by backend code', () => {
    const result = handleApiError({
      status: 400,
      code: 'VALIDATION_ERROR',
      field: 'answers[0].componentId',
      message: 'Component not found',
      details: { suggestion: 'Check component ID' },
    });

    expect(result.type).toBe('validation');
    expect(result.field).toBe('answers[0].componentId');
    expect(result.details?.suggestion).toBe('Check component ID');
  });

  it('maps rate limit with retry metadata', () => {
    const result = handleApiError({
      status: 429,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests',
    });

    expect(result.type).toBe('rate-limit');
    expect(result.retryAfterMs).toBe(5000);
  });

  it('falls back to network error when status is missing', () => {
    const result = handleApiError({ message: 'Network Error' });

    expect(result.type).toBe('network');
    expect(result.message).toContain('Network Error');
  });
});
