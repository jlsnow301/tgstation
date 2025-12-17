import { createPortal } from 'react-dom';

export type PortalEntry = {
  key: string;
  mountEl: Element;
  Element: React.ComponentType<any>;
  props: Record<string, any>;
  html: string;
};

type Props = {
  entries: PortalEntry[];
};

export function PortalHost(props: Props) {
  const { entries } = props;

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
