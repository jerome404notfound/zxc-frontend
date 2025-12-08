import {
  IconCategoryPlus,
  IconFolderCode,
  IconGhost2Filled,
  IconMovie,
  IconRefresh,
  IconTransfer,
  IconTransferVertical,
} from "@tabler/icons-react";
import {
  ArrowUpRightIcon,
  Check,
  ChevronsUpDown,
  Film,
  Minus,
  Plus,
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
  movieGenres,
  productionCompanies,
  tvGenres,
  tvNetworks,
} from "@/constants/filter";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [toValue, settoValue] = useState<number | null>(null);
  const [fromValue, setfromValue] = useState<number | null>(null);
  const [yearType, setYearType] = useState(true);
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

  const query = useGetReusableData<ApiTypes>({
    endpoint:
      selectedGenres.size === 0 &&
      selectedNetwork.size === 0 &&
      selectedYear === null &&
      toValue === null &&
      fromValue === null
        ? `trending/${selectedMedia}/day`
        : `discover/${selectedMedia}`,
    params: {
      page: 1,
      sort_by: "popularity.desc",

      ...(selectedGenres.size > 0 && {
        with_genres: [...selectedGenres].join(","),
      }),

      ...(yearType === false && selectedYear != null
        ? selectedMedia === "tv"
          ? {
              "first_air_date.gte": `${selectedYear}-01-01`,
              "first_air_date.lte": `${selectedYear}-12-31`,
            }
          : {
              "primary_release_date.gte": `${selectedYear}-01-01`,
              "primary_release_date.lte": `${selectedYear}-12-31`,
            }
        : yearType === true && fromValue != null && toValue != null
        ? selectedMedia === "tv"
          ? {
              "first_air_date.gte": `${toValue}-01-01`,
              "first_air_date.lte": `${fromValue}-12-31`,
            }
          : {
              "primary_release_date.gte": `${toValue}-01-01`,
              "primary_release_date.lte": `${fromValue}-12-31`,
            }
        : {}), // default empty object if no year filter

      ...(selectedNetwork.size > 0 &&
        (selectedMedia === "tv"
          ? { with_networks: [...selectedNetwork].join(",") }
          : { with_companies: [...selectedNetwork].join(",") })),
    },
  });

  useEffect(() => {
    setSelectedGenres(new Set());
    setSelectedNetwork(new Set());
    setSelectedYear(null);
    settoValue(null);
    setfromValue(null);
  }, [selectedMedia]);

  const years = Array.from(
    { length: new Date().getFullYear() - 1999 + 1 },
    (_, i) => 1999 + i
  );

  const safeToYear = toValue ? toValue : 1999;
  const safeFromYear = fromValue ? fromValue : 1999;
  const fromYear = Array.from(
    { length: new Date().getFullYear() - safeToYear + 1 },
    (_, i) => safeToYear + i
  );

  useEffect(() => {
    if (safeFromYear < safeToYear && fromValue !== null) {
      setfromValue(safeToYear);
    }
  }, [toValue]);
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
                    Advanced Filters
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
                      <Tv /> TV Shows
                    </Button>
                  </div>
                </div>

                <div className="p-4 flex items-center gap-3">
                  <div className="flex-1 h-px bg-border"></div>
                  <h1 className="text-sm text-muted-foreground">
                    {selectedMedia === "all"
                      ? "Select media type first to unlock"
                      : selectedMedia === "movie"
                      ? "Movie filters"
                      : "TV Show filters"}
                  </h1>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                <div className="p-4 space-y-3">
                  <h1 className="font-medium">
                    Genres{" "}
                    <span className="text-muted-foreground  text-sm font-normal">
                      (Multi Select Support)
                    </span>
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    {(selectedMedia === "tv" ? tvGenres : movieGenres)
                      .slice(expandGenre ? 0 : 6)
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
                      size="xl"
                      onClick={() => setExpandGenre((prev) => !prev)}
                    >
                      {expandGenre ? <Minus /> : <Plus />}
                    </Button>
                  </div>
                </div>

                <div className=" p-4 space-y-3">
                  <h1 className="font-medium">Companies</h1>
                  <div className="flex flex-wrap gap-2">
                    {(selectedMedia === "tv"
                      ? tvNetworks
                      : productionCompanies
                    ).map((network) => (
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
                      <IconTransfer />
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
                      />
                      <Separator className="w-10!" />
                      <CommandComponent
                        value={fromValue}
                        setValue={setfromValue}
                        years={fromYear}
                        placeholder="From"
                        disabled={selectedMedia === "all"}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(
                        { length: new Date().getFullYear() - 1999 + 1 },
                        (_, i) => 1999 + i
                      )
                        .slice(expandYear ? 0 : 11)
                        .map((year) => (
                          <Button
                            key={year}
                            size="xl"
                            className="flex-1 font-mono"
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
                        size="xl"
                        variant="secondary"
                      >
                        {expandYear ? <Minus /> : <Plus />}
                      </Button>
                    </div>
                  )}
                </div>
                {/* <div className=" p-4 space-y-3">
              <h1 className="font-medium">Select Keyword</h1>
              <div className="flex flex-wrap gap-2">
                {keywordTopics.map((meow, idx) => (
                  <Button
                    variant="secondary"
                    className="flex-1"
                    key={idx}
                    size="xl"
                  >
                    {meow.label}
                  </Button>
                ))}
              </div>
            </div> */}
                {/* <DrawerFooter>
                  <Button>Reset</Button>
                </DrawerFooter> */}
              </DrawerContent>
            </Drawer>
            <Button variant="secondary" size="xl">
              <IconRefresh />
              Reset Filter
            </Button>
          </div>
        </EmptyContent>
      </Empty>

      {/* <div className="flex justify-end gap-5 mb-3">
        <Button variant="secondary">
          <IconCategoryPlus />
          Select Filter
        </Button>
      </div> */}

      <div className="grid grid-cols-7 gap-4">
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
}: {
  // open: boolean;
  // setOpen: (open: boolean) => void;
  value: number | null;
  years: number[];
  setValue: (value: number | null) => void;
  placeholder: string;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="flex-1">
        <Button
          variant="secondary"
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
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Year..." className="h-9" />
          <CommandList>
            <CommandEmpty>No year found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setValue(null);
                  setOpen(false);
                }}
              >
                Unset
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
                  {year}
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
