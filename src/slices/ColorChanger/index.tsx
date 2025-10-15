"use client";

import { FC, useCallback, useState } from "react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";

import { Content } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";

import Bounded from "@/components/Bounded";
import Scene from "./Scene";
import { select } from "three/tsl";

export const KEYCAP_TEXTURES = [
  {
    id: "goodwell",
    name: "Goodwell",
    path: "/goodwell_uv.png",
    knobColor: "#E44E21",
  },
  {
    id: "dreamboard",
    name: "Dreamboard",
    path: "/dreamboard_uv.png",
    knobColor: "#E9759F",
  },
  {
    id: "cherrynavy",
    name: "Cherry Navy",
    path: "/cherrynavy_uv.png",
    knobColor: "#F06B7E",
  },
  { id: "kick", name: "Kick", path: "/kick_uv.png", knobColor: "#FD0A0A" },
  {
    id: "oldschool",
    name: "Old School",
    path: "/oldschool_uv.png",
    knobColor: "#B89D82",
  },
  {
    id: "candykeys",
    name: "Candy Keys",
    path: "/candykeys_uv.png",
    knobColor: "#F38785",
  },
];

type KeycapTexture = (typeof KEYCAP_TEXTURES)[number];

export type ColorChangerProps = SliceComponentProps<Content.ColorChangerSlice>;

const ColorChanger: FC<ColorChangerProps> = ({ slice }) => {
  const [selectedTextureId, setSelectedTextureId] = useState(
    KEYCAP_TEXTURES[0].id,
  );
  const [backgroundText, setBackgroundText] = useState(KEYCAP_TEXTURES[0].name);
  const [isAnimating, setIsAnimating] = useState(false);

  function handleTextureSelect(texture: KeycapTexture) {
    if (texture.id === selectedTextureId || isAnimating) return;

    setIsAnimating(true);
    setSelectedTextureId(texture.id);
    setBackgroundText(
      KEYCAP_TEXTURES.find((t) => t.id === texture.id)?.name || "",
    );
  }

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);

    document.querySelector("#keycap-changer")?.scrollIntoView({
      block: "start",
      inline: "nearest",
      behavior: "smooth",
    });
  }, []);

  console.log(selectedTextureId);

  return (
    <section
      id="keycap-changer"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={clsx(
        "relative bg-linear-to-br flex h-[90vh] min-h-dvh flex-col overflow-hidden  text-slate-50",
        selectedTextureId === "goodwell" && "from-[#441306] to-[#E44E21]",
        selectedTextureId === "dreamboard" && "from-[#2F0D68] to-[#8E51FF]",
        selectedTextureId === "cherrynavy" && "from-[#510424] to-[#F06B7E]",
        selectedTextureId === "kick" && "from-[#432004] to-[#F0B100]",
        selectedTextureId === "oldschool" && "from-[#1C1917] to-[#B89D82]",
        selectedTextureId === "candykeys" && "from-[#022F2E] to-[#00BBA7]",
      )}
    >
      {/* SVG background */}
      <svg
        className="pointerEvents-none absolute top-0 left-0 h-auto w-full mix-blend-overlay "
        viewBox="0 0 75 100"
      >
        <text
          fontSize={7}
          textAnchor="middle"
          dominantBaseline={"middle"}
          x="50%"
          y="50%"
          className="fill-white/20 font-black-slanted uppercase group-hover:fill-white/30 motion-safe:transition-all motion-safe:duration-750"
        >
          {Array.from({ length: 20 }, (_, idx) => (
            <tspan x={`${(idx + 1) * 10}`} dy={idx === 0 ? -50 : 6} key={idx}>
              {Array.from({ length: 20 }, () => backgroundText).join(" ")}
            </tspan>
          ))}
        </text>
      </svg>

      <Canvas
        className="grow"
        camera={{ position: [0, 0.5, 0.5], fov: 45, zoom: 1.5 }}
        onCreated={(r) => {
          const width = document.documentElement.clientWidth;
          if (width < 728) r.camera.zoom = 0.9;
          else if (width < 1024) r.camera.zoom = 1.2;
          else r.camera.zoom = 2.5;
        }}
      >
        <Scene
          selectedTextureId={selectedTextureId}
          onAnimationComplete={handleAnimationComplete}
        />
      </Canvas>

      <Bounded
        className="relative shrink-0"
        innerClassName="gap-6 lg:gap-8 flex items-center flex-col lg:flex-row-reverse"
      >
        <div className="flex-col flex gap-4">
          <h2 className="font-bold-slanted -mt-24 lg:-mt-6 text-center text-6xl sm:text-8xl">
            {backgroundText}
          </h2>
          <ul className="mx-auto place-content-center grid row grid-cols-3 gap-2 rounded-2xl bg-white p-4 text-black shadow-lg sm:grid-cols-6">
            {KEYCAP_TEXTURES.map((texture) => (
              <li key={texture.id}>
                <button
                  onClick={() => handleTextureSelect(texture)}
                  disabled={isAnimating}
                  className={clsx(
                    "flex aspect-square relative h-full flex-col items-center justify-center rounded-lg border-2 p-4 hover:scale-105 motion-safe:transition-all motion-safe:duration-300",
                    selectedTextureId === texture.id
                      ? "border-[#81bfed] bg-[#81bfed]/20"
                      : "cursor-pointer border-gray-300 hover:border-gray-500",
                    isAnimating && "cursor-not-allowed opacity-50",
                  )}
                >
                  <div className="mb-3 overflow-hidden rounded border-2 border-black bg-gray-100 sm:w-16">
                    <Image
                      src={texture.path}
                      alt={texture.name}
                      width={400}
                      height={255}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-2 text-center font-bold-slanted text-sm md:text-lg">
                    {texture.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-sm shrink-0 lg:pl-6">
          <h2 className="mb-1 font-bold-slanted text-4xl uppercase lg:mb-2 lg:text-6xl">
            <PrismicText field={slice.primary.heading} />
          </h2>
          <div className="text-pretty lg:text-lg">
            <PrismicRichText field={slice.primary.description} />
          </div>
        </div>
      </Bounded>
    </section>
  );
};

export default ColorChanger;
