let map = require("./global").map;

const distance = (req, res) => {
  // Works
  const first_pos = req.body.first_pos;
  const second_pos = req.body.second_pos;
  const metric = req.body.metric;

  if (first_pos === undefined || second_pos === undefined) {
    res.statusMessage = "Request was ill-formed";
    res.status(400).end();
  } else {
    let x1, y1, x2, y2;
    // Assign x1, y1, to first_pos
    if (typeof first_pos === "string") {
      if (/^robot#([1-9][0-9]*)$/.test(first_pos)) {
        if (!map.has(first_pos)) {
          res.statusMessage = "Insufficient data to compute the result";
          res.status(424).end();
        }
        x1 = map.get(first_pos).x;
        y1 = map.get(first_pos).y;
      } else {
        res.statusMessage = "Request was ill-formed";
        res.status(400).end();
      }
    } else {
      if (
        typeof req.body.first_pos.x === "number" &&
        typeof req.body.first_pos.y === "number"
      ) {
        x1 = req.body.first_pos.x;
        y1 = req.body.first_pos.y;
      } else {
        res.statusMessage = "Request was ill-formed";
        res.status(400).end();
      }
    }
    // Assign x2, y2, to first_pos
    if (typeof second_pos === "string") {
      if (/^robot#([1-9][0-9]*)$/.test(second_pos)) {
        if (!map.has(second_pos)) {
          res.statusMessage = "Insufficient data to compute the result";
          res.status(424).end();
        }
        x2 = map.get(second_pos).x;
        y2 = map.get(second_pos).y;
      } else {
        res.statusMessage = "Request was ill-formed";
        res.status(400).end();
      }
    } else {
      if (
        typeof req.body.second_pos.x === "number" &&
        typeof req.body.second_pos.y === "number"
      ) {
        x2 = req.body.second_pos.x;
        y2 = req.body.second_pos.y;
      } else {
        res.statusMessage = "Request was ill-formed";
        res.status(400).end();
      }
    }

    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);

    res.statusMessage = "Distance is computed";
    if (metric === "manhattan") {
      res.send({ distance: dx + dy });
    } else if (metric === "euclidean" || metric === undefined) {
      // if undefined, go euclidean
      res.send({ distance: Math.sqrt(dx * dx + dy * dy) });
    } else {
      res.statusMessage = "Request was ill-formed";
      res.status(400).end();
    }
  }
};

const setposition = (req, res) => {
  // Works
  if (
    /^([1-9][0-9]*)$/.test(req.params.id) === false ||
    req.body.position === undefined ||
    req.body.position.x == undefined ||
    req.body.position.y === undefined ||
    typeof req.body.position.x !== "number" ||
    typeof req.body.position.y !== "number"
  ) {
    res.statusMessage = "Request was ill-formed";
    res.status(400).end();
  }
  const ss = "robot#" + req.params.id;
  map.set(ss, req.body.position);
  res.statusMessage = "Current position of the robot is updated";
  res.status(204).end();
};

const getposition = (req, res) => {
  // Works
  const ss = "robot#" + req.params.id;
  if (map.has(ss) === false) {
    res.statusMessage = "Unrecognized robot ID";
    res.status(404).end();
  }
  res.send({ position: map.get(ss) });
  res.statusMessage = "Position of the robot is retrieved";
  res.status(204).end();
};

const nearest = (req, res) => {
  // Works
  if (
    req.body.ref_position === undefined ||
    req.body.ref_position.x == undefined ||
    req.body.ref_position.y === undefined ||
    typeof req.body.ref_position.x !== "number" ||
    typeof req.body.ref_position.y !== "number"
  ) {
    res.statusMessage = "Request was ill-formed";
    res.status(400).end();
  }
  let mndist = 3e18;
  let ans = -1;
  for (let entry of map) {
    const dx = entry[1].x - req.body.ref_position.x;
    const dy = entry[1].y - req.body.ref_position.y;
    const dist = dx * dx + dy * dy;
    if (dist < mndist) {
      mndist = dist;
      [_, ans] = entry[0].split("#");
    }
  }
  if (ans === -1) {
    res.send({ robot_ids: [] });
  } else {
    res.send({ robot_ids: [ans] });
  }
  res.statusMessage = "IDs of nearby robots are returned";
  res.status(200).end();
};

const getClosestPair = require("./closest_pair");

const closestpair = (req, res) => {
  if (map.size() <= 1) {
    res.statusMessage = "Insufficient data to compute the result";
    res.status(424).end();
  }
  let points = [];
  for (let amount of map.values()) {
    points.push([amount.x, amount.y]);
  }
  res.send({ distance: getClosestPair(points) });
  res.statusMessage = "The distance is computed";
  res.status(200).end();
};

exports.distance = distance;
exports.setposition = setposition;
exports.getposition = getposition;
exports.nearest = nearest;
exports.closestpair = closestpair;
