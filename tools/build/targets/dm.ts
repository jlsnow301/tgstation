import Juke from "../juke/index.js";
import { DreamMaker } from "../lib/byond.ts";
import {
  DefineParameter,
  DmVersionParameter,
  WarningParameter,
  NoWarningParameter,
  SkipIconCutter,
} from "../constants/parameters.ts";
import { IconCutterTarget } from "./cutter.ts";
import { DmMapsIncludeTarget } from "./maps.ts";
import { LintTarget, TestTarget, TguiTarget } from "./tgui.ts";
import { DME_NAME, NamedVersionFile } from "../constants/index.ts";

export const DmTarget = new Juke.Target({
  parameters: [
    DefineParameter,
    DmVersionParameter,
    WarningParameter,
    NoWarningParameter,
    SkipIconCutter,
  ],
  dependsOn: ({ get }) => [
    get(DefineParameter).includes("ALL_TEMPLATES") && DmMapsIncludeTarget,
    !get(SkipIconCutter) && IconCutterTarget,
  ],
  inputs: [
    "_maps/map_files/generic/**",
    "maps/**/*.dm",
    "code/**",
    "html/**",
    "icons/**",
    "interface/**",
    "sound/**",
    "tgui/public/tgui.html",
    `${DME_NAME}.dme`,
    NamedVersionFile,
  ],
  outputs: ({ get }) => {
    if (get(DmVersionParameter)) {
      return []; // Always rebuild when dm version is provided
    }
    return [`${DME_NAME}.dmb`, `${DME_NAME}.rsc`];
  },
  executes: async ({ get }) => {
    await DreamMaker(`${DME_NAME}.dme`, {
      defines: ["CBT", ...get(DefineParameter)],
      warningsAsErrors: get(WarningParameter).includes("error"),
      ignoreWarningCodes: get(NoWarningParameter),
      namedDmVersion: get(DmVersionParameter),
    });
  },
});

export const BuildTarget = new Juke.Target({
  dependsOn: [TguiTarget, DmTarget],
});

export const AllTarget = new Juke.Target({
  dependsOn: [TestTarget, LintTarget, BuildTarget],
});
