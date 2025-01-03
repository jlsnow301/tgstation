import { BooleanLike } from 'tgui-core/react';

import { Channel } from './ChannelIterator';
import { WINDOW_SIZES } from './constants';

export type ByondOpen = {
  channel: Channel;
};

export type ByondProps = {
  maxLength: number;
  lightMode: BooleanLike;
};

export type State = {
  buttonContent: string | number;
  size: WINDOW_SIZES;
};
