import useSearch from "@/api/get-search";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Tabs } from "@/components/ui/vercel-tabs";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import MovieCard from "../movie-card";
import { MovieTypes } from "@/types/movie-by-id";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useGetDiscoverInfinite from "@/api/get-discover-infinite";

export default function SearchResult() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("query") ?? "";
  const type = searchParams.get("type") ?? "movie";
  const [tab, setTab] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isPending,
  } = useSearch<MovieTypes>({ query, media_type: type });

  const {
    data: data_discover,
    fetchNextPage: fetchNextPage_discover,
    hasNextPage: hasNextPage_discover,
    isFetchingNextPage: isFetchingNextPage_discover,
  } = useGetDiscoverInfinite<MovieTypes>({
    endpoint: `discover/movie`,
    params: {
      sort_by: "popularity.desc",
      with_keywords: tab,
    },
    enable: tab !== null,
  });

  const results = data?.pages.flatMap((p) => p.results) ?? [];
  const results_discover = data_discover?.pages.flatMap((p) => p.results) ?? [];

  useEffect(() => {
    setTab(null);
  }, [query, type]);

  useEffect(() => {
    if (type === "keyword" && results.length > 0 && tab === null) {
      setTab((prev) => prev ?? results[0].id);
    }
  }, [results, type, tab]);
  return (
    <div className="relative flex flex-col items-center min-h-[calc(100dvh-390px)] pt-30 max-w-[90%] mx-auto space-y-10 ">
      {type === "keyword" && results.length !== 0 && (
        <ScrollArea className="w-full h-10.5  overflow-x-auto">
          <Tabs tabs={results} onTabChange={(tabId) => setTab(tabId)} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
      <div className="grid grid-cols-7 gap-4">
        {type === "keyword"
          ? results_discover.length !== 0 &&
            results_discover.map((discover) => (
              <MovieCard
                key={discover.id}
                movie={discover}
                media_type="movie"
              />
            ))
          : results.length !== 0 &&
            results.map((result) => (
              <MovieCard key={result.id} movie={result} media_type="movie" />
            ))}
      </div>
      <ScrollToTop />
    </div>
  );
}
