import {
  IconCategoryPlus,
  IconFolderCode,
  IconGhost2Filled,
  IconMovie,
} from "@tabler/icons-react";
import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
export default function Discover() {
  const query = useGetReusableData<ApiTypes>({
    endpoint: "discover/movie",
    params: { page: 1, sort_by: "popularity.desc" },
  });
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
          <Button variant="outline" size="xl">
            <IconCategoryPlus />
            Select Filter
          </Button>
        </EmptyContent>
      </Empty>

      {/* <div className="flex justify-end gap-5 mb-3">
        <Button variant="outline">
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
