import { DME_NAME } from "../constants/index.ts";
import Juke from "../juke/index.js";
import { DreamMaker, DreamDaemon } from "../lib/byond";
import {
  DefineParameter,
  DmVersionParameter,
  WarningParameter,
  NoWarningParameter,
} from "../constants/parameters";
import { IconCutterTarget } from "./cutter";
import { DmMapsIncludeTarget } from "./maps";
import fs from "node:fs";

export const AutowikiTarget = new Juke.Target({
  parameters: [
    DefineParameter,
    DmVersionParameter,
    WarningParameter,
    NoWarningParameter,
  ],
  dependsOn: ({ get }) => [
    get(DefineParameter).includes("ALL_TEMPLATES") && DmMapsIncludeTarget,
    IconCutterTarget,
  ],
  outputs: ["data/autowiki_edits.txt"],
  executes: async ({ get }) => {
    fs.copyFileSync(`${DME_NAME}.dme`, `${DME_NAME}.test.dme`);
    await DreamMaker(`${DME_NAME}.test.dme`, {
      defines: ["CBT", "AUTOWIKI", ...get(DefineParameter)],
      warningsAsErrors: get(WarningParameter).includes("error"),
      ignoreWarningCodes: get(NoWarningParameter),
      namedDmVersion: get(DmVersionParameter),
    });
    Juke.rm("data/autowiki_edits.txt");
    Juke.rm("data/autowiki_files", { recursive: true });
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

    if (!fs.existsSync("data/autowiki_edits.txt")) {
      Juke.logger.error("Autowiki did not generate an output, exiting");
      throw new Juke.ExitCode(1);
    }
  },
});
