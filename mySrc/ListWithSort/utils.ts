import { type ReactElement } from "react";

export function listToObject(list: { id: string; child: ReactElement }[]) {
  const values = Object.values(list);
  const object: { [id: string]: number } = {};

  for (let i = 0; i < values.length; i++) {
    object[values[i].id] = i;
  }

  return object;
}

export function objectMove(
  object: { [id: string]: number },
  from: number,
  to: number
) {
  "worklet";
  const newObject = Object.assign({}, object);

  for (const id in object) {
    if (object[id] === from) {
      newObject[id] = to;
    }

    if (object[id] === to) {
      newObject[id] = from;
    }
  }

  return newObject;
}
