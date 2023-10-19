import './utils/env';

(async () => {
  const [{ app }] = await Promise.all([import('~/app'), import('~/slack')]);

  const port = Number(process.env.PORT) || 3000;
  await app.start(port);

  console.log(`⚡️ Bolt app is running on port:${port}`);
})();
