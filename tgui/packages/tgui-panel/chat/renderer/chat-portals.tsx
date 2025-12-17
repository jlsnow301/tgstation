import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { getChatPortalsSnapshot, subscribeToChatPortals } from './portal-store';

export type PortalEntry = {
  key: string;
  mountEl: Element;
  Element: React.ComponentType<any>;
  props: Record<string, any>;
  html: string;
};

export function ChatPortals() {
  const entries = useSyncExternalStore(
    subscribeToChatPortals,
    getChatPortalsSnapshot,
    getChatPortalsSnapshot,
  );

  if (entries.length === 0) return;

  return (
    <>
      {entries.map((p) =>
        createPortal(
          <p.Element {...p.props}>
            {/** biome-ignore lint/security/noDangerouslySetInnerHtml: It's fine */}
            <span dangerouslySetInnerHTML={{ __html: p.html }} />
          </p.Element>,
          p.mountEl,
          p.key,
        ),
      )}
    </>
  );
}
