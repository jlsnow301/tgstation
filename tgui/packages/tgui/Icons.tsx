import { Suspense, useEffect } from 'react';
import { fetchRetry } from 'tgui-core/http';

import { resolveAsset } from './assets';

function loadIconMap() {
  fetchRetry(resolveAsset('icon_ref_map.json'))
    .then((res) => res.json())
    .then((data) => (Byond.iconRefMap = data))
    .catch(() => {});
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
