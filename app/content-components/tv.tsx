import ReusableSwiper from "../reusable-display";

export interface ReusableSwiperTypes {
  endpoint: string;
  params: Record<string, string | number>;
  title: string;
}

export default function TvShow() {
  const endpoints: ReusableSwiperTypes[] = [
    { endpoint: "tv/popular", params: { page: 1 }, title: "Popular TV Shows" },
    {
      endpoint: "tv/top_rated",
      params: { page: 1 },
      title: "Top Rated TV Shows",
    },
    {
      endpoint: "discover/tv",
      params: { page: 1, with_genres: 18, sort_by: "popularity.desc" },
      title: "Drama Favorites",
    },
    {
      endpoint: "discover/tv",
      params: { page: 1, with_genres: 10759, sort_by: "popularity.desc" },
      title: "Action & Adventure",
    },
    {
      endpoint: "discover/tv",
      params: { page: 1, with_genres: 16, sort_by: "popularity.desc" },
      title: "Animation",
    },
    {
      endpoint: "discover/tv",
      params: { page: 1, with_genres: 35, sort_by: "popularity.desc" },
      title: "Comedy",
    },
    {
      endpoint: "discover/tv",
      params: { page: 1, with_genres: 10763, sort_by: "popularity.desc" },
      title: "News",
    },
    {
      endpoint: "discover/tv",
      params: { page: 1, with_genres: 9648, sort_by: "popularity.desc" },
      title: "Mystery TV Shows",
    },
    {
      endpoint: "discover/tv",
      params: { page: 1, with_genres: 10762, sort_by: "popularity.desc" },
      title: "Kids Shows",
    },
    {
      endpoint: "discover/tv",
      params: { page: 1, with_genres: 10764, sort_by: "popularity.desc" },
      title: "Reality TV",
    },
    {
      endpoint: "discover/tv",
      params: { page: 1, with_genres: 10765, sort_by: "popularity.desc" },
      title: "Sci-Fi & Fantasy",
    },
  ];

  return endpoints.map((meow, index) => (
    <ReusableSwiper
      key={index}
      endpoint={meow.endpoint}
      params={meow.params}
      title={meow.title}
      type="tv"
    />
  ));
}
