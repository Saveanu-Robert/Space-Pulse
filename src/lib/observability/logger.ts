type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  module: string;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

function formatLog(entry: LogEntry): string {
  const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.module}] ${entry.message}`;
  if (entry.data && Object.keys(entry.data).length > 0) {
    return `${base} ${JSON.stringify(entry.data)}`;
  }
  return base;
}

function log(level: LogLevel, module: string, message: string, data?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    module,
    message,
    timestamp: new Date().toISOString(),
    data,
  };

  const formatted = formatLog(entry);

  switch (level) {
    case 'debug':
      if (process.env.NODE_ENV === 'development') console.debug(formatted);
      break;
    case 'info':
      console.info(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    case 'error':
      console.error(formatted);
      break;
  }
}

export const logger = {
  debug: (module: string, message: string, data?: Record<string, unknown>) =>
    log('debug', module, message, data),
  info: (module: string, message: string, data?: Record<string, unknown>) =>
    log('info', module, message, data),
  warn: (module: string, message: string, data?: Record<string, unknown>) =>
    log('warn', module, message, data),
  error: (module: string, message: string, data?: Record<string, unknown>) =>
    log('error', module, message, data),
};
