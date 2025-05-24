import Juke from "../juke/index.js";
import { TguiTarget } from "./tgui.ts";
import { DME_NAME } from "../constants/index.ts";
import fs from "node:fs";
import { DreamDaemon } from "../lib/byond.ts";
import { DmVersionParameter, PortParameter } from "../constants/parameters.ts";
import { BuildTarget } from "./dm.ts";

/**
 * Prepends the defines to the .dme.
 * Does not clean them up, as this is intended for TGS which
 * clones new copies anyway.
 */
function prependDefines(...defines) {
  const dmeContents = fs.readFileSync(`${DME_NAME}.dme`);
  const textToWrite = defines.map((define) => `#define ${define}\n`);

  fs.writeFileSync(`${DME_NAME}.dme`, `${textToWrite}\n${dmeContents}`);
}

export const TgsTarget = new Juke.Target({
  dependsOn: [TguiTarget],
  executes: async () => {
    Juke.logger.info("Prepending TGS define");
    prependDefines("TGS");
  },
});

export const ServerTarget = new Juke.Target({
  parameters: [DmVersionParameter, PortParameter],
  dependsOn: [BuildTarget],
  executes: async ({ get }) => {
    const port = get(PortParameter) || "1337";
    const options = {
      dmbFile: `${DME_NAME}.dmb`,
      namedDmVersion: get(DmVersionParameter),
    };
    await DreamDaemon(options, port, "-trusted");
  },
});
