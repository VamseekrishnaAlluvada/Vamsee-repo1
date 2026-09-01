/**
 * Structured, level-based logger shared by every agent.
 *
 * Industrial-standard logging: each line is a single JSON object carrying a
 * timestamp, the emitting agent, a level, a message and structured context —
 * so logs are greppable and machine-parseable in CI. A human-readable prefix is
 * printed alongside for local dev.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_RANK: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const MIN_LEVEL: LogLevel = (process.env.AGENT_LOG_LEVEL as LogLevel) ?? 'info';

const ICON: Record<LogLevel, string> = { debug: '·', info: 'ℹ', warn: '⚠', error: '✖' };

export interface AgentLogger {
  readonly agent: string;
  debug(msg: string, ctx?: Record<string, unknown>): void;
  info(msg: string, ctx?: Record<string, unknown>): void;
  warn(msg: string, ctx?: Record<string, unknown>): void;
  error(msg: string, ctx?: Record<string, unknown>): void;
  child(agent: string): AgentLogger;
}

function emit(agent: string, level: LogLevel, msg: string, ctx?: Record<string, unknown>): void {
  if (LEVEL_RANK[level] < LEVEL_RANK[MIN_LEVEL]) return;
  const ts = new Date().toISOString();
  const line = { ts, agent, level, msg, ...(ctx ?? {}) };
  const stream = level === 'error' || level === 'warn' ? process.stderr : process.stdout;
  // Human prefix + JSON payload on the same line.
  stream.write(`${ICON[level]} [${agent}] ${msg}  ${JSON.stringify(line)}\n`);
}

export function createLogger(agent: string): AgentLogger {
  return {
    agent,
    debug: (m, c) => emit(agent, 'debug', m, c),
    info: (m, c) => emit(agent, 'info', m, c),
    warn: (m, c) => emit(agent, 'warn', m, c),
    error: (m, c) => emit(agent, 'error', m, c),
    child: (sub) => createLogger(`${agent}:${sub}`),
  };
}
