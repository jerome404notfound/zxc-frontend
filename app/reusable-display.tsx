import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
import MovieCard from "./movie-card";
import useGetReusableData from "@/api/get-reusable-data";
import { ApiTypes, ReusablePropTypes } from "@/types/api-types";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ReusableSwiper({
  endpoint,
  params,
  title,
  label,
  type,
}: ReusablePropTypes) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
    rootMargin: "300px 0px 0px 0px",
  });

  const query = useGetReusableData<ApiTypes>({
    endpoint,
    params,
    isVisible: inView,
  });

  const data = query.data?.results ?? [];
  const filtered = data.filter((filter) => filter.vote_average > 3);
  return (
    <div className=" mx-auto  relative py-25  border-b" ref={ref}>
      <div className="p-1 mb-3">
        <h2 className="text-2xl font-extralight  montserrat tracking-wide mb-1">
          {title}
          <span className="italic  font-serif text-red-700 ml-2">{label}</span>
        </h2>
        <Link
          href={{
            pathname: endpoint,
            query: {
              title,
              ...params,
            },
          }}
          scroll={false}
          prefetch={true}
          className="flex items-center gap-2 text-muted-foreground hover:underline transition duration-150  w-fit"
        >
          See more <ArrowRight className="size-4" />
        </Link>
      </div>

      {!inView ? null : query.isLoading ? (
        <div className="grid grid-cols-7 gap-5">
          <Skeleton className="aspect-2/3" />
          <Skeleton className="aspect-2/3" />
          <Skeleton className="aspect-2/3" />
          <Skeleton className="aspect-2/3" />
          <Skeleton className="aspect-2/3" />
          <Skeleton className="aspect-2/3" />
          <Skeleton className="aspect-2/3" />
        </div>
      ) : query.data?.results.length === 0 ? (
        <p className="text-center">No Data.</p>
      ) : (
        <Swiper
          spaceBetween={20}
          navigation={true}
          keyboard={{ enabled: true }}
          scrollbar={{
            el: ".swiper-scrollbar",
            hide: false,
          }}
          slidesPerGroup={7}
          slidesPerView={7}
          modules={[Navigation, Pagination, Keyboard, Scrollbar]}
          breakpoints={{
            0: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
            1140: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 7,
              spaceBetween: 20,
            },
          }}
        >
          {filtered.map((movie, i) => (
            <SwiperSlide key={movie.id} className="p-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: i * 0.03,
                    duration: 0.3,
                    ease: "easeInOut",
                  },
                }}
              >
                <MovieCard media_type={type} movie={movie} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
