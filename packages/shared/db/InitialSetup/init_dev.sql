-- Let roles connect to the two DBs
GRANT CONNECT ON DATABASE procurdo_dev      TO db_admin, web, bg;
GRANT CONNECT ON DATABASE procurdo_data_dev TO db_admin, web, bg;

-- Connecta först till procurdo_dev --

-- Make db_admin the owner of the public schema (so migrations are easy)
ALTER SCHEMA public OWNER TO db_admin;

-- db_admin: create/alter/drop inside this DB’s schema(s)
GRANT USAGE, CREATE ON SCHEMA public TO db_admin;

-- Existing objects (if any) – harmless if none
GRANT ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public TO db_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES  IN SCHEMA public TO db_admin;
GRANT EXECUTE ON ALL FUNCTIONS        IN SCHEMA public TO db_admin;

-- Default privileges for FUTURE objects created by db_admin in this DB
ALTER DEFAULT PRIVILEGES FOR USER db_admin IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO web;
ALTER DEFAULT PRIVILEGES FOR USER db_admin IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO web;
ALTER DEFAULT PRIVILEGES FOR USER db_admin IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO web;

-- If bg should be read-only in the app DB:
ALTER DEFAULT PRIVILEGES FOR USER db_admin IN SCHEMA public
  GRANT SELECT ON TABLES TO bg;
ALTER DEFAULT PRIVILEGES FOR USER db_admin IN SCHEMA public
  GRANT SELECT ON SEQUENCES TO bg;
ALTER DEFAULT PRIVILEGES FOR USER db_admin IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO bg;

-- App roles: schema usage
GRANT USAGE ON SCHEMA public TO web, bg;

-- WEB = CRUD on app DB (existing objects)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES    IN SCHEMA public TO web;
GRANT USAGE, SELECT                   ON ALL SEQUENCES IN SCHEMA public TO web;

-- BG = read-only on app DB (existing objects)
GRANT SELECT ON ALL TABLES    IN SCHEMA public TO bg;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO bg;

-- (Optional) Safety: ensure bg cannot write in app DB
REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM bg;

-- Nice UX: default search_path for roles in this DB
ALTER ROLE db_admin IN DATABASE procurdo_dev SET search_path = public;
ALTER ROLE web      IN DATABASE procurdo_dev SET search_path = public;
ALTER ROLE bg       IN DATABASE procurdo_dev SET search_path = public;

-- Connecta först till procurdo_data_dev --
\c procurdo_data_dev

-- Make db_admin the owner of the public schema
ALTER SCHEMA public OWNER TO db_admin;

-- db_admin: create/alter/drop inside this DB’s schema(s)
GRANT USAGE, CREATE ON SCHEMA public TO db_admin;

-- Existing objects (if any)
GRANT ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public TO db_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES  IN SCHEMA public TO db_admin;
GRANT EXECUTE ON ALL FUNCTIONS        IN SCHEMA public TO db_admin;

-- Default privileges for FUTURE objects created by db_admin in this DB
-- BG = CRUD by default
ALTER DEFAULT PRIVILEGES FOR USER db_admin IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO bg;
ALTER DEFAULT PRIVILEGES FOR USER db_admin IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO bg;
ALTER DEFAULT PRIVILEGES FOR USER db_admin IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO bg;

-- WEB = read-only by default
ALTER DEFAULT PRIVILEGES FOR USER db_admin IN SCHEMA public
  GRANT SELECT ON TABLES TO web;
ALTER DEFAULT PRIVILEGES FOR USER db_admin IN SCHEMA public
  GRANT SELECT ON SEQUENCES TO web;
ALTER DEFAULT PRIVILEGES FOR USER db_admin IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO web;

-- App roles: schema usage
GRANT USAGE ON SCHEMA public TO web, bg;

-- BG = CRUD on data DB (existing objects)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES    IN SCHEMA public TO bg;
GRANT USAGE, SELECT                   ON ALL SEQUENCES IN SCHEMA public TO bg;

-- WEB = read-only on data DB (existing objects)
GRANT SELECT ON ALL TABLES    IN SCHEMA public TO web;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO web;

-- Nice UX: default search_path for roles in this DB
ALTER ROLE db_admin IN DATABASE procurdo_data_dev SET search_path = public;
ALTER ROLE web      IN DATABASE procurdo_data_dev SET search_path = public;
ALTER ROLE bg       IN DATABASE procurdo_data_dev SET search_path = public;