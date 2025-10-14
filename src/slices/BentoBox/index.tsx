import { FC } from "react";
import { asText, Content } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import Bounded from "@/components/Bounded";
import { PrismicNextImage } from "@prismicio/next";
import clsx from "clsx";
import FadeIn from "@/components/FadeIn";

export type BentoBoxProps = SliceComponentProps<Content.BentoBoxSlice>;

const BentoBox: FC<BentoBoxProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <FadeIn>
        <h2
          id="features"
          className="mb-8 scroll-pt-16 font-bold-slanted text-6xl uppercase md:text-8xl"
        >
          <PrismicText field={slice.primary.heading} />
        </h2>
      </FadeIn>

      <FadeIn targetChildren className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {slice.primary.items.map((item) => (
          <BentoBoxItem key={asText(item.text)} item={item} />
        ))}
      </FadeIn>
    </Bounded>
  );
};

export default BentoBox;

type BentoBoxItemProps = {
  item: Content.BentoBoxSliceDefaultPrimaryItemsItem;
};
function BentoBoxItem({ item }: BentoBoxItemProps) {
  const { image, size, text } = item;

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-3xl",
        size === "Small" && "md:col-span-2",
        size === "Medium" && "md:col-span-3",
        size === "Large" && "md:col-span-4",
      )}
    >
      <PrismicNextImage
        field={image}
        className="h-full w-full object-cover"
        quality={96}
        width={700}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-black" />
      <div className="absolute bottom-0 left-0 max-w-xl p-6 text-xl text-balance text-white ">
        <PrismicRichText field={text} />
      </div>
    </div>
  );
}
