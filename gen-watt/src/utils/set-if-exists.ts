type mapType = string | number;

export default function setIfExists(obj, map: mapType[], value) {
  let target = obj;

  for (let idx = 0; idx < map.length; idx++) {
    if (idx === 0 || typeof target[map[idx]] !== 'undefined') target = target[map[idx]];
    else return target;
  }

  target = value;

  return target;
}
