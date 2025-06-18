import Juke from "../juke/index.js";

export function pnpm(...args) {
  return Juke.exec("pnpm", [...args.filter((arg) => typeof arg === "string")], {
    cwd: "./tgui",
    shell: true,
  });
}
