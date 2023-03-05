import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { IGetMoviesResult } from "../api";
import styled from "styled-components";
import { useSearchQuery } from "../utils/useQuery";
import Slider from "../Components/HomeSlider";
const Search = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const Wrapper = styled.div`
    background: black;
    padding-bottom: 200px;
  `;
  const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const Sliders = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 100px;
  `;

  const Banner = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    background-size: cover;
  `;
  const [
    { data: movieData, isLoading: movieLoading },
    { data: tvData, isLoading: tvLoading },
  ] = useSearchQuery(keyword || "");

  console.log(movieData);
  console.log(tvData);

  return (
    <Wrapper>
      {movieLoading || tvLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner></Banner>
          <Sliders>
            <Slider data={movieData?.results!} />
            <Slider data={movieData?.results!} />
          </Sliders>
        </>
      )}
    </Wrapper>
  );
};
export default Search;
