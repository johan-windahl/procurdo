export declare const db: (import("drizzle-orm/node-postgres").NodePgDatabase<Record<string, unknown>> & {
    $client: import("drizzle-orm/node-postgres").NodePgClient;
}) | (import("drizzle-orm/neon-http").NeonHttpDatabase<Record<string, never>> & {
    $client: import("@neondatabase/serverless").NeonQueryFunction<false, false>;
});
//# sourceMappingURL=db.d.ts.map