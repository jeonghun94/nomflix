import { atom } from "recoil";

interface IContent {
  backdrop_path: string;
  poster_path: string;
  title: string;
  name: string;
  overview: string;
  id: number;
  layoutId: string;
}

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

export const contentState = atom({
  key: "contentState",
  default: {},
});
