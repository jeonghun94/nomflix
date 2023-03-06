import { atom } from "recoil";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  layoutId: string;
  name?: string;
  release_date?: string;
}

export const clickedState = atom<IMovie | null>({
  key: "clickedState",
  default: null,
});
