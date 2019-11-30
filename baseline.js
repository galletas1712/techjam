let map = require("./global").map;

const transformdi = (res, pos) => {
  let x = 0,
    y = 0;
  if (
    typeof pos.north === "number" &&
    typeof pos.east === "number" &&
    pos.south === undefined &&
    pos.west === undefined
  ) {
    x = pos.east;
    y = pos.north;
  } else if (
    pos.north === undefined &&
    typeof pos.east === "number" &&
    typeof pos.south === "number" &&
    pos.west === undefined
  ) {
    x = pos.east;
    y = -pos.south;
  } else if (
    pos.north === undefined &&
    pos.east === undefined &&
    typeof pos.south === "number" &&
    typeof pos.west === "number"
  ) {
    x = -pos.west;
    y = -pos.south;
  } else if (
    typeof pos.north === "number" &&
    pos.east === undefined &&
    pos.south === undefined &&
    typeof pos.west === "number"
  ) {
    x = -pos.west;
    y = pos.north;
  } else {
    res.statusMessage = "Request was ill-formed";
    res.status(400).end();
  }
  return [x, y];
};

const transform = (res, pos) => {
  if (pos === undefined) {
    res.statusMessage = "Request was ill-formed";
    res.status(400).end();
  } else {
    let x, y;
    if (typeof pos === "string") {
      if (/^robot#([1-9][0-9]*)$/.test(pos)) {
        if (!map.has(pos)) {
          res.statusMessage = "Insufficient data to compute the result";
          res.status(424).end();
        }
        x = map.get(pos).x;
        y = map.get(pos).y;
      } else {
        res.statusMessage = "Request was ill-formed";
        res.status(400).end();
      }
    } else {
      if (typeof pos.x === "number" && typeof pos.y === "number") {
        x = pos.x;
        y = pos.y;
      } else {
        const z = transformdi(res, pos);
        (x = z[0]), (y = z[1]);
      }
    }
    return [x, y];
  }
};

const distance = (req, res) => {
  // Works
  const first_pos = req.body.first_pos;
  const second_pos = req.body.second_pos;
  const metric = req.body.metric;
  if (first_pos === undefined || second_pos === undefined) {
    res.statusMessage = "Request was ill-formed";
    res.status(400).end();
  } else {
    let a = transform(res, first_pos);
    let b = transform(res, second_pos);

    const dx = Math.abs(a[0] - b[0]);
    const dy = Math.abs(a[1] - b[1]);

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
  let z = {};
  if (/^([1-9][0-9]*)$/.test(req.params.id) === false) {
    res.statusMessage = "Request was ill-formed";
    res.status(400).end();
  }
  if (
    typeof req.body.position.x !== "number" ||
    typeof req.body.position.y !== "number"
  ) {
    let now = transformdi(res, req.body.position);
    (z.x = now[0]), (z.y = now[1]);
  }
  const ss = "robot#" + req.params.id;

  map.set(ss, z);
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
  // Works ?
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
  let k = 1;
  if (req.body.k !== undefined) {
    if (typeof req.body.k !== "number") {
      res.statusMessage = "Request was ill-formed";
      res.status(400).end();
    } else {
      k = req.body.k;
    }
  }
  k = Math.min(k, map.size);
  let points = [];
  for (let entry of map) {
    const dx = entry[1].x - req.body.ref_position.x;
    const dy = entry[1].y - req.body.ref_position.y;
    const dist = dx * dx + dy * dy;
    let xx = 0;
    [_, xx] = entry[0].split("#");
    points.push([dist, parseInt(xx)]);
  }
  points.sort((a, b) => {
    if (a[0] === b[0]) return a[1] - b[1];
    return a[0] - b[0];
  });
  let i;
  let ans = [];
  for (i = 0; i < k; ++i) {
    ans.push(points[i][1]);
  }
  res.send({ robot_ids: ans });
  res.statusMessage = "IDs of nearby robots are returned";
  res.status(200).end();
};

const getClosestPair = require("./closest_pair");

const closestpair = (req, res) => {
  // Works
  if (map.size <= 1) {
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
