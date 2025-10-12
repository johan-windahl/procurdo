export type DatabaseName = 'procudo_dev' | 'procudo_data_dev';

export interface DatabaseConfig {
    name: DatabaseName;
    url: string;
    description: string;
}

export const databases: Record<DatabaseName, DatabaseConfig> = {
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
        if (!databases[dbName]) {
            throw new Error(`Unknown database: ${dbName}`);
        }
        return databases[dbName];
    }

    // Default to procudo_dev if no database specified
    return databases.procudo_dev;
}

export function getAllDatabaseConfigs(): DatabaseConfig[] {
    return Object.values(databases);
}

export function getDatabaseUrl(dbName?: DatabaseName): string {
    return getDatabaseConfig(dbName).url;
}
