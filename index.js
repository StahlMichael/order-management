import express from 'express';
import bodyParser from 'body-parser';
import sql from 'mssql';
const app = express();
const port = 3000;
app.use(bodyParser.json());
// SQL Server config
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
        await sql.connect(sqlConfig);
        const orderResult = await sql.query `
  INSERT INTO Orders (FormUUID, DocketNumber, Hidden)
  OUTPUT INSERTED.OrderID
  VALUES (${orderData.FormUUID}, ${orderData.DocketNumber}, ${orderData.Hidden})
`;
        const generatedOrderID = orderResult.recordset[0].OrderID;
        // Insert each Pax
        for (const pax of orderData.Paxs) {
            await sql.query `
    INSERT INTO Paxs (OrderID, Name, Age, Passport, PassportAttachment)
    VALUES (${generatedOrderID}, ${pax.Name}, ${pax.Age}, ${pax.Passport}, ${pax.PassportAttachment})
  `;
        }
        res.json({ message: 'Order saved to SQL Server' });
    }
    catch (err) {
        console.error('Database error:', err); // This will show the error in your terminal
        res.status(500).json({ error: 'Database error', details: err });
    }
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
//# sourceMappingURL=index.js.map