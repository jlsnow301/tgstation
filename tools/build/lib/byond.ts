import fs from "node:fs";
import path from "node:path";
import Juke from "../juke/index.js";
import { regQuery } from "./winreg.ts";
import { NamedVersionFile } from "../constants/index.ts";

/**
 * Cached path to DM compiler
 */
let dmPath;

async function getDmPath(
  namedVersion: string | null | undefined,
): Promise<string> {
  // Use specific named version
  if (namedVersion) {
    return getNamedByondVersionPath(namedVersion);
  }
  if (dmPath) {
    return dmPath;
  }
  dmPath = await (async () => {
    // Search in array of paths
    const paths = [
      ...((process.env.DM_EXE && process.env.DM_EXE.split(",")) || []),
      ...getDefaultNamedByondVersionPath(),
      "C:\\Program Files\\BYOND\\bin\\dm.exe",
      "C:\\Program Files (x86)\\BYOND\\bin\\dm.exe",
      ["reg", "HKLM\\Software\\Dantom\\BYOND", "installpath"],
      ["reg", "HKLM\\SOFTWARE\\WOW6432Node\\Dantom\\BYOND", "installpath"],
    ];
    const isFile = (path) => {
      try {
        return fs.statSync(path).isFile();
      } catch (err) {
        return false;
      }
    };
    for (let path of paths) {
      let newPath: string | null;
      // Resolve a registry key
      if (Array.isArray(path)) {
        const [_type, ...args] = path;
        const tupleArgs = args as [string, string];

        newPath = await regQuery(...tupleArgs);
      }

      if (!path) {
        continue;
      }

      // Check if path exists
      if (isFile(path)) {
        return path;
      }

      if (isFile(path + "/dm.exe")) {
        return path + "/dm.exe";
      }

      if (isFile(path + "/bin/dm.exe")) {
        return path + "/bin/dm.exe";
      }
    }
    // Default paths
    return (process.platform === "win32" && "dm.exe") || "DreamMaker";
  })();
  return dmPath;
}

function getNamedByondVersionPath(namedVersion: string): string {
  const all_entries = getAllNamedDmVersions(true);
  const map_entry = all_entries.find((x) => x.name === namedVersion);
  if (map_entry === undefined) {
    Juke.logger.error(
      `No named byond version with name "${namedVersion}" found.`,
    );
    throw new Juke.ExitCode(1);
  }
  return map_entry.path;
}

function getDefaultNamedByondVersionPath(): string[] {
  const all_entries = getAllNamedDmVersions(false);
  const map_entry = all_entries.find((x) => x.default == true);
  if (map_entry === undefined) return [];
  return [map_entry.path];
}

type NamedDmVersion = {
  name: string;
  path: string;
  default: boolean;
};

let namedDmVersionList: NamedDmVersion[];

function getAllNamedDmVersions(throw_on_fail: boolean): NamedDmVersion[] {
  if (namedDmVersionList) return namedDmVersionList;

  if (!fs.existsSync(NamedVersionFile)) {
    if (throw_on_fail) {
      Juke.logger.error(`No byond version map file found.`);
      throw new Juke.ExitCode(1);
    }
    namedDmVersionList = [];
    return namedDmVersionList;
  }

  try {
    const read = fs.readFileSync(NamedVersionFile, "utf-8");
    namedDmVersionList = JSON.parse(read);
  } catch (err) {
    if (throw_on_fail) {
      Juke.logger.error(`Failed to parse byond version map file. ${err}`);
      throw new Juke.ExitCode(1);
    }
    namedDmVersionList = [];
    return namedDmVersionList;
  }

  return namedDmVersionList;
}

type Option = Partial<{
  defines: string[];
  warningsAsErrors: boolean;
  namedDmVersion: string | null;
  ignoreWarningCodes: string[];
}>;

export async function DreamMaker(
  dmeFile: string,
  options: Option = {},
): Promise<void> {
  if (options.namedDmVersion !== null) {
    Juke.logger.info("Using named byond version:", options.namedDmVersion);
  }
  const dmPath = await getDmPath(options.namedDmVersion);
  // Get project basename
  const dmeBaseName = dmeFile.replace(/\.dme$/, "");

  // Make sure output files are writable
  function testOutputFile(name: string): void {
    try {
      fs.closeSync(fs.openSync(name, "r+"));
    } catch (err) {
      if (err && err.code === "ENOENT") {
        return;
      }
      if (err && err.code === "EBUSY") {
        Juke.logger.error(
          `File '${name}' is locked by the DreamDaemon process.`,
        );
        Juke.logger.error(`Stop the currently running server and try again.`);
        throw new Juke.ExitCode(1);
      }
      throw err;
    }
  }

  async function testDmVersion(dmPath: string): Promise<void> {
    const execReturn = await Juke.exec(dmPath, [], {
      silent: true,
      throw: false,
    });
    const version = execReturn.combined.match(
      `DM compiler version (\\d+)\\.(\\d+)`,
    );
    if (version == null) {
      Juke.logger.error(
        `Unexpected DreamMaker return, ensure "${dmPath}" is correct DM path.`,
      );
      throw new Juke.ExitCode(1);
    }
    const requiredMajorVersion = 515;
    const requiredMinorVersion = 1597; // First with -D switch functionality
    const major = Number(version[1]);
    const minor = Number(version[2]);
    if (
      major < requiredMajorVersion ||
      (major == requiredMajorVersion && minor < requiredMinorVersion)
    ) {
      Juke.logger.error(
        `${requiredMajorVersion}.${requiredMinorVersion} or later DM version required. Version ${major}.${minor} found at: ${dmPath}`,
      );
      throw new Juke.ExitCode(1);
    }
  }

  await testDmVersion(dmPath);
  testOutputFile(`${dmeBaseName}.dmb`);
  testOutputFile(`${dmeBaseName}.rsc`);

  async function runWithWarningChecks(
    dmPath: string,
    args: string[],
  ): Promise<void> {
    const execReturn = await Juke.exec(dmPath, args);
    if (options.warningsAsErrors) {
      const ignoredWarningCodes = options.ignoreWarningCodes ?? [];
      if (ignoredWarningCodes.length > 0) {
        Juke.logger.info(
          "Ignored warning codes:",
          ignoredWarningCodes.join(", "),
        );
      }
      const base_regex = "\\d+:warning( \\([a-z_]*\\))?:";
      const with_ignores = `\\d+:warning( \\([a-z_]*\\))?:(?!(${ignoredWarningCodes.map((x) => `.*${x}.*$`).join("|")}))`;
      const reg =
        ignoredWarningCodes.length > 0
          ? new RegExp(with_ignores, "m")
          : new RegExp(base_regex, "m");
      if (options.warningsAsErrors && execReturn.combined.match(reg)) {
        Juke.logger.error(`Compile warnings treated as errors`);
        throw new Juke.ExitCode(2);
      }
    }
    return execReturn;
  }
  // Compile
  const { defines = [] } = options;
  if (defines && defines.length > 0) {
    Juke.logger.info("Using defines:", defines.join(", "));
  }

  await runWithWarningChecks(dmPath, [
    ...defines.map((def) => `-D${def}`),
    dmeFile,
  ]);
}

type DDOptions = {
  dmbFile: string;
  namedDmVersion: string | null;
};

export async function DreamDaemon(options: DDOptions, ...args: string[]) {
  const dmPath = await getDmPath(options.namedDmVersion);
  const baseDir = path.dirname(dmPath);
  const ddExeName =
    process.platform === "win32" ? "dreamdaemon.exe" : "DreamDaemon";
  const ddExePath = baseDir === "." ? ddExeName : path.join(baseDir, ddExeName);

  return Juke.exec(ddExePath, [options.dmbFile, ...args]);
}
