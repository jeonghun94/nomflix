import styled from "styled-components";
import useWindowDimensions from "./useDimensions";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { indexState, leavingState, offsetState } from "../atoms";
import { makeImagePath } from "../utils";
import { useState } from "react";

const Slider = styled.div`
  position: relative;
  top: -100px;
  margin: 30px 0px 0px 0px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 6px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  height: 150px;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 150px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  border-radius: 5px;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

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

interface HomeSliderProps {
  data: IMovie[];
  title?: string;
  type?: "nowPlaying" | "topRated" | "upComing";
}

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

const Heading = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;

  color: white;
`;

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
      fill-rule="evenodd"
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
      fill-rule="evenodd"
      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
    />
  </svg>
);
const HomeSlider = ({ data, type, title }: HomeSliderProps) => {
  const navigate = useNavigate();
  const width = useWindowDimensions();
  // const setLeaving = useSetRecoilState(leavingState);
  // const index = useRecoilValue(indexState);
  const offset = useRecoilValue(offsetState);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const [index, setIndex] = useRecoilState(indexState);
  const [leaving, setLeaving] = useRecoilState(leavingState);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const [back, setBack] = useState(false);

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
  const SliderButton = styled.button<{ position: "left" | "right" }>`
    position: absolute;
    width: 3rem;
    height: 100%;
    border: none;
    background-color: transparent;
    color: white;
    border: 1px solid white;
    z-index: 10;
    align-items: center;
    left: ${(props) => (props.position === "left" ? "0" : "")};
    right: ${(props) => (props.position === "right" ? "0" : "")};
  `;

  return (
    <Slider>
      <Heading>{title}</Heading>
      <AnimatePresence
        initial={false}
        onExitComplete={() => setLeaving((prev) => !prev)}
      >
        <SliderButton position="left" onClick={decreaseIndex}>
          <ChevronLeft />
        </SliderButton>
        <SliderButton position="right" onClick={increaseIndex}>
          <ChevronRight />
        </SliderButton>
        <Row
          custom={back}
          initial={{ x: width + 10 }}
          animate={{ x: 0 }}
          exit={{ x: -width - 10 }}
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          {data
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie: any) => (
              <Box
                layoutId={movie.id + ""}
                key={`${type?.charAt(0)}:${movie.id}`}
                whileHover="hover"
                initial="normal"
                variants={boxVariants}
                onClick={() => onBoxClicked(movie.id)}
                transition={{ type: "tween" }}
                $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
              >
                {type?.charAt(0) + movie.id}
                <Info variants={infoVariants}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </Slider>
  );
};

export default HomeSlider;
