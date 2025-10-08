import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";

import Bounded from "@/components/Bounded";
import FadeIn from "@/components/FadeIn";

export type SlicePlaygroundProps =
  SliceComponentProps<Content.SlicePlaygroundSlice>;

const SlicePlayground: FC<SlicePlaygroundProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative"
      innerClassName="flex flex-col justify-center"
    >
      <FadeIn>
        <PrismicText field={slice.primary.heading} />
        <PrismicRichText field={slice.primary.description} />
        {slice.primary.switches.map((item) =>
          isFilled.contentRelationship(item.switch) ? (
            <div key={item.switch.id} className="">
              {item.switch.uid}
            </div>
          ) : null,
        )}
      </FadeIn>
    </Bounded>
  );
};

export default SlicePlayground;
