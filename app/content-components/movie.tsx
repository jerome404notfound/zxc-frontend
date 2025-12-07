import ReusableSwiper from "../reusable-display";
import { format } from "date-fns";

export interface ReusableSwiperTypes {
  endpoint: string;
  params: Record<string, string | number>;
  title: string;
  label?: string;
}
export default function Movie() {
  const currentDay = format(new Date(), "EEEE"); // → "Saturday"

  const endpoints: ReusableSwiperTypes[] = [
    {
      endpoint: "trending/movie/day",
      params: { page: 1 },
      title: "Trending Today",
      label: currentDay,
    },
    {
      endpoint: "discover/movie",
      params: {
        page: 1,
        with_keywords: 186565,
        sort_by: "popularity.desc",
      },
      title: "Zombie Movies",
    },

    {
      endpoint: "discover/movie",
      params: {
        page: 1,
        sort_by: "popularity.desc",
      },
      title: "Popular Movies",
    },
    {
      endpoint: "discover/movie",
      params: {
        page: 1,
        primary_release_year: 2025,
        sort_by: "vote_average.desc",
        "vote_count.gte": 1000,
      },
      title: "Top Rated Movies",
      label: "2025",
    },
    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 27, sort_by: "popularity.desc" },
      title: "Horror Favorites",
    },

    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 878, sort_by: "popularity.desc" },
      title: "Sci-Fi Classics",
    },

    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 16, sort_by: "popularity.desc" },
      title: "Animation",
    },
    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 35, sort_by: "popularity.desc" },
      title: "Comedy",
    },
    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 10749, sort_by: "popularity.desc" },
      title: "Romance",
    },
    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 53, sort_by: "popularity.desc" },
      title: "Thrillers",
    },
    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 12, sort_by: "popularity.desc" },
      title: "Adventure Movies",
    },
    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 36, sort_by: "popularity.desc" },
      title: "Historical Movies",
    },
    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 14, sort_by: "popularity.desc" },
      title: "Fantasy Movies",
    },
    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 18, sort_by: "popularity.desc" },
      title: "Drama",
    },
    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 10402, sort_by: "popularity.desc" },
      title: "Musicals",
    },
    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 10751, sort_by: "popularity.desc" },
      title: "Family Movies",
    },
    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 9648, sort_by: "popularity.desc" },
      title: "Mystery Movies",
    },
    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 10752, sort_by: "popularity.desc" },
      title: "War Movies",
    },
    {
      endpoint: "discover/movie",
      params: { page: 1, with_genres: 37, sort_by: "popularity.desc" },
      title: "Western Movies",
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
