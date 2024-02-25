import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bulma/css/bulma.css';
import * as Sentry from "@sentry/vue";

const app = createApp(App);

Sentry.init({
    dsn: "https://a2afb364c4448f96549ecce12ced4018@o4506802556502016.ingest.sentry.io/4506807530553344",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
  });

app.use(router);

app.mount('#app');
