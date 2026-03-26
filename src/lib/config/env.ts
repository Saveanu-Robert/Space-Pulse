import { z } from 'zod/v4';

const envSchema = z.object({
  NASA_API_KEY: z.string().min(1, 'NASA_API_KEY is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (_env) return _env;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `Environment validation failed:\n${JSON.stringify(z.treeifyError(parsed.error), null, 2)}`
    );
  }
  _env = parsed.data;
  return _env;
}

export function isDev(): boolean {
  return getEnv().NODE_ENV === 'development';
}
