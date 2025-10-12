export type DatabaseName = 'procudo_dev' | 'procudo_data_dev';

export interface DatabaseConfig {
    name: DatabaseName;
    url: string;
    description: string;
}

const runtimeDatabases: Record<DatabaseName, DatabaseConfig> = {
    procudo_dev: {
        name: 'procudo_dev',
        url: process.env.DATABASE_URL_PROCUDO_DEV!,
        description: 'Main application database for development'
    },
    procudo_data_dev: {
        name: 'procudo_data_dev',
        url: process.env.DATABASE_URL_PROCUDO_DATA_DEV!,
        description: 'Data processing database for development'
    }
};

export function getDatabaseConfig(dbName?: DatabaseName): DatabaseConfig {
    if (dbName) {
        const config = runtimeDatabases[dbName];
        if (!config) {
            throw new Error(`Unknown database: ${dbName}`);
        }
        return config;
    }

    // Default to procudo_dev if no database specified
    return runtimeDatabases.procudo_dev;
}

export function getAllDatabaseConfigs(): DatabaseConfig[] {
    return Object.values(runtimeDatabases);
}

export function getDatabaseUrl(dbName?: DatabaseName): string {
    return getDatabaseConfig(dbName).url;
}

export type MigrationDatabaseName =
    | 'procudo_dev'
    | 'procudo_data_dev'
    | 'procudo_prod'
    | 'procudo_data_prod';

type MigrationUrlEnvVar =
    | 'MIGRATION_DATABASE_URL_PROCUDO_DEV'
    | 'MIGRATION_DATABASE_URL_PROCUDO_DATA_DEV'
    | 'MIGRATION_DATABASE_URL_PROCUDO_PROD'
    | 'MIGRATION_DATABASE_URL_PROCUDO_DATA_PROD';

type MigrationFolder = 'procudo_dev' | 'procudo_data_dev';

interface MigrationDatabaseDefinition {
    name: MigrationDatabaseName;
    environment: 'dev' | 'prod';
    description: string;
    migrationsFolder: MigrationFolder;
    urlEnvVar: MigrationUrlEnvVar;
}

export interface MigrationDatabaseConfig extends MigrationDatabaseDefinition {
    url: string;
}

const migrationDatabaseDefinitions: readonly MigrationDatabaseDefinition[] = [
    {
        name: 'procudo_dev',
        environment: 'dev',
        description: 'Main application database for development',
        migrationsFolder: 'procudo_dev',
        urlEnvVar: 'MIGRATION_DATABASE_URL_PROCUDO_DEV'
    },
    {
        name: 'procudo_data_dev',
        environment: 'dev',
        description: 'Data processing database for development',
        migrationsFolder: 'procudo_data_dev',
        urlEnvVar: 'MIGRATION_DATABASE_URL_PROCUDO_DATA_DEV'
    },
    {
        name: 'procudo_prod',
        environment: 'prod',
        description: 'Main application database for production',
        migrationsFolder: 'procudo_dev',
        urlEnvVar: 'MIGRATION_DATABASE_URL_PROCUDO_PROD'
    },
    {
        name: 'procudo_data_prod',
        environment: 'prod',
        description: 'Data processing database for production',
        migrationsFolder: 'procudo_data_dev',
        urlEnvVar: 'MIGRATION_DATABASE_URL_PROCUDO_DATA_PROD'
    }
] as const;

export const MIGRATION_DATABASE_NAMES = migrationDatabaseDefinitions.map(
    (definition) => definition.name
) as readonly MigrationDatabaseName[];

function resolveMigrationConfig(definition: MigrationDatabaseDefinition): MigrationDatabaseConfig {
    const url = process.env[definition.urlEnvVar];

    if (!url) {
        throw new Error(
            `Missing environment variable ${definition.urlEnvVar} for ${definition.name}. ` +
            `Set it in your .env.local file before running migrations.`
        );
    }

    return {
        ...definition,
        url
    };
}

export function getMigrationDatabaseConfig(name: MigrationDatabaseName): MigrationDatabaseConfig {
    const definition = migrationDatabaseDefinitions.find((candidate) => candidate.name === name);

    if (!definition) {
        throw new Error(`Unknown migration database: ${name}`);
    }

    return resolveMigrationConfig(definition);
}

export function getAllMigrationDatabaseConfigs(): MigrationDatabaseConfig[] {
    return migrationDatabaseDefinitions
        .map((definition) => {
            const url = process.env[definition.urlEnvVar];

            if (!url) {
                return null;
            }

            return {
                ...definition,
                url
            };
        })
        .filter((config): config is MigrationDatabaseConfig => Boolean(config));
}
