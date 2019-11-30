const distance = (req, res) => {
    const first_pos = req.body.first_pos;
    const second_pos = req.body.second_pos;
    const metric = req.body.metric;

    if(first_pos.x === undefined || first_pos.y === undefined || second_pos.x === undefined || second_pos.y === undefined || metric === undefined) {
        res.statusMessage = "Insufficient data to compute the result";
        res.status(424).end();
    } else if(typeof first_pos.x !== 'number' || typeof first_pos.y !== 'number' || typeof second_pos.x !== 'number' || typeof second_pos.y !== 'number' || (metric !== "euclidean" && metric !== "manhattan")) {
        res.statusMessage = "Request was ill-formed";
        res.status(400).end();
    } else {
        const dx = Math.abs(first_pos.x - second_pos.x);
        const dy = Math.abs(first_pos.y - second_pos.y);

        res.statusMessage = "Distance is computed";
        if(metric === "euclidean") {
            res.send({"distance" : Math.sqrt(dx * dx + dy * dy)});
        } else {
            res.send({"distance" : dx + dy});
        }
    }
};

exports.distance = distance;
