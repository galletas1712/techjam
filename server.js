const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const baseline = require("./baseline");


const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

app.post("/distance", baseline.distance);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
