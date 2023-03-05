import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import { useNavigate, useMatch, PathMatch } from "react-router-dom";
import Slider from "../Components/HomeSlider";
import { useTvQuery } from "../utils/useQuery";

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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const Sliders = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 200px;
`;
const Tv = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:id");

  const [
    { data: popularData, isLoading: popularLoading },
    { data: topRatedData, isLoading: topRatedLoading },
    { data: airingData, isLoading: airingLoading },
  ] = useTvQuery();

  const onOverlayClick = () => navigate("/");
  const clickedMovie =
    bigMovieMatch?.params.id &&
    popularData?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.id!
    );

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
              type="topRated"
              title="오늘 대한민국 Top 10 콘텐츠"
            />
            <Slider
              data={popularData?.results!}
              type="nowPlaying"
              title="넷플릭스 인기 콘텐츠"
            />
            <Slider
              data={airingData?.results!}
              type="upComing"
              title="새로 뜨는 콘텐츠"
            />
          </Sliders>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};
export default Tv;
