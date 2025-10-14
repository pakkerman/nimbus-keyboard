"use client";

import { FC, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Content } from "@prismicio/client";

import Bounded from "@/components/Bounded";
import Scene from "./Scene";
import ScrollTrigger from "gsap/ScrollTrigger";
import Loader from "@/components/Loader";
import { useProgress } from "@react-three/drei";
import clsx from "clsx";
import { AiOutlineDown } from "react-icons/ai";
import Link from "next/link";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

function LoaderWrapper() {
  const { active } = useProgress();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (active) setIsLoading(true);
    else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div
      className={clsx(
        "motion-safe:transition-opacity motion-safe:duration-700",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <Loader />
    </div>
  );
}

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

const Hero: FC<HeroProps> = ({ slice }) => {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const split = SplitText.create(".hero-heading", {
        type: "chars,lines",
        mask: "lines",
        linesClass: "line++",
      });

      const tl = gsap.timeline({ delay: 4.2 });
      tl.from(split.chars, {
        opacity: 0,
        y: -120,
        ease: "back",
        duration: 0.4,
        stagger: 0.07,
      }).to(".hero-body", {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.fromTo(
        ".hero-scene",
        {
          background:
            "linear-gradient(to bottom, #000000, #0f172a, #062f4a, #7fa0b9)",
        },
        {
          background:
            "linear-gradient(to bottom, #ffffff, #ffffff, #ffffff, #ffffff)",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "50% bottom",
            scrub: 1,
          },
        },
      );
    });

    // reduced motion
    mm.add("(prefers-reduced-motion: reduced)", () => {
      gsap.set(".hero-heading, .hero-body", { opacity: 1 });
    });
  });

  const handleFeatureClick = () => {
    const features = document.querySelector("#features");
    if (!features) return;

    features.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="hero relative h-dvh text-white text-shadow-black/30 text-shadow-lg motion-safe:h-[300vh]"
    >
      <div className="hero-scene pointer-events-none sticky top-0 h-dvh w-full">
        <Canvas shadows="soft">
          <Scene />
        </Canvas>
      </div>
      <LoaderWrapper />
      <div className="hero-content absolute inset-x-0 top-0 h-dvh">
        <Bounded
          fullWidth
          className="absolute inset-x-0 top-18 md:top-24 md:left-[8vw]"
        >
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading1: ({ children }) => (
                <h1 className="hero-heading font-black-slanted text-6xl leading-[0.8] uppercase sm:text-7xl lg:text-8xl">
                  {children}
                </h1>
              ),
            }}
          />
        </Bounded>
        <Bounded
          fullWidth
          className="hero-body absolute inset-x-0 bottom-0 md:right-[8vw] z-10 md:left-auto opacity-0"
          innerClassName="flex flex-col gap-3"
        >
          {/* <div className="absolute left-0 inset-y-6 bg-black/10 backdrop-blur-md -right-36 border-4 rounded-2xl border-orange-300/80" /> */}
          <div className="max-w-md z-10">
            <PrismicRichText
              field={slice.primary.body}
              components={{
                heading2: ({ children }) => (
                  <h2 className="mb-1 font-bold-slanted text-4xl uppercase lg:mb-2 lg:text-6xl">
                    {children}
                  </h2>
                ),
              }}
            />
          </div>
          <div className="flex gap-4 z-10">
            <button
              onClick={handleFeatureClick}
              className="group flex w-fit cursor-pointer items-center gap-1 rounded bg-[#01A7E1] px-3 py-1 font-bold-slanted text-2xl uppercase transition disabled:grayscale"
            >
              features
              <span className="transition group-hover:translate-x-1">
                {">"}
              </span>
            </button>
            <button className="group flex w-fit cursor-pointer items-center gap-1 rounded bg-[#01A7E1] px-3 py-1 font-bold-slanted text-2xl uppercase transition disabled:grayscale">
              {slice.primary.buy_button_text}
              <span className="transition group-hover:translate-x-1">
                {">"}
              </span>
            </button>
          </div>
        </Bounded>
      </div>
    </section>
  );
};

export default Hero;
