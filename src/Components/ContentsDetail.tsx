import { AnimatePresence, motion, useScroll } from "framer-motion";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import styled from "styled-components";
import { contentState } from "../atoms";
import { makeImagePath } from "../utils";

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

interface DetailProps {
  type: string;
}

const ContentsDetail = ({ type }: DetailProps) => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const bigMovieMatch: PathMatch<string> | null = useMatch(
    type === "movie" ? "/movies/:id" : "/tv/:id"
  );
  const onOverlayClick = () => navigate(type === "movie" ? "/" : "/tv");
  const clickedMovie = useRecoilValue(contentState);

  return (
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
  );
};

export default ContentsDetail;
