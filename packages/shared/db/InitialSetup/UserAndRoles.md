# Setup of users and roles.

Production passwords are not stored here.

create user web with password 'password';
create user bg with password 'password';
create user db_admin with password 'password';

ALTER ROLE web LOGIN PASSWORD 'password';
ALTER ROLE bg LOGIN PASSWORD 'password';
ALTER ROLE db_admin LOGIN PASSWORD 'password';
