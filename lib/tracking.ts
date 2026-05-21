import * as Sentry from "@sentry/nextjs";

export function trackError(error: unknown, context?: Record<string, unknown>) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error("[ERROR]", error, context);
  }
}

export function trackEvent(name: string, data?: Record<string, unknown>) {
  if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && typeof window !== "undefined") {
    (window as any).plausible?.(name, { props: data });
  }
}
