import { useQuery } from "react-query";
import {
  getMovies,
  getTvPopular,
  getMoviesTopLated,
  getMoviesUpComing,
  IGetMoviesResult,
  getTvTopRated,
  getTvAiringToday,
  searchTvs,
} from "../api";

export const useHomeQuery = () => {
  const nowPlaying = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const topRated = useQuery<IGetMoviesResult>(
    ["movies", "topRated"],
    getMoviesTopLated
  );
  const upComing = useQuery<IGetMoviesResult>(
    ["movies", "upComing"],
    getMoviesUpComing
  );

  return [nowPlaying, topRated, upComing];
};

export const useTvQuery = () => {
  const popular = useQuery<IGetMoviesResult>(["tv", "popular"], getTvPopular);

  const topRated = useQuery<IGetMoviesResult>(
    ["tv", "topRated"],
    getTvTopRated
  );
  const airingToday = useQuery<IGetMoviesResult>(
    ["tv", "airingToday"],
    getTvAiringToday
  );

  return [popular, topRated, airingToday];
};

export const useSearchQuery = (keyword: string) => {
  const movieSearch = useQuery<IGetMoviesResult>(
    ["searchMovies", keyword],
    () => searchTvs(keyword)
  );

  const tvSearch = useQuery<IGetMoviesResult>(["searchTvs", keyword], () =>
    searchTvs(keyword)
  );

  return [movieSearch, tvSearch];
};
