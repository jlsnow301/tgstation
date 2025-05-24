import { DME_NAME } from "../constants/index.ts";
import {
  DefineParameter,
  DmVersionParameter,
  WarningParameter,
  NoWarningParameter,
} from "../constants/parameters.ts";
import Juke from "../juke/index.js";
import { DreamMaker, DreamDaemon } from "../lib/byond.ts";
import { IconCutterTarget } from "./cutter.ts";
import { DmMapsIncludeTarget } from "./maps.ts";
import fs from "node:fs";

export const DmTestTarget = new Juke.Target({
  parameters: [
    DefineParameter,
    DmVersionParameter,
    WarningParameter,
    NoWarningParameter,
  ],
  dependsOn: ({ get }) => [
    get(DefineParameter).includes("ALL_MAPS") && DmMapsIncludeTarget,
    IconCutterTarget,
  ],
  executes: async ({ get }) => {
    fs.copyFileSync(`${DME_NAME}.dme`, `${DME_NAME}.test.dme`);
    await DreamMaker(`${DME_NAME}.test.dme`, {
      defines: ["CBT", "CIBUILDING", ...get(DefineParameter)],
      warningsAsErrors: get(WarningParameter).includes("error"),
      ignoreWarningCodes: get(NoWarningParameter),
      namedDmVersion: get(DmVersionParameter),
    });
    Juke.rm("data/logs/ci", { recursive: true });
    const options = {
      dmbFile: `${DME_NAME}.test.dmb`,
      namedDmVersion: get(DmVersionParameter),
    };
    await DreamDaemon(
      options,
      "-close",
      "-trusted",
      "-verbose",
      "-params",
      "log-directory=ci",
    );
    Juke.rm("*.test.*");
    try {
      const cleanRun = fs.readFileSync("data/logs/ci/clean_run.lk", "utf-8");
      console.log(cleanRun);
    } catch (err) {
      Juke.logger.error("Test run was not clean, exiting");
      throw new Juke.ExitCode(1);
    }
  },
});
