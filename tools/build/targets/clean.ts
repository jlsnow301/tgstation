import { TguiCleanTarget } from "./tgui";
import Juke from "../juke/index.js";
import { yarn } from "../lib/yarn.js";

export const CleanTarget = new Juke.Target({
  dependsOn: [TguiCleanTarget],
  executes: async () => {
    Juke.rm("*.{dmb,rsc}");
    Juke.rm("_maps/templates.dm");
  },
});

/**
 * Removes more junk at the expense of much slower initial builds.
 */
export const CleanAllTarget = new Juke.Target({
  dependsOn: [CleanTarget],
  executes: async () => {
    Juke.logger.info("Cleaning up data/logs");
    Juke.rm("data/logs", { recursive: true });
    Juke.logger.info("Cleaning up global yarn cache");
    await yarn("cache", "clean", "--all");
  },
});
