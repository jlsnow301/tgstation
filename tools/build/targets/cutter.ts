import Juke from "../juke/index.js";
import { ForceRecutParameter } from "../constants/parameters.ts";
import { dependencies } from "../constants/index.ts";
import { cutter_path, download_file } from "../lib/cutter.ts";

export const CutterTarget = new Juke.Target({
  onlyWhen: () => {
    const files = Juke.glob(cutter_path);
    return files.length == 0;
  },
  executes: async () => {
    const repo = dependencies.CUTTER_REPO;
    const ver = dependencies.CUTTER_VERSION;
    const suffix = process.platform === "win32" ? ".exe" : "";
    const download_from = `https://github.com/${repo}/releases/download/${ver}/hypnagogic${suffix}`;
    await download_file(download_from, cutter_path);
    if (process.platform !== "win32") {
      await Juke.exec("chmod", ["+x", cutter_path]);
    }
  },
});

export const IconCutterTarget = new Juke.Target({
  parameters: [ForceRecutParameter],
  dependsOn: () => [CutterTarget],
  inputs: ({ get }) => {
    const standard_inputs = [
      `icons/**/*.png.toml`,
      `icons/**/*.dmi.toml`,
      `cutter_templates/**/*.toml`,
      cutter_path,
    ];
    // Alright we're gonna search out any existing toml files and convert
    // them to their matching .dmi or .png file
    const existing_configs = [
      ...Juke.glob(`icons/**/*.png.toml`),
      ...Juke.glob(`icons/**/*.dmi.toml`),
    ];
    return [
      ...standard_inputs,
      ...existing_configs.map((file) => file.replace(".toml", "")),
    ];
  },
  outputs: ({ get }) => {
    if (get(ForceRecutParameter)) return [];
    const folders = [
      ...Juke.glob(`icons/**/*.png.toml`),
      ...Juke.glob(`icons/**/*.dmi.toml`),
    ];
    return folders
      .map((file) => file.replace(`.png.toml`, ".dmi"))
      .map((file) => file.replace(`.dmi.toml`, ".png"));
  },
  executes: async () => {
    await Juke.exec(cutter_path, [
      "--dont-wait",
      "--templates",
      "cutter_templates",
      "icons",
    ]);
  },
});
