import {
  IconCarambolaFilled,
  IconCategoryPlus,
  IconFilterPlus,
  IconFlame,
  IconFlameFilled,
  IconFolderCode,
  IconGhost2Filled,
  IconMovie,
  IconRefresh,
  IconTransfer,
  IconTransferVertical,
} from "@tabler/icons-react";
import {
  ArrowUpRightIcon,
  Calendar,
  Check,
  ChevronsUpDown,
  Film,
  Minus,
  Plus,
  TextSearch,
  Tv,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import useGetReusableData from "@/api/get-reusable-data";
import { ApiTypes } from "@/types/api-types";
import MovieCard from "../movie-card";
import {
  keywordTopics,
  movieGenres,
  productionCompanies,
  tvGenres,
  tvNetworks,
} from "@/constants/filter";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import TitleReusable from "@/components/ui/title";
export default function Discover() {
  const [selectedMedia, setSelectedMedia] = useState<"all" | "movie" | "tv">(
    "all"
  );
  const [selectedGenres, setSelectedGenres] = useState<Set<number>>(new Set());
  const [selectedNetwork, setSelectedNetwork] = useState<Set<number>>(
    new Set()
  );
  const [expandYear, setExpandYear] = useState(false);
  const [expandGenre, setExpandGenre] = useState(false);
  const [expandCompanies, setExpandCompanies] = useState(false);
  const [expandLanguage, setExpandLanguage] = useState(false);
  const [expandKeyword, setExpandKeyword] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [toValue, settoValue] = useState<number | null>(null);
  const [fromValue, setfromValue] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxRating, setMaxRating] = useState<number | null>(null);
  const [yearType, setYearType] = useState(true);
  const CURRENT_YEAR = new Date().getFullYear();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(
    new Set()
  );
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleNetwork = (id: number) => {
    setSelectedNetwork((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  const toggleKeywords = (lang: string) => {
    setSelectedKeywords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lang)) newSet.delete(lang);
      else newSet.add(lang);
      return newSet;
    });
  };
  const isTrending =
    selectedGenres.size === 0 &&
    selectedNetwork.size === 0 &&
    !selectedYear &&
    !toValue &&
    !fromValue &&
    !minRating &&
    !maxRating &&
    !selectedLanguage &&
    selectedKeywords.size === 0;
  const query = useGetReusableData<ApiTypes>({
    endpoint: isTrending
      ? `trending/${selectedMedia}/day`
      : `discover/${selectedMedia}`,
    params: {
      page: 1,
      sort_by: "popularity.desc",

      ...(selectedGenres.size > 0 && {
        with_genres: [...selectedGenres].join(","),
      }),

      ...(!yearType &&
        selectedYear != null &&
        (selectedMedia === "tv"
          ? {
              "first_air_date.gte": `${selectedYear}-01-01`,
              "first_air_date.lte": `${selectedYear}-12-31`,
            }
          : {
              "primary_release_date.gte": `${selectedYear}-01-01`,
              "primary_release_date.lte": `${selectedYear}-12-31`,
            })),

      ...(yearType === true &&
        toValue != null &&
        (selectedMedia === "tv"
          ? { "first_air_date.gte": `${toValue}-01-01` }
          : { "primary_release_date.gte": `${toValue}-01-01` })),

      ...(yearType === true &&
        fromValue != null &&
        (selectedMedia === "tv"
          ? { "first_air_date.lte": `${fromValue}-12-31` }
          : { "primary_release_date.lte": `${fromValue}-12-31` })),

      ...(minRating != null && {
        "vote_average.gte": minRating,
      }),

      ...(maxRating != null && {
        "vote_average.lte": maxRating,
      }),

      ...(selectedNetwork.size > 0 &&
        (selectedMedia === "tv"
          ? { with_networks: [...selectedNetwork].join(",") }
          : { with_companies: [...selectedNetwork].join(",") })),

      ...(selectedLanguage && { with_original_language: selectedLanguage }),
      ...(selectedSort && { sort_by: selectedSort }),
      ...(selectedKeywords.size > 0 && {
        with_keywords: [...selectedKeywords].join(","),
      }),
    },
  });

  useEffect(() => {
    setSelectedGenres(new Set());
    setSelectedNetwork(new Set());
    setSelectedKeywords(new Set());
    setSelectedYear(null);
    setSelectedLanguage(null);
    setSelectedSort(null);
    settoValue(null);
    setfromValue(null);
  }, [selectedMedia]);

  const resetFilter = () => {
    setSelectedMedia("all");
    setSelectedGenres(new Set());
    setSelectedNetwork(new Set());
    setSelectedKeywords(new Set());
    setSelectedYear(null);
    setSelectedLanguage(null);
    setSelectedSort(null);
    settoValue(null);
    setfromValue(null);
  };
  const years = Array.from(
    { length: CURRENT_YEAR - 1999 + 1 },
    (_, i) => 1999 + i
  );

  const safeToYear = toValue ? toValue : 1999;
  const safeFromYear = fromValue ? fromValue : 1999;
  const fromYear = Array.from(
    { length: CURRENT_YEAR - safeToYear + 1 },
    (_, i) => safeToYear + i
  );

  const rating = Array.from({ length: 10 }, (_, i) => i + 1);
  const safeMinRating = minRating ? minRating : 1;
  const safeMaxRating = maxRating ? maxRating : 1;
  const dynamicMaxRating = Array.from(
    { length: 10 - safeMinRating + 1 },
    (_, i) => i + safeMinRating
  );
  useEffect(() => {
    if (safeFromYear < safeToYear && fromValue !== null) {
      setfromValue(safeToYear);
    }
  }, [toValue]);
  useEffect(() => {
    if (safeMaxRating < safeMinRating && maxRating !== null) {
      setMaxRating(safeMinRating);
    }
  }, [minRating]);

  const selectedGenreLabel = movieGenres.find((genre) =>
    selectedGenres.has(genre.id)
  )?.name;
  const selectedGenreLabels = movieGenres
    .filter((genre) => selectedGenres.has(genre.id))
    .map((g) => g.name)
    .join(", ");
  return (
    <div className="py-20  space-y-12">
      <Empty className="">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconGhost2Filled />
          </EmptyMedia>
          <EmptyTitle>No Selected Filter</EmptyTitle>
          <EmptyDescription>
            Results will show here once you selected filters.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2 items-center">
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <Button variant="secondary" size="xl">
                  <IconCategoryPlus />
                  Select Filter
                </Button>
              </DrawerTrigger>
              <DrawerContent className="">
                <DrawerHeader>
                  <DrawerTitle className="text-lg tracking-wide">
                    <TitleReusable
                      title="Advanced Filters"
                      description=""
                      Icon={IconFilterPlus}
                      textColor="text-red-700/70"
                    />
                  </DrawerTitle>
                  <DrawerDescription>
                    Customize your search using genres, years, networks, and
                    more.
                  </DrawerDescription>
                </DrawerHeader>

                <div className="p-4 space-y-3">
                  <h1 className="font-medium">Select Media Type</h1>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => setSelectedMedia("all")}
                      variant={
                        selectedMedia === "all" ? "destructive" : "secondary"
                      }
                      className="flex-1"
                      size="xl"
                    >
                      <IconFlameFilled /> Trending
                    </Button>
                    <Button
                      onClick={() =>
                        setSelectedMedia((prev) =>
                          prev === "movie" ? "all" : "movie"
                        )
                      }
                      variant={
                        selectedMedia === "movie" ? "destructive" : "secondary"
                      }
                      className="flex-1"
                      size="xl"
                    >
                      <Film /> Movie
                    </Button>

                    <Button
                      onClick={() =>
                        setSelectedMedia((prev) =>
                          prev === "tv" ? "all" : "tv"
                        )
                      }
                      variant={
                        selectedMedia === "tv" ? "destructive" : "secondary"
                      }
                      className="flex-1"
                      size="xl"
                    >
                      <Tv /> TV Show
                    </Button>
                  </div>
                </div>

                <div className="p-4 flex items-center gap-3">
                  <div className="flex-1 h-px bg-border"></div>
                  <h1 className="text-sm text-muted-foreground">
                    {selectedMedia === "all"
                      ? "Select a media type to enable filters"
                      : selectedMedia === "movie"
                      ? "Movie Filters"
                      : "TV Show Filters"}
                  </h1>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                {/* <div className=" p-4 space-y-3">
                  <h1 className="font-medium">Sort</h1>
                  <div className="flex flex-wrap gap-2">
                    <Popover>
                      <PopoverTrigger asChild className="flex-1">
                        <Button
                          className="w-full"
                          size="xl"
                          disabled={selectedMedia === "all"}
                          variant="secondary"
                        >
                          Popularity
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="flex gap-2 p-1 border-0">
                        <Button
                          className="flex-1"
                          size="xl"
                          disabled={selectedMedia === "all"}
                          variant="secondary"
                        >
                          Asc
                        </Button>
                        <Button
                          className="flex-1"
                          size="xl"
                          disabled={selectedMedia === "all"}
                          variant="secondary"
                        >
                          Desc
                        </Button>
                      </PopoverContent>
                    </Popover>

                    <Button
                      className="flex-1"
                      size="xl"
                      disabled={selectedMedia === "all"}
                      variant="secondary"
                    >
                      Release Date
                    </Button>
                    <Button
                      className="flex-1"
                      size="xl"
                      disabled={selectedMedia === "all"}
                      variant="secondary"
                    >
                      Vote Average
                    </Button>
                  </div>
                </div> */}

                <div className="p-4 space-y-3">
                  <h1 className="font-medium">
                    Genres{" "}
                    <span className="text-red-500">
                      {selectedGenres.size === 0
                        ? ""
                        : `(${selectedGenres.size})`}
                    </span>{" "}
                    <span className="text-muted-foreground  text-sm font-normal">
                      (Multi Select Support)
                    </span>
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    {(selectedMedia === "tv" ? tvGenres : movieGenres)
                      .slice(
                        0,
                        expandGenre
                          ? (selectedMedia === "tv" ? tvGenres : movieGenres)
                              .length
                          : 7
                      )
                      .map((genre) => (
                        <Button
                          key={genre.id}
                          size="xl"
                          className="flex-1"
                          disabled={selectedMedia === "all"}
                          variant={
                            selectedGenres.has(genre.id)
                              ? "destructive"
                              : "secondary"
                          }
                          onClick={() => toggleGenre(genre.id)}
                        >
                          {genre.name}
                        </Button>
                      ))}
                    <Button
                      variant="secondary"
                      size="icon-lg"
                      onClick={() => setExpandGenre((prev) => !prev)}
                    >
                      {expandGenre ? <Minus /> : <Plus />}
                    </Button>
                  </div>
                </div>
                <div className=" p-4 space-y-3">
                  <h1 className="font-medium">
                    Keywords{" "}
                    <span className="text-red-500">
                      {selectedKeywords.size === 0
                        ? ""
                        : `(${selectedKeywords.size})`}
                    </span>
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    {keywordTopics
                      .slice(0, expandKeyword ? keywordTopics.length : 6)
                      .map((meow) => (
                        <Button
                          variant={
                            selectedKeywords.has(meow.value)
                              ? "destructive"
                              : "secondary"
                          }
                          className="flex-1"
                          key={meow.value}
                          size="xl"
                          onClick={() => toggleKeywords(meow.value)}
                          disabled={selectedMedia === "all"}
                        >
                          {meow.label}
                        </Button>
                      ))}
                    <Button
                      variant="secondary"
                      size="icon-lg"
                      onClick={() => setExpandKeyword((prev) => !prev)}
                    >
                      {expandKeyword ? <Minus /> : <Plus />}
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h1 className="font-medium flex gap-3 items-end justify-between">
                    {yearType ? " Year Range" : "Released Year"}
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setYearType((prev) => !prev)}
                    >
                      {yearType ? <Calendar /> : <IconTransfer />}
                    </Button>
                  </h1>
                  {yearType ? (
                    <div className="flex gap-2 items-center">
                      <CommandComponent
                        value={toValue}
                        setValue={settoValue}
                        years={years}
                        placeholder="To"
                        disabled={selectedMedia === "all"}
                        label="year"
                      />
                      <Separator className="w-10!" />
                      <CommandComponent
                        value={fromValue}
                        setValue={setfromValue}
                        years={fromYear}
                        placeholder="From"
                        disabled={selectedMedia === "all"}
                        label="year"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(
                        { length: CURRENT_YEAR - 1999 + 1 },
                        (_, i) => 1999 + i
                      )
                        .slice(expandYear ? 0 : 20)
                        .map((year) => (
                          <Button
                            key={year}
                            size="xl"
                            className="flex-1 tracking-wide"
                            disabled={selectedMedia === "all"}
                            // use selectedYear to determine variant
                            variant={
                              selectedYear === year
                                ? "destructive"
                                : "secondary"
                            }
                            onClick={
                              () =>
                                setSelectedYear((prev) =>
                                  prev === year ? null : year
                                ) // toggle
                            }
                          >
                            {year}
                          </Button>
                        ))}
                      <Button
                        onClick={() => setExpandYear((prev) => !prev)}
                        size="icon-lg"
                        variant="secondary"
                      >
                        {expandYear ? <Minus /> : <Plus />}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <h1 className="font-medium flex gap-3 items-end justify-between">
                    Rating Range
                  </h1>
                  <div className="flex gap-2 items-center">
                    <CommandComponent
                      value={minRating}
                      setValue={setMinRating}
                      years={rating}
                      placeholder="Min"
                      disabled={selectedMedia === "all"}
                      label="rating"
                    />
                    <Separator className="w-10!" />
                    <CommandComponent
                      value={maxRating}
                      setValue={setMaxRating}
                      years={dynamicMaxRating}
                      placeholder="Max"
                      disabled={selectedMedia === "all"}
                      label="rating"
                    />
                  </div>
                </div>
                <div className=" p-4 space-y-3">
                  <h1 className="font-medium">
                    Companies{" "}
                    <span className="text-red-500">
                      {selectedNetwork.size === 0
                        ? ""
                        : `(${selectedNetwork.size})`}
                    </span>
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    {(selectedMedia === "tv" ? tvNetworks : productionCompanies)
                      .slice(
                        0,
                        expandCompanies
                          ? (selectedMedia === "tv"
                              ? tvNetworks
                              : productionCompanies
                            ).length
                          : 5
                      )
                      .map((network) => (
                        <Button
                          variant={
                            selectedNetwork.has(network.id)
                              ? "destructive"
                              : "secondary"
                          }
                          className="flex-1"
                          key={network.id}
                          size="xl"
                          disabled={selectedMedia === "all"}
                          onClick={() => toggleNetwork(network.id)}
                        >
                          {network.name}
                        </Button>
                      ))}
                    <Button
                      onClick={() => setExpandCompanies((prev) => !prev)}
                      size="icon-lg"
                      variant="secondary"
                    >
                      {expandCompanies ? <Minus /> : <Plus />}
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h1 className="font-medium ">
                    Languages{" "}
                    <span className="text-red-500">
                      {!selectedLanguage ? "" : `(1)`}
                    </span>
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    {languages
                      .slice(0, expandLanguage ? languages.length : 7)
                      .map((lang) => (
                        <Button
                          key={lang.code}
                          size="xl"
                          variant={
                            selectedLanguage === lang.code
                              ? "destructive"
                              : "secondary"
                          }
                          onClick={() =>
                            setSelectedLanguage((prev) =>
                              prev === lang.code ? null : lang.code
                            )
                          }
                          disabled={selectedMedia === "all"}
                          className="flex-1"
                        >
                          {lang.name}
                        </Button>
                      ))}
                    <Button
                      variant="secondary"
                      size="icon-lg"
                      onClick={() => setExpandLanguage((prev) => !prev)}
                    >
                      {expandLanguage ? <Minus /> : <Plus />}
                    </Button>
                  </div>
                </div>

                {/* <DrawerFooter>
                  <Button>Reset</Button>
                </DrawerFooter> */}
              </DrawerContent>
            </Drawer>

            {!isTrending && (
              <Button variant="secondary" size="xl" onClick={resetFilter}>
                <IconRefresh />
                Reset Filter
              </Button>
            )}
          </div>
        </EmptyContent>
      </Empty>

      {/* <div className="flex justify-end gap-5 mb-3">
        <Button variant="secondary">
          <IconCategoryPlus />
          Select Filter
        </Button>
      </div> */}
      <h1 className="sectionName uppercase">
        {selectedGenres.size === 0 ? "DISCOVER" : selectedGenreLabel}
      </h1>
      <div className="grid lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 lg:gap-4 gap-2">
        {query.data?.results.map((meow) => (
          <MovieCard key={meow.id} movie={meow} media_type="movie" />
        ))}
      </div>
    </div>
  );
}

function CommandComponent({
  // open,
  // setOpen,
  value,
  years,
  setValue,
  placeholder,
  disabled,
  label,
}: {
  // open: boolean;
  // setOpen: (open: boolean) => void;
  value: number | null;
  years: number[];
  setValue: (value: number | null) => void;
  placeholder: string;
  disabled: boolean;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="flex-1">
        <Button
          variant={!value ? "secondary" : "destructive"}
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          size="xl"
        >
          {value !== null ? value : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${label}...`}
            className="h-9 capitalize"
          />
          <CommandList>
            <CommandEmpty>{`No ${label} found.`}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setValue(null);
                  setOpen(false);
                }}
              >
                Reset...
              </CommandItem>
              {years.map((year) => (
                <CommandItem
                  key={year}
                  value={String(year)}
                  onSelect={() => {
                    setValue(year);
                    setOpen(false);
                  }}
                >
                  {year}{" "}
                  {label === "rating" && <IconCarambolaFilled color="yellow" />}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === year ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
const languages = [
  { code: "en", name: "English" },
  { code: "tl", name: "Filipino" },
  { code: "ko", name: "Korean" },
  { code: "ja", name: "Japanese" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "zh", name: "Chinese" },
  { code: "hi", name: "Hindi" },
  { code: "ru", name: "Russian" },
  { code: "pt", name: "Portuguese" },
  { code: "sv", name: "Swedish" },
  { code: "nl", name: "Dutch" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "da", name: "Danish" },
  { code: "no", name: "Norwegian" },
  { code: "fi", name: "Finnish" },
  { code: "he", name: "Hebrew" },
  { code: "ar", name: "Arabic" },
];
