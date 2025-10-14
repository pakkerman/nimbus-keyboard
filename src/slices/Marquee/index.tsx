import { FC, Fragment } from "react";
import clsx from "clsx";

import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import LogoMark from "@/components/LogoMark";

export type MarqueProps = SliceComponentProps<Content.MarqueSlice>;

const Marque: FC<MarqueProps> = ({ slice }) => {
  const MarqueeContent = () => {
    return (
      <div className="flex items-center bg-gray-200 py-4 whitespace-nowrap md:py-8 lg:py-12">
        {slice.primary.phrases.map((item, idx) => (
          <Fragment key={idx}>
            <div
              className={clsx(
                "px-4 font-bold-slanted text-2xl text-gray-400/80 uppercase [text-box:trim-both_cap_alphabetic]",
                "md:text-6xl md:px-6",
                "lg:text-8xl lg:px-8",
              )}
            >
              {item.text}
            </div>
            <LogoMark className="size-6 md:size-12 lg:size-20" />
          </Fragment>
        ))}
      </div>
    );
  };
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div
        className="relative flex w-full items-center overflow-hidden select-none"
        aria-hidden="true"
        role="presentation"
      >
        <div className="relative flex items-center whitespace-nowrap">
          <div
            className={clsx(
              "marquee-track animate-marquee flex",
              slice.primary.direction === "Right" &&
                "[animation-direction:reverse]",
            )}
          >
            {/* content to duplicate */}
            <MarqueeContent />
            <MarqueeContent />
            <MarqueeContent />
            <MarqueeContent />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marque;
