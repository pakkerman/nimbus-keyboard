"use client";

import { FC } from "react";
import clsx from "clsx";

import { Content, isFilled } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";

import { Canvas } from "@react-three/fiber";
import gsap from "gsap";

import Bounded from "@/components/Bounded";
import FadeIn from "@/components/FadeIn";
import Switch, { SOUND_MAP } from "@/components/Switch";
import { Stage } from "@react-three/drei";
import { LuVolume2 } from "react-icons/lu";

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
        <h2
          id="switch-playground"
          className="scroll-pt-6 font-bold-slanted text-6xl uppercase md:text-8xl"
        >
          <PrismicText field={slice.primary.heading} />
        </h2>
        <div className="mb-6 max-w-4xl text-xl text-pretty">
          <PrismicRichText field={slice.primary.description} />
        </div>

        <FadeIn
          targetChildren
          className="grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2"
        >
          {slice.primary.switches.map((item) =>
            isFilled.contentRelationship(item.switch) ? (
              <SharedCanvas key={item.switch.id} color={item.switch} />
            ) : null,
          )}
        </FadeIn>
      </FadeIn>
    </Bounded>
  );
};

export default SlicePlayground;

type SharedCanvasProps = {
  color: Content.SlicePlaygroundSliceDefaultPrimarySwitchesItem["switch"];
};

const SharedCanvas = ({ color }: SharedCanvasProps) => {
  if (!isFilled.contentRelationship(color) || !color.data) return null;

  const colorName = color.uid as "red" | "brown" | "blue" | "black";
  const { color: hexColor, name } = color.data;

  const bgColor = {
    blue: "bg-sky-950",
    red: "bg-red-950",
    brown: "bg-amber-950",
    black: "bg-gray-900",
  }[colorName];

  const handleSound = () => {
    const selectedSound = gsap.utils.random(SOUND_MAP[colorName]);

    const audio = new Audio(selectedSound);
    audio.volume = 0.6;
    audio.play();
  };

  return (
    <div className="group relative min-h-96 overflow-hidden rounded-3xl select-none">
      {/* text button */}
      <button
        onClick={handleSound}
        className="absolute z-10 bottom-0 left-0 flex items-center gap-3 p-6 font-bold-slanted text-4xl text-white uppercase focus:ring-2 focus:ring-white focus:outline-none"
      >
        {name} <LuVolume2 />
      </button>
      {/* canvas */}
      <Canvas camera={{ position: [1.5, 2, 0], fov: 7 }}>
        <Stage
          adjustCamera
          intensity={0.5}
          shadows="contact"
          environment="city"
        >
          <Switch
            rotation={[0, Math.PI / 4, 0]}
            color={colorName}
            hexColor={hexColor || ""}
          />
        </Stage>
      </Canvas>
      <div
        className={clsx(
          "font-black-slanted absolute inset-0 -z-10 grid place-items-center text-8xl uppercase",
          bgColor,
        )}
      >
        <svg className="pointer-events-none h-auto w-full" viewBox="0 0 75 100">
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize={18}
            className="fill-white/30 font-black-slanted uppercase mix-blend-overlay group-hover:fill-white/100 motion-safe:transition-all motion-safe:duration-700"
          >
            {Array.from({ length: 8 }, (_, idx) => (
              <tspan
                key={idx}
                x={`${(idx + 1) * 10}%`}
                dy={idx === 0 ? -40 : 14}
              >
                {colorName}
                {colorName}
                {colorName}
              </tspan>
            ))}
          </text>
        </svg>
      </div>
    </div>
  );
};
