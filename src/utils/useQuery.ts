import { useQuery } from "react-query";
import { getMovies, getTopLated, getUpComing, IGetMoviesResult } from "../api";

export const useHomeQuery = () => {
  const nowPlaying = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const topRated = useQuery<IGetMoviesResult>(
    ["movies", "topRated"],
    getTopLated
  );
  const upComing = useQuery<IGetMoviesResult>(
    ["movies", "upComing"],
    getUpComing
  );

  return [nowPlaying, topRated, upComing];
};
