const distance = (req, res) => {
    const first_pos = req.body.first_pos;
    const second_pos = req.body.second_pos;
    const metric = req.body.metric;

    if(first_pos === undefined || second_pos === undefined) {
        res.statusMessage = "Insufficient data to compute the result";
        res.status(424).end();
    } else {
        let x1, y1, x2, y2;
        if(typeof first_pos === 'string') {
            if("^robot#([1-9][0-9]*)$".test(first_pos)) {
                x1 = map.get(first_pos).x;
                y1 = map.get(first_pos).y;
            } else {
                res.statusMessage = "Request was ill-formed";
                res.status(400).end();
            }
        } else {
            if(typeof req.body.first_pos.x === 'number' && typeof req.body.first_pos.y === 'number') {
                x1 = req.body.first_pos.x;
                y1 = req.body.first_pos.y;
            } else {
                res.statusMessage = "Request was ill-formed";
                res.status(400).end();
            }
        }

        if(typeof second_pos === 'string') {
            if("^robot#([1-9][0-9]*)$".test(second_pos)) {
                x2 = map.get(second_pos).x;
                y2 = map.get(second_pos).y;
            } else {
                res.statusMessage = "Request was ill-formed";
                res.status(400).end();
            }
        } else {
            if(typeof req.body.second_pos.x === 'number' && typeof req.body.second_pos.y === 'number') {
                x1 = req.body.second_pos.x;
                y1 = req.body.second_pos.y;
            } else {
                res.statusMessage = "Request was ill-formed";
                res.status(400).end();
            }
        }

        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);

        res.statusMessage = "Distance is computed";
        if(metric === "manhattan") {
            res.send({"distance" : dx + dy});
        } else if(metric === "euclidean" || metric === undefined) { // if undefined, go euclidean
            res.send({"distance" : Math.sqrt(dx * dx + dy * dy)});
        } else {
            res.statusMessage = "Request was ill-formed";
            res.status(400).end();
        }
    }
};

exports.distance = distance;
