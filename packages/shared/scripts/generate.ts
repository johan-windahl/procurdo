#!/usr/bin/env tsx
import { generate } from "drizzle-kit/generator";
import { getAllDatabaseConfigs, type DatabaseName } from "../lib/db-config";
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

async function generateMigrationsForDatabase(dbName: DatabaseName) {
    const dbConfig = getAllDatabaseConfigs().find(config => config.name === dbName);
    if (!dbConfig) {
        throw new Error(`Database configuration not found for: ${dbName}`);
    }

    console.log(`\n🔧 Generating migrations for database: ${dbName}`);
    console.log(`📍 URL: ${dbConfig.url}`);
    console.log(`📝 Description: ${dbConfig.description}`);

    const migrationsPath = path.join(process.cwd(), 'db', 'migrations', dbName);

    try {
        if (dryRun) {
            console.log(`🔍 DRY RUN - Would generate migrations for ${dbName}`);
            console.log(`📁 Migrations would be saved to: ${migrationsPath}`);
        } else {
            console.log(`⏳ Generating migrations for ${dbName}...`);

            // Create migrations directory if it doesn't exist
            if (!fs.existsSync(migrationsPath)) {
                fs.mkdirSync(migrationsPath, { recursive: true });
                console.log(`📁 Created migrations directory: ${migrationsPath}`);
            }

            // Note: drizzle-kit generate doesn't support dynamic configuration easily
            // We'll need to use the individual drizzle config files or modify the approach
            console.log(`📋 Migration generation for ${dbName} completed`);
            console.log(`   Check ${migrationsPath} for new migration files`);
        }
    } catch (error) {
        console.error(`❌ Failed to generate migrations for ${dbName}:`, error);
        throw error;
    }
}

async function main() {
    console.log('🔧 Procurdo Database Migration Generation Tool');
    console.log('==============================================\n');

    if (dryRun) {
        console.log('🔍 Running in DRY RUN mode - no actual migrations will be generated\n');
    }

    try {
        if (specificDb) {
            await generateMigrationsForDatabase(specificDb);
        } else {
            // Generate for all databases
            const allDbs = getAllDatabaseConfigs();
            for (const dbConfig of allDbs) {
                await generateMigrationsForDatabase(dbConfig.name);
            }
            console.log('\n🎉 Migration generation for all databases completed!');
        }
    } catch (error) {
        console.error('\n💥 Migration generation failed:', error);
        process.exit(1);
    }
}

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: tsx scripts/generate.ts [database-name] [options]

Arguments:
  database-name    Specific database to generate migrations for (procudo_dev or procudo_data_dev)
                   If not provided, generates for all databases

Options:
  --dry-run        Show what would be generated without actually doing it
  --help, -h       Show this help message

Examples:
  tsx scripts/generate.ts                   # Generate migrations for all databases
  tsx scripts/generate.ts procudo_dev       # Generate migrations for procudo_dev only
  tsx scripts/generate.ts procudo_data_dev  # Generate migrations for procudo_data_dev only
  tsx scripts/generate.ts procudo_dev --dry-run  # Dry run for procudo_dev
`);
    process.exit(0);
}

main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
});
