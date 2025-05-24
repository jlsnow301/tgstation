import Juke from "../juke/index.js";
import { writeFileSync } from "node:fs";

export const DmMapsIncludeTarget = new Juke.Target({
  executes: async () => {
    const folders = [
      ...Juke.glob("_maps/map_files/**/modular_pieces/*.dmm"),
      ...Juke.glob("_maps/RandomRuins/**/*.dmm"),
      ...Juke.glob("_maps/RandomZLevels/**/*.dmm"),
      ...Juke.glob("_maps/shuttles/**/*.dmm"),
      ...Juke.glob("_maps/templates/**/*.dmm"),
    ];
    const content =
      folders
        .map((file) => file.replace("_maps/", ""))
        .map((file) => `#include "${file}"`)
        .join("\n") + "\n";
    writeFileSync("_maps/templates.dm", content);
  },
});
