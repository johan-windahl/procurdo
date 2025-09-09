/*
  Simple seed script skeleton.
  Requires dev deps: tsx (or ts-node), drizzle-orm, @neondatabase/serverless, dotenv
*/
import "dotenv/config";
// Note: imports removed until we add actual seed logic to avoid lint warnings

async function main() {
  // Example: insert a placeholder user if not present
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set; skipping seed.");
    return;
  }
  // no-op seed; extend as needed
  console.log("Seed completed (noop)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
