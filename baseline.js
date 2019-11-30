const distance = (req, res) => {
    const first_pos = req.body.first_pos;
    const second_pos = req.body.second_pos;
    if(typeof first_pos.x !== 'number' || typeof first_pos.y !== 'number' || typeof second_pos.x !== 'number' || typeof second_pos.y !== 'number') {
        res.statusMessage = "Request was ill-formed";
        res.status(400).end();
    } else {
        const dx = first_pos.x - second_pos.x;
        const dy = first_pos.y - second_pos.y;
        res.statusMessage = "Distance is computed";
        res.send({"distance" : Math.sqrt(dx * dx + dy * dy)});
    }
};

exports.distance = distance;
