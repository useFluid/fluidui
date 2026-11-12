"use client";

import type { ComponentType } from "react";
import Bot from "./bot/demo";
import IconMorph from "./icon-morph/demo";
import CopyMorph from "./copy-morph/demo";
import IslandToast from "./island-toast/demo";
import LogoWipe from "./logo-wipe/demo";
import MascotDemo from "./mascot/demo";
import MenuMorph from "./menu-morph/demo";
import MorphDialog from "./morph-dialog/demo";
import PillTabs from "./pill-tabs/demo";
import MorphButton from "./morph-button/demo";
import MorphIsland from "./morph-island/demo";
import MorphLoader from "./morph-loader/demo";
import Pet from "./pet/demo";
import SegmentedPicker from "./segmented-picker/demo";
import ShapeMorph from "./shape-morph/demo";
import SplashChoice from "./splash-choice/demo";
import SplashDots from "./splash-dots/demo";
import SplashShapes from "./splash-shapes/demo";
import SpringButton from "./spring-button/demo";
import SpringSwitch from "./spring-switch/demo";
import TextReveal from "./text-reveal/demo";
import WordCycle from "./word-cycle/demo";

export const demos: Record<string, ComponentType> = {
  "shape-morph": ShapeMorph,
  "icon-morph": IconMorph,
  "morph-loader": MorphLoader,
  pet: Pet,
  bot: Bot,
  mascot: MascotDemo,
  "morph-button": MorphButton,
  "segmented-picker": SegmentedPicker,
  "spring-switch": SpringSwitch,
  "spring-button": SpringButton,
  "morph-island": MorphIsland,
  "word-cycle": WordCycle,
  "text-reveal": TextReveal,
  "logo-wipe": LogoWipe,
  "menu-morph": MenuMorph,
  "morph-dialog": MorphDialog,
  "island-toast": IslandToast,
  "pill-tabs": PillTabs,
  "copy-morph": CopyMorph,
  "splash-choice": SplashChoice,
  "splash-shapes": SplashShapes,
  "splash-dots": SplashDots,
};
