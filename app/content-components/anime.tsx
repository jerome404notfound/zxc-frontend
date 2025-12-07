import ReusableSwiper from "../reusable-display";
import { format } from "date-fns";

export interface ReusableSwiperTypes {
  endpoint: string;
  params: Record<string, string | number>;
  title: string;
  label?: string;
}
export default function Anime() {
  const currentDay = format(new Date(), "EEEE");

  const endpoints: ReusableSwiperTypes[] = [
    {
      endpoint: "discover/movie",
      params: {
        page: 1,
        with_keywords: "210024,13141",
        sort_by: "popularity.desc",
      },
      title: "Manga Based Anime Movies",
    },
    {
      endpoint: "discover/tv",
      params: {
        page: 1,
        with_keywords: 210024,
        sort_by: "popularity.desc",
      },
      title: "Anime Series",
    },
    {
      endpoint: "discover/tv",
      params: {
        page: 1,
        with_keywords: 210024,
        sort_by: "vote_average.desc", // top-rated anime shows
      },
      title: "Top-Rated Anime Series",
    },
  ];

  return endpoints.map((meow, index) => (
    <ReusableSwiper
      key={index}
      endpoint={meow.endpoint}
      params={meow.params}
      title={meow.title}
      type="movie"
      label={meow.label}
    />
  ));
}
