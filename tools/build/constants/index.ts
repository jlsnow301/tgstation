import fs from "node:fs";

export const DME_NAME = "tgstation";

// Stores the contents of dependencies.sh as a key value pair
// Best way I could figure to get ahold of this stuff
export const dependencies: Record<string, string> = fs
  .readFileSync("dependencies.sh", "utf8")
  .split("\n")
  .map((statement) => statement.replace("export", "").trim())
  .filter((value) => !(value == "" || value.startsWith("#")))
  .map((statement) => statement.split("="))
  .reduce((acc, kv_pair) => {
    acc[kv_pair[0]] = kv_pair[1];
    return acc;
  }, {});

export const NamedVersionFile = "tools/build/dm_versions.json";
