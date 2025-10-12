#!/usr/bin/env tsx
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getDatabase, getDatabaseUrl, getAllDatabaseConfigs, type DatabaseName } from "../lib/db-config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";

// Get command line arguments
const args = process.argv.slice(2);
const specificDb = args[0] as DatabaseName | undefined;
const dryRun = args.includes('--dry-run');

// Validate database name if provided
if (specificDb && !['procudo_dev', 'procudo_data_dev'].includes(specificDb)) {
    console.error(`Invalid database name: ${specificDb}`);
    console.error('Valid options: procudo_dev, procudo_data_dev');
    process.exit(1);
}

async function migrateDatabase(dbName: DatabaseName) {
    const dbConfig = getAllDatabaseConfigs().find(config => config.name === dbName);
    if (!dbConfig) {
        throw new Error(`Database configuration not found for: ${dbName}`);
    }

    console.log(`\n🚀 Migrating database: ${dbName}`);
    console.log(`📍 URL: ${dbConfig.url}`);
    console.log(`📝 Description: ${dbConfig.description}`);

    const migrationsPath = path.join(process.cwd(), 'db', 'migrations', dbName);

    // Check if migrations directory exists
    if (!fs.existsSync(migrationsPath)) {
        console.log(`⚠️  No migrations directory found for ${dbName} at ${migrationsPath}`);
        return;
    }

    const pool = new Pool({
        connectionString: dbConfig.url,
        max: 1, // Single connection for migrations
    });

    try {
        const db = drizzle(pool);

        if (dryRun) {
            console.log(`🔍 DRY RUN - Would migrate ${dbName}`);
            const migrationFiles = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.sql'));
            console.log(`📋 Found ${migrationFiles.length} migration files`);
            migrationFiles.forEach(file => {
                console.log(`   - ${file}`);
            });
        } else {
            console.log(`⏳ Running migrations for ${dbName}...`);
            await migrate(db, { migrationsFolder: migrationsPath });
            console.log(`✅ Successfully migrated ${dbName}`);
        }
    } catch (error) {
        console.error(`❌ Failed to migrate ${dbName}:`, error);
        throw error;
    } finally {
        await pool.end();
    }
}

async function main() {
    console.log('🔧 Procurdo Database Migration Tool');
    console.log('=====================================\n');

    if (dryRun) {
        console.log('🔍 Running in DRY RUN mode - no actual migrations will be applied\n');
    }

    try {
        if (specificDb) {
            await migrateDatabase(specificDb);
        } else {
            // Migrate all databases
            const allDbs = getAllDatabaseConfigs();
            for (const dbConfig of allDbs) {
                await migrateDatabase(dbConfig.name);
            }
            console.log('\n🎉 All databases migrated successfully!');
        }
    } catch (error) {
        console.error('\n💥 Migration failed:', error);
        process.exit(1);
    }
}

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: tsx scripts/migrate.ts [database-name] [options]

Arguments:
  database-name    Specific database to migrate (procudo_dev or procudo_data_dev)
                   If not provided, migrates all databases

Options:
  --dry-run        Show what would be migrated without actually doing it
  --help, -h       Show this help message

Examples:
  tsx scripts/migrate.ts                    # Migrate all databases
  tsx scripts/migrate.ts procudo_dev        # Migrate only procudo_dev
  tsx scripts/migrate.ts procudo_data_dev   # Migrate only procudo_data_dev
  tsx scripts/migrate.ts procudo_dev --dry-run  # Dry run for procudo_dev
`);
    process.exit(0);
}

main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
});
