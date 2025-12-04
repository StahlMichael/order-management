import express from 'express';
import bodyParser from 'body-parser';
import sql from 'mssql';

const app = express();
const port = 3000;

app.use(bodyParser.json());

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

app.get('/', (req, res) => {
    res.send('Order API is running!');
});

app.post('/order', async (req, res) => {
    const orderData = req.body;

    try {
        const pool = await sql.connect(sqlConfig);
        const orderResult = await pool.request()
            .input('FormUUID', sql.NVarChar(50), orderData.FormUUID)
            .input('DocketNumber', sql.NVarChar(50), orderData.DocketNumber)
            .input('Hidden', sql.Bit, orderData.Hidden)
            .query(`
                INSERT INTO Orders (FormUUID, DocketNumber, Hidden)
                OUTPUT INSERTED.OrderID
                VALUES (@FormUUID, @DocketNumber, @Hidden)
            `);

        const generatedOrderID = orderResult.recordset[0].OrderID;
        for (const pax of orderData.Paxs) {
            await pool.request()
                .input('OrderID', sql.Int, generatedOrderID)
                .input('Name', sql.NVarChar(100), pax.Name)
                .input('Age', sql.Int, pax.Age)
                .input('Passport', sql.NVarChar(50), pax.Passport)
                .input('PassportAttachment', sql.NVarChar(255), pax.PassportAttachment)
                .query(`
                    INSERT INTO Paxs (OrderID, Name, Age, Passport, PassportAttachment)
                    VALUES (@OrderID, @Name, @Age, @Passport, @PassportAttachment)
                `);
        }

        await pool.close();
        res.json({ message: 'Order saved to SQL Server' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
