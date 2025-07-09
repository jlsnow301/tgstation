import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Flex, Stack } from 'tgui-core/components';

import { useBackend } from '../../backend';
import { Pin } from './Pin';
import type { DataEvidence, EvidenceFn, EvidenceXYFn, XYCoords } from './types';

type Props = {
  caseRef: string;
  evidence: DataEvidence;
  onEvidenceRemoved: EvidenceFn;
  onMoving: (position: XYCoords) => void;
  onPinConnected: () => void;
  onPinMouseUp: EvidenceFn;
  onPinStartConnecting: EvidenceXYFn;
  onStartMoving: EvidenceFn;
  onStopMoving: EvidenceFn;
};

export function Evidence(props: Props) {
  const { act } = useBackend();
  const { evidence, caseRef } = props;

  const [dragging, setDragging] = useState(false);
  const [canDrag, setCanDrag] = useState(true);
  const [dragPosition, setDragPosition] = useState<XYCoords>({
    x: evidence.x,
    y: evidence.y,
  });
  const [lastMousePosition, setLastMousePosition] = useState<XYCoords | null>(
    null,
  );

  const randomRotation = useMemo(() => Math.random() * 2 - 1, []);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (!canDrag) return;

    setDragging(true);
    props.onStartMoving(evidence);
    setLastMousePosition({ x: event.screenX, y: event.screenY });
  }

  function handleMouseUp(event: MouseEvent) {
    if (canDrag && dragPosition && dragging && lastMousePosition) {
      act('set_evidence_cords', {
        evidence_ref: evidence.ref,
        case_ref: caseRef,
        rel_x: dragPosition.x - (lastMousePosition.x - event.screenX),
        rel_y: dragPosition.y - (lastMousePosition.y - event.screenY),
      });
      props.onStopMoving({
        ...evidence,
        y: dragPosition.y - (lastMousePosition.y - event.screenY),
        x: dragPosition.x - (lastMousePosition.x - event.screenX),
      });
    }
    setDragging(false);
    setLastMousePosition(null);
  }

  function onMouseMove(event: MouseEvent) {
    if (!canDrag || !dragging) return;

    if (lastMousePosition) {
      const newX = dragPosition.x - (lastMousePosition.x - event.screenX);
      const newY = dragPosition.y - (lastMousePosition.y - event.screenY);

      setDragPosition({
        x: newX,
        y: newY,
      });
      props.onMoving({
        x: newX,
        y: newY,
      });
    }

    setLastMousePosition({ x: event.screenX, y: event.screenY });
  }

  return (
    <Box
      className={dragging && 'Evidence--dragging'}
      position="absolute"
      left={`${dragPosition.x}px`}
      top={`${dragPosition.y}px`}
      onMouseDown={handleMouseDown}
      style={{
        transform: !dragging ? `rotate(${randomRotation}deg)` : undefined,
        zIndex: 1,
      }}
    >
      <Stack vertical>
        <Stack.Item>
          <Box className="Evidence__Box">
            <Flex justify="space-between" mt={0.5} align="top">
              <Flex.Item align="left">
                <Pin
                  evidence={evidence}
                  onStartConnecting={(
                    evidence: DataEvidence,
                    mousePos: XYCoords,
                  ) => {
                    setCanDrag(false);
                    props.onPinStartConnecting(evidence, mousePos);
                  }}
                  onConnected={() => {
                    setCanDrag(true);
                    props.onPinConnected();
                  }}
                  onMouseUp={(evidence: DataEvidence) => {
                    setCanDrag(true);
                    props.onPinMouseUp(evidence);
                  }}
                />
              </Flex.Item>
              <Flex.Item align="center">
                <Box className="Evidence__Box__TextBox title">
                  <b>{evidence.name}</b>
                </Box>
              </Flex.Item>
              <Flex.Item align="right">
                <Button
                  iconColor="red"
                  icon="trash"
                  color="white"
                  onClick={() => {
                    props.onEvidenceRemoved(evidence);
                    act('remove_evidence', {
                      evidence_ref: evidence.ref,
                    });
                  }}
                  onMouseDown={() => setCanDrag(false)}
                />
              </Flex.Item>
            </Flex>
            <Box
              onClick={() =>
                act('look_evidence', {
                  case_ref: caseRef,
                  evidence_ref: evidence.ref,
                })
              }
            >
              {evidence.type === 'photo' ? (
                <img className="Evidence__Icon" src={evidence.photo_url} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: evidence.text }} />
              )}
            </Box>

            <Box className="Evidence__Box__TextBox">{evidence.description}</Box>
          </Box>
        </Stack.Item>
      </Stack>
    </Box>
  );
}
