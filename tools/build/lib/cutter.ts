import { dependencies } from "../constants/index.ts";
import fs from "node:fs";
import Juke from "../juke/index.js";
import https from "node:https";

// Canonical path for the cutter exe at this moment
function getCutterPath() {
  const ver = dependencies.CUTTER_VERSION;
  const suffix = process.platform === "win32" ? ".exe" : "";
  const file_ver = ver.split(".").join("-");

  return `tools/icon_cutter/cache/hypnagogic${file_ver}${suffix}`;
}

export const cutter_path = getCutterPath();

export async function download_file(url: string, file: string) {
  return new Promise((resolve, reject) => {
    let file_stream = fs.createWriteStream(file);
    https
      .get(url, function (response) {
        if (response.statusCode === 302) {
          const location = response.headers?.location;
          if (!location) {
            Juke.logger.error(`Failed to download ${url}: No location header`);
            file_stream.close();
            reject();
            return;
          }

          file_stream.close();
          download_file(location, file).then(resolve);

          return;
        }
        if (response.statusCode !== 200) {
          Juke.logger.error(
            `Failed to download ${url}: Status ${response.statusCode}`,
          );
          file_stream.close();
          reject();
          return;
        }
        response.pipe(file_stream);

        // after download completed close filestream
        file_stream.on("finish", () => {
          file_stream.close();
          resolve(null);
        });
      })
      .on("error", (err) => {
        file_stream.close();
        Juke.rm(download_into);
        Juke.logger.error(`Failed to download ${url}: ${err.message}`);
        reject();
      });
  });
}
