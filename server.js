const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// serve frontend files
app.use(express.static("public"));

// connect to database
const db = new sqlite3.Database("./model_portfolio.db");


// API 1: get model funds
app.get("/model-funds", (req, res) => {

    db.all("SELECT * FROM model_funds", [], (err, rows) => {

        if (err) {
            console.error(err);
            res.status(500).send(err);
            return;
        }

        res.json(rows);

    });

});


// API 2: get client holdings
app.get("/holdings", (req, res) => {

    db.all("SELECT * FROM client_holdings WHERE client_id='C001'", [], (err, rows) => {

        if (err) {
            console.error(err);
            res.status(500).send(err);
            return;
        }

        res.json(rows);

    });

});


// API 3: save rebalance
app.post("/save", (req, res) => {

    const { portfolio_value, total_buy, total_sell, net_cash } = req.body;

    const sql = `
    INSERT INTO rebalance_sessions
    (client_id, created_at, portfolio_value, total_to_buy, total_to_sell, net_cash_needed, status)
    VALUES ('C001', datetime('now'), ?, ?, ?, ?, 'PENDING')
    `;

    db.run(sql, [portfolio_value, total_buy, total_sell, net_cash], function(err) {

        if (err) {
            console.error(err);
            res.status(500).send(err);
            return;
        }

        res.json({ message: "Saved successfully" });

    });

});


// start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});