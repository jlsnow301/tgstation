import { DmTestTarget } from "./test.ts";
import Juke from "../juke/index.js";
import { CiParameter } from "../constants/parameters.ts";
import { yarn } from "../lib/yarn.ts";
import fs from "node:fs";

export const YarnTarget = new Juke.Target({
  parameters: [CiParameter],
  inputs: [
    "tgui/.yarn/+(cache|releases|plugins|sdks)/**/*",
    "tgui/**/package.json",
    "tgui/yarn.lock",
  ],
  outputs: ["tgui/.yarn/install-target"],
  executes: ({ get }) => yarn("install", get(CiParameter) && "--immutable"),
});

export const TgFontTarget = new Juke.Target({
  dependsOn: [YarnTarget],
  inputs: [
    "tgui/.yarn/install-target",
    "tgui/packages/tgfont/**/*.+(js|mjs|svg)",
    "tgui/packages/tgfont/package.json",
  ],
  outputs: [
    "tgui/packages/tgfont/dist/tgfont.css",
    "tgui/packages/tgfont/dist/tgfont.woff2",
  ],
  executes: async () => {
    await yarn("tgfont:build");
    fs.mkdirSync("tgui/packages/tgfont/static", { recursive: true });
    fs.copyFileSync(
      "tgui/packages/tgfont/dist/tgfont.css",
      "tgui/packages/tgfont/static/tgfont.css",
    );
    fs.copyFileSync(
      "tgui/packages/tgfont/dist/tgfont.woff2",
      "tgui/packages/tgfont/static/tgfont.woff2",
    );
  },
});

export const TguiTarget = new Juke.Target({
  dependsOn: [YarnTarget],
  inputs: [
    "tgui/.yarn/install-target",
    "tgui/rspack.config.cjs",
    "tgui/**/package.json",
    "tgui/packages/**/*.+(js|cjs|ts|tsx|jsx|scss)",
  ],
  outputs: [
    "tgui/public/tgui.bundle.css",
    "tgui/public/tgui.bundle.js",
    "tgui/public/tgui-panel.bundle.css",
    "tgui/public/tgui-panel.bundle.js",
    "tgui/public/tgui-say.bundle.css",
    "tgui/public/tgui-say.bundle.js",
  ],
  executes: () => yarn("tgui:build"),
});

export const TguiEslintTarget = new Juke.Target({
  parameters: [CiParameter],
  dependsOn: [YarnTarget],
  executes: ({ get }) => yarn("tgui:lint", !get(CiParameter) && "--fix"),
});

export const TguiPrettierTarget = new Juke.Target({
  dependsOn: [YarnTarget],
  executes: () => yarn("tgui:prettier"),
});

export const TguiSonarTarget = new Juke.Target({
  dependsOn: [YarnTarget],
  executes: () => yarn("tgui:sonar"),
});

export const TguiTscTarget = new Juke.Target({
  dependsOn: [YarnTarget],
  executes: () => yarn("tgui:tsc"),
});

export const TguiTestTarget = new Juke.Target({
  parameters: [CiParameter],
  dependsOn: [YarnTarget],
  executes: ({ get }) =>
    yarn(`tgui:test-${get(CiParameter) ? "ci" : "simple"}`),
});

export const TguiLintTarget = new Juke.Target({
  dependsOn: [YarnTarget, TguiPrettierTarget, TguiEslintTarget, TguiTscTarget],
});

export const TguiDevTarget = new Juke.Target({
  dependsOn: [YarnTarget],
  executes: ({ args }) => yarn("tgui:dev", ...args),
});

export const TguiAnalyzeTarget = new Juke.Target({
  dependsOn: [YarnTarget],
  executes: () => yarn("tgui:analyze"),
});

export const TguiBenchTarget = new Juke.Target({
  dependsOn: [YarnTarget],
  executes: () => yarn("tgui:bench"),
});

export const TestTarget = new Juke.Target({
  dependsOn: [DmTestTarget, TguiTestTarget],
});

export const LintTarget = new Juke.Target({
  dependsOn: [TguiLintTarget],
});

export const TguiCleanTarget = new Juke.Target({
  executes: async () => {
    Juke.rm("tgui/public/.tmp", { recursive: true });
    Juke.rm("tgui/public/*.map");
    Juke.rm("tgui/public/*.{chunk,bundle,hot-update}.*");
    Juke.rm("tgui/packages/tgfont/dist", { recursive: true });
    Juke.rm("tgui/.yarn/{cache,unplugged,rspack}", { recursive: true });
    Juke.rm("tgui/.yarn/build-state.yml");
    Juke.rm("tgui/.yarn/install-state.gz");
    Juke.rm("tgui/.yarn/install-target");
    Juke.rm("tgui/.pnp.*");
  },
});
