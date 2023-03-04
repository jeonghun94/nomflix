import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { indexState, leavingState, offsetState } from "../atoms";
import { makeImagePath } from "../utils";
import useWindowDimensions from "./useDimensions";

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 6px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
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
  tpye: "now_playing" | "top_rated" | "upcoming";
}

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

const HomeSlider = ({ data }: HomeSliderProps) => {
  const navigate = useNavigate();
  const setLeaving = useSetRecoilState(leavingState);
  const offset = useRecoilValue(offsetState);
  const index = useRecoilValue(indexState);
  const width = useWindowDimensions();
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <Slider>
      <AnimatePresence
        initial={false}
        onExitComplete={() => setLeaving((prev) => !prev)}
      >
        <Row
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
                key={movie.id}
                whileHover="hover"
                initial="normal"
                variants={boxVariants}
                onClick={() => onBoxClicked(movie.id)}
                transition={{ type: "tween" }}
                $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
              >
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
