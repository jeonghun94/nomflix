import { atom } from "recoil";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  layoutId: string;
}

export const contentState = atom<IMovie | null>({
  key: "contentState",
  default: null,
});
