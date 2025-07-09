import { useEffect, useState } from 'react';
import { Box, Stack } from 'tgui-core/components';
import { classes } from 'tgui-core/react';

import type { DataEvidence, EvidenceFn, EvidenceXYFn } from './types';

type Props = {
  evidence: DataEvidence;
  onStartConnecting: EvidenceXYFn;
  onConnected: () => void;
  onMouseUp: EvidenceFn;
};

export function Pin(props: Props) {
  const { evidence } = props;

  const [creatingRope, setCreatingRope] = useState(false);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    setCreatingRope(true);
    props.onStartConnecting(evidence, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  function handleMouseUp() {
    if (!creatingRope) return;

    setCreatingRope(false);
    props.onConnected();
  }

  return (
    <Stack>
      <Stack.Item>
        <Box
          className={classes([
            'Evidence__Pin',
            creatingRope && 'Evidence__Pin--connecting',
          ])}
          textAlign="center"
          onMouseDown={handleMouseDown}
          onMouseUp={() => props.onMouseUp(evidence)}
        />
      </Stack.Item>
    </Stack>
  );
}
