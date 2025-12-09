// "use client";

// import useGetReusableData from "@/api/get-reusable-data";
// import { ApiTypes } from "@/types/api-types";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import MovieCard from "../../../movie-card";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";

// export default function BrowsePage() {
//   const searchParams = useSearchParams();

//   const router = useRouter();

//   const params: Record<string, string | number> = {};
//   searchParams.forEach((value, key) => {
//     if (key !== "endpoint" && key !== "title") {
//       params[key] = value;
//     }
//   });
//   const endpoint = searchParams.get("endpoint") || "movie/popular";
//   const title = searchParams.get("title");
//   const query = useGetReusableData<ApiTypes>({
//     endpoint: `${endpoint}`,
//     params: params,
//   });
//   const data = query.data?.results;

//   return (
//     <div className="w-[90%] mx-auto  py-20">
//       <div className="p-1 mb-3">
//         <h2 className="text-3xl font-bold  montserrat tracking-wide mb-1">
//           {title}
//           {/* <span className="italic  font-serif text-red-700 ml-2">{label}</span> */}
//         </h2>
//         <p
//           onClick={() => router.back()}
//           className="cursor-pointer flex items-center gap-1.5 text-muted-foreground hover:underline transition duration-150  w-fit"
//         >
//           <ArrowLeft className="size-4" /> Go back
//         </p>
//       </div>
//       <div className="grid grid-cols-7 gap-4">
//         {data?.map((meow) => (
//           <MovieCard
//             key={meow.id}
//             movie={meow}
//             media_type={endpoint.startsWith("tv") ? "tv" : "movie"}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useGetReusableData from "@/api/get-reusable-data";
import { ApiTypes } from "@/types/api-types";
import { ArrowLeft } from "lucide-react";
import MovieCard from "@/app/movie-card";
export default function BrowseModal() {
  const searchParams = useSearchParams();
  const { params } = useParams();
  const media_type = String(params?.[0]);
  const router = useRouter();

  const param: Record<string, string | number> = {};
  searchParams.forEach((value, key) => {
    if (key !== "title") {
      param[key] = value;
    }
  });
  const title = searchParams.get("title");
  const query = useGetReusableData<ApiTypes>({
    endpoint: `discover/${media_type}`,
    params: param,
  });
  const data = query.data?.results;
  const [open, setOpen] = useState(true);
  const handleCloseDrawer = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setTimeout(() => router.back(), 300);
    }
  };
  return (
    <Dialog open={open} onOpenChange={(value) => handleCloseDrawer(value)}>
      <DialogContent className="" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Are you absolutely sure?</DialogTitle>{" "}
        </DialogHeader>
        <div className="w-[90%] mx-auto  py-20">
          <p
            onClick={() => router.back()}
            className="cursor-pointer flex items-center gap-1.5 text-muted-foreground hover:underline transition duration-150  w-fit"
          >
            <ArrowLeft className="size-4" /> Go back
          </p>
          <h1 className=" uppercase  mask-[linear-gradient(to_bottom,black_0%,transparent_85%)] lg:text-7xl text-6xl font-bold text-red-700  translate-y-3 font-sans tracking-tighter pointer-events-none ">
            {title}
          </h1>

          <div className="grid grid-cols-7 gap-4">
            {data?.map((meow) => (
              <MovieCard key={meow.id} movie={meow} media_type={media_type} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
