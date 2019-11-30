const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

app.post("/calc", (req, res) => {
    const input = req.body.expression;
    res.send({ result: input + "hello" });
});

app.post("/fuck", (req, res) => {
	res.status(204);
	res.end();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
