const distance = (req, res) => {
    const first_pos = req.body.first_pos;
    const second_pos = req.body.second_pos;
    const dx = first_pos.x - second_pos.x;
    const dy = first_pos.y - second_pos.y;
    res.send({"distance" : Math.sqrt(dx * dx + dy * dy)});
};

exports.distance = distance;
