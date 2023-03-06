import styled from "styled-components";
import { makeImagePath } from "../utils";
import Slider from "../Components/Contents";
import { useHomeQuery } from "../utils/useQuery";
import ContentsDetail from "../Components/ContentsDetail";

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

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Sliders = styled.div`
  margin-top: -120px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Home = () => {
  const [
    { data: nowPlayingData, isLoading: nowPlayingLoading },
    { data: topRatedData, isLoading: topRatedLoading },
    { data: upComingData, isLoading: upComingLoading },
  ] = useHomeQuery();

  console.log(nowPlayingData);

  return (
    <Wrapper>
      {nowPlayingLoading || topRatedLoading || upComingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              nowPlayingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>

          <Sliders>
            <Slider
              data={nowPlayingData?.results!}
              title="지금 뜨는 영화"
              type="movie"
            />
            <Slider
              data={topRatedData?.results!}
              title="오늘 대한민국 Top 10 영화"
              type="movie"
            />
            <Slider
              data={upComingData?.results!}
              title="새로 올라온 영화"
              type="movie"
            />
          </Sliders>
          <ContentsDetail type="movie" />
        </>
      )}
    </Wrapper>
  );
};
export default Home;
