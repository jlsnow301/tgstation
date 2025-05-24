import Juke from "../juke/index.js";

export const DefineParameter = new Juke.Parameter({
  type: "string[]",
  alias: "D",
});

export const PortParameter = new Juke.Parameter({
  type: "string",
  alias: "p",
});

export const DmVersionParameter = new Juke.Parameter({
  type: "string",
});

export const CiParameter = new Juke.Parameter({ type: "boolean" });

export const ForceRecutParameter = new Juke.Parameter({
  type: "boolean",
  name: "force-recut",
});

export const SkipIconCutter = new Juke.Parameter({
  type: "boolean",
  name: "skip-icon-cutter",
});

export const WarningParameter = new Juke.Parameter({
  type: "string[]",
  alias: "W",
});

export const NoWarningParameter = new Juke.Parameter({
  type: "string[]",
  alias: "I",
});
