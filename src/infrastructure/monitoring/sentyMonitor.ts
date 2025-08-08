import * as Sentry from '@sentry/node';

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
    attachStacktrace: true,
    sendDefaultPii: true,
    beforeSend(event) {
      if (event.exception?.values) {
        for (const exception of event.exception.values) {
          if (exception.stacktrace?.frames) {
            exception.stacktrace.frames.forEach((frame) => {
              if (frame.filename && frame.filename.includes('/dist/')) {
                frame.filename = frame.filename.replace('/dist/', '/src/');
              }
            });
          }
        }
      }
      return event;
    },
  });
}
