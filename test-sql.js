import sql from 'mssql';
const sqlConfig = {
    user: 'Michael',
    password: '2585',
    server: 'SQL-SERVER\\GILBOA',
    database: 'SKI',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};
async function testConnection() {
    try {
        await sql.connect(sqlConfig);
        console.log('Connected to SQL Server successfully!');
        await sql.close();
    }
    catch (err) {
        console.error('SQL Server connection error:', err);
    }
}
testConnection();
//# sourceMappingURL=test-sql.js.map