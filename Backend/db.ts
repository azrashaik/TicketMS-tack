const Pool = require ("pg").Pool;

 export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'azra123',
    port: 5432
});



