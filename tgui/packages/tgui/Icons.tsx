import { Suspense, useEffect } from 'react';
import { fetchRetry } from 'tgui-core/http';
import { resolveAsset } from './assets';
import { logger } from './logging';

function setIconRefMap(data: Record<string, any>) {
  Byond.iconRefMap = data;
}

function loadIconMap() {
  fetchRetry(resolveAsset('icon_ref_map.json'))
    .then((res) => res.json())
    .then(setIconRefMap)
    .catch((error) => logger.log(error));
}

function IconMapLoader() {
  useEffect(() => {
    if (Object.keys(Byond.iconRefMap).length === 0) {
      loadIconMap();
    }
  }, []);

  return null;
}

export function IconProvider() {
  return (
    <Suspense fallback={null}>
      <IconMapLoader />
    </Suspense>
  );
}
