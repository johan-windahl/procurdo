# Database Setup

This project supports multiple databases for different purposes. Here's how to configure them for local development.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database credentials (can be overridden for different environments)
DATABASE_USER=db_admin
DATABASE_PASSWORD=password

# Main application database
DATABASE_URL_PROCUDO_DEV=postgresql://db_admin:password@localhost:5432/procudo_dev

# Data processing database
DATABASE_URL_PROCUDO_DATA_DEV=postgresql://db_admin:password@localhost:5432/procudo_data_dev

# Legacy single database URL (for backward compatibility)
# DATABASE_URL=postgresql://db_admin:password@localhost:5432/procudo_dev
```

## Database Purposes

- **procudo_dev**: Main application database for user data, authentication, and core functionality
- **procudo_data_dev**: Data processing database for large datasets, analytics, and background jobs

## Migration Commands

Once you have both databases set up, you can run migrations for each database:

```bash
# Generate migrations for both databases
pnpm db:gen:procudo_dev
pnpm db:gen:procudo_data_dev

# Migrate all databases
pnpm db:migrate:all

# Migrate specific database
pnpm db:migrate:procudo_dev
pnpm db:migrate:procudo_data_dev

# Dry run (see what would be migrated)
pnpm db:migrate:all --dry-run
```

## Database Connection

The application automatically connects to the appropriate database based on your code. You can also manually specify which database to use:

```typescript
import { getDatabase } from "@procurdo/shared/lib/db";

// Get default database (procudo_dev)
const db = getDatabase();

// Get specific database
const procudoDevDb = getDatabase("procudo_dev");
const procudoDataDevDb = getDatabase("procudo_data_dev");
```

## Troubleshooting

If you encounter connection issues:

1. Make sure both PostgreSQL databases exist:

   ```sql
   CREATE DATABASE procudo_dev;
   CREATE DATABASE procudo_data_dev;
   ```

2. Verify the connection URLs in your `.env.local` file

3. Check that PostgreSQL is running and accessible on localhost:5432

4. Ensure the database user (default: `db_admin`) has appropriate permissions for both databases

5. If you need to create the user manually:

   ```sql
   CREATE USER db_admin WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE procudo_dev TO db_admin;
   GRANT ALL PRIVILEGES ON DATABASE procudo_data_dev TO db_admin;
   ```

6. Verify your environment variables are set correctly:
   ```bash
   echo $DATABASE_USER $DATABASE_PASSWORD
   ```
