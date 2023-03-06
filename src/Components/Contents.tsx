import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { clickedState } from "../atoms";

interface ContentsProps {
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

const Title = styled.div`
  font-weight: 600;
  font-size: 1.5rem;
  padding-left: 50px;
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
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;

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
  bottom: 0;
  color: white;
  font-weight: 600;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
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

const Contents = ({ data, type, title }: ContentsProps) => {
  const offset = 6;
  const navigate = useNavigate();
  const setDetail = useSetRecoilState(clickedState);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: number) => {
    const selectedContent = data.filter(({ id }) => id === movieId)[0];
    if (selectedContent) {
      setDetail({
        ...selectedContent,
        layoutId: `layout-${movieId}`,
      });
      type === "movie"
        ? navigate(`/movies/${movieId}`)
        : navigate(`/tv/${movieId}`);
    }
  };

  const increaseIndex = async () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const decreaseIndex = async () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
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
      <Title>{title}</Title>
      <SliderButton position="left" onClick={decreaseIndex}>
        <FaAngleLeft />
      </SliderButton>
      <SliderButton position="right" onClick={increaseIndex}>
        <FaAngleRight />
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
    </>
  );
};

export default Contents;
