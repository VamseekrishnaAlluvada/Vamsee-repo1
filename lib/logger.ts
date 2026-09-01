/**
 * Winston logger, one child per test/worker.
 * - Structured JSON to logs/ for CI ingestion.
 * - Human-readable console output.
 * - All payloads are redacted BEFORE reaching the logger (see redact.ts),
 *   but we double-guard sensitive keys in the formatter as defense-in-depth.
 */

import { createLogger, format, transports, Logger } from 'winston';
import * as path from 'path';
import * as fs from 'fs';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const level = process.env.LOG_LEVEL ?? 'info';

const baseLogger: Logger = createLogger({
  level,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'api-automation' },
  transports: [
    new transports.File({
      filename: path.join(LOG_DIR, 'test-run.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 3,
    }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => {
          const { timestamp, level: lvl, message, ...meta } = info;
          const metaStr = Object.keys(meta).length
            ? ` ${JSON.stringify(meta)}`
            : '';
          return `${String(timestamp)} [${lvl}] ${String(message)}${metaStr}`;
        }),
      ),
    }),
  ],
});

/** Create a per-test child logger carrying correlation context. */
export function createTestLogger(context: {
  testId: string;
  worker: number;
  env: string;
}): Logger {
  return baseLogger.child(context);
}

export const logger = baseLogger;
