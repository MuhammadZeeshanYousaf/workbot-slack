import Bugsnag from '@bugsnag/js';

const bugsnagKey = process.env.BUGSNAG_API_KEY;

if (bugsnagKey && !Bugsnag.isStarted()) {
  Bugsnag.start({
    apiKey: bugsnagKey,
    releaseStage: process.env.BUGSNAG_RELEASE_STAGE // 'dev' | 'staging' | 'prod'
  });
}
