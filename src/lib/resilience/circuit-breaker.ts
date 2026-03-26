import { CIRCUIT_BREAKER_CONFIG } from '../config/constants';
import { logger } from '../observability/logger';

type CircuitState = 'closed' | 'open' | 'half-open';

export class CircuitBreakerOpenError extends Error {
  constructor(name: string) {
    super(`Circuit breaker "${name}" is open. Request rejected.`);
    this.name = 'CircuitBreakerOpenError';
  }
}

export class CircuitBreaker {
  private state: CircuitState = 'closed';
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly name: string;
  private readonly failureThreshold: number;
  private readonly recoveryTimeoutMs: number;

  constructor(name: string, config = CIRCUIT_BREAKER_CONFIG) {
    this.name = name;
    this.failureThreshold = config.FAILURE_THRESHOLD;
    this.recoveryTimeoutMs = config.RECOVERY_TIMEOUT_MS;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime >= this.recoveryTimeoutMs) {
        this.state = 'half-open';
        logger.info('circuit-breaker', `${this.name}: transitioning to half-open`);
      } else {
        throw new CircuitBreakerOpenError(this.name);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    if (this.state === 'half-open') {
      logger.info('circuit-breaker', `${this.name}: recovered, closing circuit`);
    }
    this.failureCount = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold || this.state === 'half-open') {
      this.state = 'open';
      logger.warn('circuit-breaker', `${this.name}: circuit OPEN after ${this.failureCount} failures`);
    }
  }
}
