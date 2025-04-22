const EXCLUDED_PATTERNS = [/v4shim/i];
const loadedMappings: Record<string, string> = {};

export function resolveAsset(name: string): string {
  return loadedMappings[name] || name;
}

export function loadStyleSheet(payload: string): void {
  Byond.loadCss(payload);
}

export function loadMappings(payload: Record<string, string>): void {
  for (const name in payload) {
    // Skip anything that matches excluded patterns
    if (EXCLUDED_PATTERNS.some((regex) => regex.test(name))) {
      continue;
    }

    const url = payload[name];
    const ext = name.split('.').pop();

    loadedMappings[name] = url;

    if (ext === 'css') {
      Byond.loadCss(url);
    }
    if (ext === 'js') {
      Byond.loadJs(url);
    }
  }
}
