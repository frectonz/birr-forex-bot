export function getBotToken(): string {
  if (!process.env.BOT_TOKEN) {
    console.log("Environment variable BOT_TOKEN is not found.");
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
    console.log("Environment variable DOMAIN is not found.");
    process.exit();
  }
  return process.env.DOMAIN;
}
