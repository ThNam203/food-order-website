import Image from "next/image";
import { twMerge } from "tailwind-merge";
import FoodRating from "./food_rating";
import { Food } from "@/models/Food";
import { FoodPrice } from "./food_price";
import { IconButton } from "./buttons";
import { cn } from "@/utils/cn";
import { HeartIcon, OutlineHeartIcon } from "./icons";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { showDefaultToast } from "./toast";

export default function MainPageItem({
  food,
  className,
  onClick,
  isFavorite = false,
  onFavoriteChange,
}: {
  food: Food;
  className?: string;
  onClick?: () => void;
  isFavorite?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
}) {
  const [sortedPriceList, setSortedPriceList] = useState<number[]>([]);
  const isLogin = useAppSelector((state) => state.profile.isLogin);

  useEffect(() => {
    const tempSortedPriceList = food.foodSizes
      .map((foodSize) => foodSize.price)
      .sort();
    setSortedPriceList(tempSortedPriceList);
  }, [food]);

  return (
    <div
      className={cn(
        "rounded overflow-hidden shadow-lg bg-[#12192C] bg-opacity-75 p-0",
        className
      )}
    >
      <div className="w-full h-40 overflow-hidden cursor-pointer">
        <div
          className="object-center hover:scale-125 h-40 ease-linear transition-all duration-300"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${food.images[0]})`,
          }}
          onClick={onClick}
        ></div>
      </div>
      <div className="flex flex-col m-2 gap-2">
        <div className="w-full flex flex-row items-center justify-between">
          <span className="font-semibold">{food.name}</span>
          <IconButton
            className={cn("rounded-full ease-linear duration-100")}
            icon={isFavorite ? <HeartIcon /> : <OutlineHeartIcon />}
            onClick={() => {
              if (!isLogin) {
                showDefaultToast("Please login to add your favorite food");
                return;
              }
              if (onFavoriteChange) onFavoriteChange(!isFavorite);
            }}
          />
        </div>
        <FoodPrice
          currency="$"
          defaultPrice={sortedPriceList[0]}
          secondPrice={sortedPriceList[sortedPriceList.length - 1]}
        />
        <div className={cn("flex items-center")}>
          <FoodRating
            rating={food.rating}
            className={cn("mt-2", food.rating === 0 && "hidden")}
          />
          {food.tags.map((tag) => {
            return <Tag key={tag} name={tag} />;
          })}
        </div>
      </div>
    </div>
  );
}

export const Tag = ({ name }: { name: string }) => (
  <span className="hover:cursor-pointer bg-blue-500 text-white rounded-md font-medium hover:bg-blue-400 px-2 py-1  font-hairline text-xs ml-1">
    {name}
  </span>
);
