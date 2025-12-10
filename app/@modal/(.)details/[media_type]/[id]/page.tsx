"use client";
import useMovieById from "@/api/get-movie-by-id";
import { format } from "date-fns";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { motion } from "framer-motion";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import {
  GalleryVerticalEndIcon,
  Home,
  Layers3,
  Play,
  Plus,
  TextSearch,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Recommendations from "./recommendations";
import Genres from "./genres";
import { Button } from "@/components/ui/button";
import Credits from "./credits";
import { formatRuntime } from "@/lib/runtime";
import useYouTubePlayer from "@/hook/youtube-api";
import SeasonSelectorPoster from "./season-selector-poster";
import { useSeasonStore } from "@/store/season";
import Episodes from "./episodes";
import { Separator } from "@/components/ui/separator";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import "ldrs/react/Waveform.css";
import { usePlayStore } from "@/store/play-animation";
import Image from "next/image";
import { MediaSkeleton } from "./skeleton";
import Link from "next/link";
export default function Modal() {
  const searchParams = useSearchParams();
  const queryUrl = searchParams.get("query");
  const isSearching = Boolean(queryUrl);
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const media_type = String(params.media_type);
  const query = useMovieById({ id, media_type });

  const handleCloseDrawer = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setPlay(false);
      setTimeout(() => {
        router.back();
      }, 300);
    }
  };

  const handleHomeDrawer = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setTimeout(() => {
        router.push("/");
      }, 300);
    }
  };

  // const handlePlayMovie = (id: number) => {
  //   if (open) {
  //     setPlay(true);
  //     setTimeout(() => {
  //       router.push(
  //         `/watch/${media_type}/${id}${isSearching ? `?query=${queryUrl}` : ""}`
  //       );
  //     }, 1000);
  //   }
  // };

  const data = query.data ?? null;
  const loading = query.isLoading;
  const [expanded, setExpanded] = useState(false);
  const truncated = data?.overview
    .slice(0, 168)
    .split(" ")
    .slice(0, -1)
    .join(" ");
  //Seasons
  const { setSeasonSelect, getSeasonSelect } = useSeasonStore();
  const saved = getSeasonSelect(id);
  const filtered =
    data?.seasons?.filter(
      (meow) => meow.name !== "Specials" && meow.episode_count
    ) ?? [];
  //RECO
  const recommendations = data?.recommendations.results ?? [];
  const logo =
    data?.images.logos.find(
      (meow) => meow.iso_639_1 === "en" && meow.vote_average < 5
    )?.file_path || data?.images.logos[0]?.file_path;
  const credits = data?.credits.cast;
  const trailerKey = data?.videos.results.find(
    (meow) => meow.type === "Trailer"
  )?.key;
  const { isReady, isMuted, isPlaying, handleUnmute, handlePlay } =
    useYouTubePlayer(trailerKey ?? null);

  useEffect(() => {
    if (!saved && data?.seasons?.length) {
      const last = filtered[filtered.length - 1];
      setSeasonSelect(id, {
        name: last.name,
        number: last.season_number,
      });
    }
  }, [data]);

  //AUTO SCROLL
  const episodesRef = useRef<HTMLDivElement>(null);
  const similarRef = useRef<HTMLDivElement>(null);
  const setPlay = usePlayStore((s) => s.setPlay);

  return (
    <Drawer
      // direction="right"
      open={open}
      onOpenChange={(value) => handleCloseDrawer(value)}
    >
      <DrawerContent className=" outline-none p-1">
        <DrawerHeader className="sr-only">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>

        {loading ? (
          <MediaSkeleton />
        ) : data === null ? (
          <div className="flex flex-col items-center gap-5">
            <span className="p-3 bg-card border-2 rounded-full">
              <TextSearch />
            </span>
            <div className="text-center">
              <p className="">No data found</p>
            </div>
          </div>
        ) : (
          <div className="relative bg-background z-60 overflow-auto custom-scrollbar rounded-t-md">
            <div className="absolute inset-0 max-h-[60dvh] overflow-hidden">
              <div
                id={`yt-player-${trailerKey}`}
                className="absolute inset-0 w-full h-full scale-140"
              />

              {(!isPlaying || !isReady) && (
                <Image
                  src={
                    data?.backdrop_path
                      ? `${IMAGE_BASE_URL}/w1280${data.backdrop_path}`
                      : "https://github.com/shadcn.png"
                  }
                  alt={data.title ?? data.name}
                  fill
                  className="object-cover bg-background"
                  quality={75}
                />
              )}

              <div className="absolute inset-0 bottom-0 bg-linear-to-t from-background via-transparent to-background/90" />
              <div className="absolute inset-0 bottom-0 bg-linear-to-tl from-background/20 via-transparent  to-background/30" />
              <div className="absolute inset-0 bottom-0 bg-linear-to-tr from-background via-transparent  to-transparent" />
              {data?.genres && (
                <div className="absolute top-8 lg:left-8 left-2 flex lg:gap-6 gap-3 items-center">
                  <Genres genres={data?.genres} />
                </div>
              )}
              {/* <Button
                className="fixed top-6 right-6"
                variant="ghost"
                onClick={() => handleHomeDrawer(false)}
              >
                <Home />
              </Button> */}
              {/* {data.pr (
              <motion.img
                key="backdrop"
                initial={{ opacity: 0, filter: "blur(0px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                src={
                  data?.backdrop_path
                    ? `${IMAGE_BASE_URL}/original${data.backdrop_path}`
                    : "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200"
                }
                alt=""
              />
            )} */}
              {isReady && (
                <motion.div
                  initial={{ x: 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 80, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut", delay: 1 }}
                  className="flex absolute top-3/4 right-0 z-10 border-l-2 py-3 bg-background/50 border-red-700 pl-4 pr-8 gap-4"
                >
                  <button onClick={handlePlay}>
                    {isPlaying ? (
                      <Video className="size-5" />
                    ) : (
                      <VideoOff className="size-5" />
                    )}
                  </button>
                  <p className="text-muted-foreground">|</p>
                  <button onClick={handleUnmute}>
                    {isMuted ? (
                      <VolumeX className="size-5" />
                    ) : (
                      <Volume2 className="size-5" />
                    )}
                  </button>
                </motion.div>
              )}
            </div>

            <div className="relative lg:p-8 p-2 mt-30 lg:space-y-12 space-y-8">
              <div className="space-y-6">
                {data?.tagline && (
                  <p className="lg:text-lg text-sm font-light text-zinc-300 italic leading-relaxed lg:max-w-2xl max-w-2xs ">
                    {data.tagline}
                  </p>
                )}
                {logo ? (
                  <div className=" lg:max-w-sm max-w-3xs ">
                    <img
                      className="w-full h-full lg:max-h-40 max-h-20 object-left object-contain"
                      src={`${IMAGE_BASE_URL}/w780${logo}}`}
                      alt=""
                    />
                  </div>
                ) : (
                  <h1 className="text-6xl">{data?.title}</h1>
                )}
              </div>
              <div className="flex gap-4 items-center">
                <Button variant="accent" size="xl" asChild>
                  <Link
                    href={`/watch/${media_type}/${id}${
                      isSearching ? `?query=${queryUrl}` : ""
                    }`}
                  >
                    <Play className=" fill-current" /> Play Now
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="rounded-full size-12"
                >
                  <Plus />
                </Button>
                {/* {data.seasons && data.seasons.length !== 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        episodesRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                    >
                      <GalleryVerticalEndIcon /> Episodes
                    </Button>
                  )} */}

                {recommendations.length !== 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      similarRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                  >
                    <Layers3 /> Similar
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div className="h-px w-16 bg-zinc-700 " />
                <div className="flex items-center lg:gap-6 gap-3 text-sm lg:text-base mb-8">
                  {(data?.vote_average ?? 0) > 0 && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="text-3xl font-bold text-red-500">
                          {data?.vote_average.toFixed(1)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          / 10
                        </div>
                      </div>
                      <div className="h-8 w-px bg-white/10"></div>
                    </>
                  )}
                  {(data?.release_date || data?.first_air_date) && (
                    <>
                      <div className="text-muted-foreground">
                        {format(
                          data.release_date ?? data.first_air_date,
                          "yyyy"
                        )}
                      </div>

                      <div className="h-8 w-px bg-white/10"></div>
                    </>
                  )}

                  <div className="text-muted-foreground uppercase">
                    {data?.runtime
                      ? formatRuntime(data.runtime)
                      : data?.number_of_seasons
                      ? `S${data?.number_of_seasons}E${data.number_of_seasons}`
                      : "N/A"}
                  </div>
                </div>
                {data?.overview && (
                  <p
                    className={`lg:text-base text-sm leading-loose text-muted-foreground lg:max-w-2xl`}
                  >
                    {expanded ? (
                      <>
                        {data.overview}{" "}
                        <span
                          className="text-red-500 hover:underline"
                          onClick={() => setExpanded(false)}
                        >
                          see less
                        </span>
                      </>
                    ) : data.overview.length > 200 ? (
                      <>
                        {truncated}{" "}
                        <span
                          className="text-red-500 hover:underline"
                          onClick={() => setExpanded(true)}
                        >
                          ...see more
                        </span>
                      </>
                    ) : (
                      data.overview
                    )}
                  </p>
                )}
              </div>
              {credits && <Credits credits={credits} />}
              {data && media_type === "tv" && (
                <div className="space-y-20" ref={episodesRef}>
                  <SeasonSelectorPoster seasons={filtered} id={id} />
                  <Episodes id={id} />
                </div>
              )}
              <Separator />
              {recommendations.length !== 0 && (
                <div ref={similarRef}>
                  <Recommendations recommendations={recommendations} />
                </div>
              )}
            </div>
          </div>
        )}

        <ScrollToTop />
      </DrawerContent>
    </Drawer>
  );
}
