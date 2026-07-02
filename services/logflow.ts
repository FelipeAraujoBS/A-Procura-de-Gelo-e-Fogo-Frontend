const INGESTOR_URL = process.env.LOGFLOW_URL ?? 'http://localhost:3000'
const API_KEY = process.env.LOGFLOW_API_KEY

export type LogflowSeverity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL'

export interface LogflowPayload {
  severity: LogflowSeverity
  message: string
  metadata?: Record<string, unknown>
  traceId?: string
  spanId?: string
}

export async function sendLog(payload: LogflowPayload): Promise<void> {
  if (!API_KEY) return

  try {
    await fetch(`${INGESTOR_URL}/api/v1/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        ...payload,
        service: {
          name: 'gelo-fogo-web',
          version: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
          environment: process.env.NODE_ENV ?? 'development',
        },
      }),
    })
  } catch {
    // never block the app
  }
}
