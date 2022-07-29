export function getBotToken(): string {
  if (!process.env.BOT_TOKEN) {
    console.error("Environment variable BOT_TOKEN is not found.");
    process.exit();
  }
  return process.env.BOT_TOKEN;
}

export function getPort(): number {
  if (!process.env.PORT) {
    return 3000;
  }
  return parseInt(process.env.PORT, 10);
}

export function getDomain(): string {
  if (!process.env.DOMAIN) {
    console.error("Environment variable DOMAIN is not found.");
    process.exit();
  }
  return process.env.DOMAIN;
}

export function getWebhookSecret(): string {
  if (!process.env.WEBHOOK_SECRET) {
    console.error("Environment variable WEBHOOK_SECRET is not found.");
    process.exit();
  }
  return process.env.WEBHOOK_SECRET;
}

export function getMongoURI(): string {
  if (!process.env.MONGO_URI) {
    console.error("Environment variable MONGO_URI is not found");
    process.exit();
  }
  return process.env.MONGO_URI;
}
