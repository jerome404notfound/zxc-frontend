import { useTvSeason } from "@/api/get-seasons";
import { Button } from "@/components/ui/button";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { useSeasonStore } from "@/store/season";
import { useSpoilerStore } from "@/store/settings-store";
import { ChevronDown, Eye, EyeOff, TextSearch } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import CircularProgress from "./circular-progress";
import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";
import TitleReusable from "@/components/ui/title";
import Link from "next/link";
export default function Episodes({ id }: { id: number }) {
  const { getSeasonSelect } = useSeasonStore();
  const { activateSpoiler, setActivateSpoiler } = useSpoilerStore();
  const savedSeason = getSeasonSelect(id);
  const season_number = savedSeason?.number ?? 1;
  const query = useTvSeason({ id, season_number, media_type: "tv" });
  const [seemore, setSeeMore] = useState(false);
  const episodes = query.data?.episodes ?? [];

  const loading = query.isLoading;
  return (
    <div className="space-y-3 ">
      <TitleReusable
        title={`${savedSeason?.name} Episodes`}
        description={`${episodes.length} episodes`}
      />
      <div className="flex items-end justify-end">
        <Button
          variant="ghost"
          onClick={() => setActivateSpoiler(!activateSpoiler)}
        >
          {activateSpoiler ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span className="text-sm font-medium">Hide Spoilers</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Show Spoilers</span>
            </>
          )}
        </Button>

        {/* <div className="inline-flex items-center gap-2">
          <Switch id="auto-hide" className="rounded-sm [&_span]:rounded" />
          <label htmlFor="auto-hide" className="text-sm text-muted-foreground">
            Auto hide
          </label>
        </div> */}
      </div>

      {loading ? (
        <div className=" flex-1 grid place-items-center">
          <Waveform size="35" stroke="3.5" speed="1" color="white" />
        </div>
      ) : episodes.length === 0 ? (
        <div className=" flex-1 grid place-items-center">
          <div className="flex flex-col items-center gap-5">
            <span className="p-3 bg-card border-2 rounded-full">
              <TextSearch />
            </span>
            <div className="text-center">
              <p className="">No data found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try another keyword.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {episodes.slice(0, seemore ? episodes.length : 6).map((episode) => (
            <Link
              key={episode.id}
              className="group"
              href={`/watch/tv/${id}/${season_number}/${episode.episode_number}`}
            >
              {/* Image */}
              <div className="relative aspect-video mb-3 bg-neutral-900 rounded overflow-hidden">
                {episode.still_path ? (
                  <>
                    <img
                      src={`${IMAGE_BASE_URL}/w780${episode.still_path}`}
                      alt={episode.name}
                      className={`w-full h-full object-cover group-hover:opacity-80 transition-opacity ${
                        !activateSpoiler ? "blur-2xl" : ""
                      }`}
                    />
                    {!activateSpoiler && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="text-center">
                          <EyeOff className="w-8 h-8 mx-auto mb-2 text-white/80" />
                          <p className="text-white/80 text-sm font-medium">
                            Spoiler Hidden
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl font-bold text-neutral-800">
                      {episode.episode_number}
                    </span>
                  </div>
                )}

                {/* Rating Badge */}
                {episode.vote_average > 0 && (
                  <CircularProgress voteAverage={episode.vote_average} />
                )}
              </div>

              {/* Info */}
              <div>
                <h3 className=" font-semibold text-lg mb-1 line-clamp-2 group-hover:text-neutral-300 transition-colors">
                  {!activateSpoiler && "Episode"} {episode.episode_number}.{" "}
                  {activateSpoiler && episode.name}
                </h3>

                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                  {episode.air_date && (
                    <span>
                      {new Date(episode.air_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {episode.runtime && (
                    <>
                      <span>•</span>
                      <span>{episode.runtime} min</span>
                    </>
                  )}
                </div>

                {episode.overview && activateSpoiler && (
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed ">
                    {episode.overview}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {episodes.length > 6 && (
        <div className="flex justify-center items-center gap-1">
          <Button variant="link" onClick={() => setSeeMore(!seemore)}>
            {seemore ? "Show Less" : "Show More"}{" "}
            <ChevronDown
              className={`${seemore ? "rotate-180" : ""} transition-transform`}
            />
          </Button>
        </div>
      )}
      {/* Empty State */}
    </div>
  );
}
