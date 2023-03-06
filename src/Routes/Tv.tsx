import styled from "styled-components";
import { makeImagePath } from "../utils";
import Slider from "../Components/Contents";
import { useTvQuery } from "../utils/useQuery";
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

const Tv = () => {
  const [
    { data: popularData, isLoading: popularLoading },
    { data: topRatedData, isLoading: topRatedLoading },
    { data: airingData, isLoading: airingLoading },
  ] = useTvQuery();

  return (
    <Wrapper>
      {popularLoading || topRatedLoading || airingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(popularData?.results[0].backdrop_path || "")}
          >
            <Title>{popularData?.results[0].title}</Title>
            <Overview>{popularData?.results[0].overview}</Overview>
          </Banner>

          <Sliders>
            <Slider
              data={topRatedData?.results!}
              title="오늘 대한민국 Top 10 콘텐츠"
              type="tv"
            />
            <Slider
              data={popularData?.results!}
              title="넷플릭스 인기 콘텐츠"
              type="tv"
            />
            <Slider
              data={airingData?.results!}
              title="새로 뜨는 콘텐츠"
              type="tv"
            />
          </Sliders>
          <ContentsDetail type="Tv" />
        </>
      )}
    </Wrapper>
  );
};
export default Tv;
