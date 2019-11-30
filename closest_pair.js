const distance = (p1, p2) => {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
};

const merge = (p, i, k, j, index) => {
  var result = [];
  var length = 0;
  var c1 = i;
  var c2 = k;
  for (var l = 0; l < i; l = l + 1) {
    result[length++] = p[l];
  }
  while (c1 < k || c2 < j) {
    if (c1 < k && c2 < j) {
      if (p[c1][index] < p[c2][index]) {
        result[length++] = p[c1];
        c1 = c1 + 1;
      } else {
        result[length++] = p[c2];
        c2 = c2 + 1;
      }
    } else if (c1 < k) {
      result[length++] = p[c1];
      c1 = c1 + 1;
    } else if (c2 < j) {
      result[length++] = p[c2];
      c2 = c2 + 1;
    }
  }

  for (l = j; l < p.length; l = l + 1) {
    result[length++] = p[l];
  }

  return result;
};

const dac = points => {
  const dacHelper = (i, j) => {
    if (j - i <= 3) {
      if (j - i === 2) {
        var x = points[i];
        var y = points[j - 1];
        if (x[1] > y[1]) {
          var temp = x;
          points[i] = y;
          points[j - 1] = temp;
        }
        return distance(x, y);
      } else {
        var x = points[i];
        var y = points[i + 1];
        var z = points[j - 1];
        if (x[1] > y[1]) {
          var temp = x;
          if (y[1] > z[1]) {
            points[i] = z;
            points[j - 1] = temp;
          } else {
            if (temp[1] > z[1]) {
              points[i] = y;
              points[i + 1] = z;
              points[j - 1] = temp;
            } else {
              points[i] = y;
              points[i + 1] = temp;
            }
          }
        } else {
          if (y[1] > z[1]) {
            var temp = z;
            points[j - 1] = y;
            if (x[1] > temp[1]) {
              points[i + 1] = x;
              points[i] = temp;
            } else {
              points[i + 1] = temp;
            }
          }
        }
        var d12 = distance(x, y);
        var d13 = distance(x, z);
        var d23 = distance(y, z);

        var min = Math.min(d12, d13, d23);

        if (min === d12) {
          return d12;
        } else if (min == d13) {
          return d13;
        } else {
          return d23;
        }
      }
    } else {
      var k = parseInt((i + j) / 2);
      var deltaL = dacHelper(i, k);
      var deltaR = dacHelper(k, j);
      if (deltaL < deltaR) {
        var delta = deltaL;
      } else {
        var delta = deltaR;
      }
      points = merge(points, i, k, j, 1);
      var tempArray = [];
      var x = points[k - 1][0];
      for (var l = 0, len = points.length; l < len; l = l + 1) {
        if (Math.abs(x - points[l][0]) <= delta) {
          tempArray[tempArray.length] = points[l];
        }
      }
      for (l = 0, len = tempArray.length; l < len; l = l + 1) {
        var x = tempArray[l];
        for (var m = l + 1; m <= l + 7 && m < len; m = m + 1) {
          var y = tempArray[m];
          var temp = distance(y, x);
          if (temp < delta) {
            delta = temp;
          }
        }
      }

      return delta;
    }
  };

  points.sort(function(a, b) {
    return a[0] - b[0];
  });

  return dacHelper(0, points.length);
};

const getClosestPair = table => {
  return dac(table);
};

module.exports = getClosestPair;
