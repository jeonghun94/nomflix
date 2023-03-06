import { useLocation } from "react-router-dom";
import { useSearchQuery } from "../utils/useQuery";
import { motion } from "framer-motion";
import { makeImagePath } from "../utils";
import styled from "styled-components";

const Search = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const Contents = styled.div`
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
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
    margin-bottom: 60px;
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

  const Container = styled.div`
    padding: 60px;
  `;

  const [
    { data: movieData, isLoading: movieLoading },
    { data: tvData, isLoading: tvLoading },
  ] = useSearchQuery(keyword || "");

  interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
    name?: string;
  }

  let results: IMovie[] = [];

  if (movieData?.results && tvData?.results) {
    results = [...movieData.results, ...tvData.results];
  }

  // remove duplicates from results
  results = results.filter(
    (movie, index, self) => index === self.findIndex((t) => t.id === movie.id)
  );

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

  const Heading = styled.h1`
    font-size: 1.3rem;
    margin-top: 50px;
    padding: 50px 0;
    color: #777;
  `;

  const RelatedName = styled.span`
    font-size: 1.3rem;
    color: white;
    &:first-child {
      margin-left: 30px;
    }
  `;

  const Empty = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 50px;
  `;

  const EmptyHeading = styled.div`
    font-size: 0.9rem;

    p {
      color: white;
      margin-bottom: 10px;
      font-weight: 200;
    }

    ul {
      color: white;
      padding: 10px 40px;
    }
    li {
      list-style-type: disc;
    }
  `;

  const Divider = styled.span`
    margin: 0 10px;
    boder-right: 1px solid #c8c8c8 !important;
  `;

  return (
    <>
      {movieLoading || tvLoading ? (
        <Loader>Loading...</Loader>
      ) : results.length === 0 ? (
        <Container>
          <Empty>
            <Heading>
              <EmptyHeading>
                <p>입력하신 "{keyword}"(와)과 일치하는 결과가 없습니다. </p>
                <p>추천 검색어:</p>
                <ul>
                  <li>다른 키워들 입력해 보세요.</li>
                  <li>시리즈나 영화를 찾고 계신가요?</li>
                  <li>
                    영화 제목, 시리즈 제목, 또는 배우나 감독의 이름으로 검색해
                    보세요.
                  </li>
                  <li>
                    코미디, 로맨스, 스포츠 또는 드라마와 같은 장르명으로 검색해
                    보세요.
                  </li>
                </ul>
              </EmptyHeading>
            </Heading>
          </Empty>
        </Container>
      ) : (
        <Container>
          <Heading>
            다음과 관련된 콘텐츠:{``}
            {results.map((movie) => (
              <RelatedName>
                {movie.name}
                <Divider>|</Divider>
              </RelatedName>
            ))}
          </Heading>
          <Contents>
            {results.map((movie) => (
              <Box
                layoutId={movie.id + ""}
                key={movie.id}
                whileHover="hover"
                initial="normal"
                variants={boxVariants}
                //  onClick={() => onBoxClicked(movie.id)}
                transition={{ type: "tween" }}
                $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{movie.name}</h4>
                </Info>
              </Box>
            ))}
          </Contents>
        </Container>
      )}
    </>
  );
};
export default Search;
