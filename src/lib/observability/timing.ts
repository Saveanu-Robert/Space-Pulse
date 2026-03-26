import { logger } from './logger';

export async function withTiming<T>(
  module: string,
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = Math.round(performance.now() - start);
    logger.info(module, `${label} completed`, { durationMs: duration });
    return result;
  } catch (error) {
    const duration = Math.round(performance.now() - start);
    logger.error(module, `${label} failed`, {
      durationMs: duration,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
