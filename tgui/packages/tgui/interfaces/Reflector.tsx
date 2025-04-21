import { Stack } from 'tgui-core/components';

import { Window } from '../layouts';
import { logger } from '../logging';
import { useNewBackend } from '../newBackend';

type Data = {
  reflector_name: string;
  rotation_angle: number;
};

export const Reflector = (props) => {
  const { data } = useNewBackend<Data>();
  const { reflector_name } = data;

  logger.log('Reflector data:', data);

  return (
    <Window title={reflector_name} height={200} width={219}>
      <Window.Content>
        <Stack />
      </Window.Content>
    </Window>
  );
};
