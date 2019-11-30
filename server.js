const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const baseline = require("./baseline");

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

app.post("/distance", baseline.distance);
app.put("/robot/:id/position", baseline.setposition);
app.get("/robot/:id/position", baseline.getposition);
app.post("/nearest", baseline.nearest);
app.get("/closestpair", baseline.closestpair);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
