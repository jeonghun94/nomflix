import styled from "styled-components";
import useWindowDimensions from "./useDimensions";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { contentState, indexState, leavingState, offsetState } from "../atoms";
import { makeImagePath } from "../utils";
import { useState } from "react";
interface HomeSliderProps {
  data: IMovie[];
  title: string;
  type: "movie" | "tv";
}

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  name?: string;
  overview: string;
}

const SliderTitle = styled.div`
  padding-left: 3rem;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const SliderWrapper = styled(motion.div)`
  position: relative;
`;

const SliderButton = styled.button<{ position: "left" | "right" }>`
  position: absolute;
  width: 3rem;
  height: 100%;
  border: none;
  background-color: transparent;
  color: white;
  left: ${(props) => (props.position === "left" ? "0" : "")};
  right: ${(props) => (props.position === "right" ? "0" : "")};
`;

const Slider = styled.div`
  position: relative;
  height: 9.75vw;
  min-height: 7rem;
  margin-left: 3rem;
  margin-right: 3rem;
`;

const Row = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  aspect-ratio: 12/8;
  height: 9.75vw;
  min-height: 7rem;
  font-size: 2rem;
  border-radius: 8px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  top: 100%;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const ChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-chevron-left"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
    />
  </svg>
);

const ChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-chevron-right"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
    />
  </svg>
);
const HomeSlider = ({ data, type, title }: HomeSliderProps) => {
  const navigate = useNavigate();
  const width = useWindowDimensions();
  const offset = useRecoilValue(offsetState);

  const [contentModal, setContentModal] = useRecoilState(contentState);

  const onBoxClicked = (movieId: number) => {
    const selectedContent = data.filter(({ id }) => id === movieId)[0];
    if (selectedContent) {
      setContentModal({
        layoutId:
          title +
          (type === "tv" ? selectedContent.name : selectedContent.title),
        ...selectedContent,
      });
      if (type === "tv") {
        navigate(`/tv/${movieId}`);
      } else {
        navigate(`/movies/${movieId}`);
      }
    }
  };

  const [index, setIndex] = useRecoilState(indexState);
  const [leaving, setLeaving] = useRecoilState(leavingState);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const [back, setBack] = useState(false);
  const [direction, setDirection] = useState(0);

  const increaseIndex = async () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      await setBack(false);
      const totalMovies = data.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const changeIndex = (increase: boolean) => {
    if (data) {
      if (leaving) return;
      setDirection(increase ? 1 : -1);
      toggleLeaving();
      const totalMovies = data.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) =>
        increase
          ? prev === maxIndex
            ? 0
            : prev + 1
          : prev === 0
          ? maxIndex
          : prev - 1
      );
    }
  };

  const decreaseIndex = async () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      await setBack(true);
      const totalMovies = data.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => {
        return prev === 0 ? maxIndex : prev - 1;
      });
    }
  };
  const rowVariants = {
    hidden: (back: boolean) => ({
      x: back ? -window.outerWidth - 10 : window.outerWidth + 10,
    }),
    visible: {
      x: 0,
    },
    exit: (back: boolean) => ({
      x: back ? window.outerWidth + 10 : -window.outerWidth - 10,
    }),
  };

  const boxVariants = {
    normal: {
      scale: 1,
    },
    hover: {
      scale: 1.3,
      y: -80,
      transition: {
        delay: 0.5,
        duaration: 0.1,
        type: "tween",
      },
    },
  };

  return (
    <>
      <motion.div>
        <SliderTitle>{title}</SliderTitle>
        <SliderWrapper>
          <SliderButton position="left" onClick={decreaseIndex}>
            <ChevronLeft />
          </SliderButton>
          <SliderButton position="right" onClick={increaseIndex}>
            <ChevronRight />
          </SliderButton>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((content) => (
                    <Box
                      layoutId={
                        title + (type === "tv" ? content.name : content.title)
                      }
                      onClick={() => onBoxClicked(content.id)}
                      key={content.id}
                      whileHover="hover"
                      variants={boxVariants}
                      transition={{
                        type: "tween",
                      }}
                      $bgPhoto={makeImagePath(
                        content.backdrop_path ?? content.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{content.title ?? content.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </SliderWrapper>
      </motion.div>
    </>
  );
};

export default HomeSlider;
