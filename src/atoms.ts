import { atom } from "recoil";

export const offsetState = atom({
  key: "offsetState",
  default: 6,
});

export const indexState = atom({
  key: "indexState",
  default: 0,
});

export const leavingState = atom({
  key: "leavingState",
  default: false,
});
