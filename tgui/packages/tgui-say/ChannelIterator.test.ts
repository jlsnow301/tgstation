import { Channel, ChannelIterator } from './ChannelIterator';

describe('ChannelIterator', () => {
  let channelIterator: ChannelIterator;

  beforeEach(() => {
    channelIterator = new ChannelIterator();
  });

  it('should cycle through channels properly', () => {
    expect(channelIterator.current()).toBe(Channel.Say);
    expect(channelIterator.next()).toBe(Channel.Radio);
    expect(channelIterator.next()).toBe(Channel.Me);
    expect(channelIterator.next()).toBe(Channel.Ooc);
    expect(channelIterator.next()).toBe(Channel.Say); // Admin is blacklisted so it should be skipped
  });

  it('should set a channel properly', () => {
    channelIterator.set(Channel.Ooc);
    expect(channelIterator.current()).toBe(Channel.Ooc);
  });

  it('should return true when current channel is "Say"', () => {
    channelIterator.set(Channel.Say);
    expect(channelIterator.isSay()).toBe(true);
  });

  it('should return false when current channel is not "Say"', () => {
    channelIterator.set(Channel.Radio);
    expect(channelIterator.isSay()).toBe(false);
  });

  it('should return true when current channel is visible', () => {
    channelIterator.set(Channel.Say);
    expect(channelIterator.isVisible()).toBe(true);
  });

  it('should return false when current channel is not visible', () => {
    channelIterator.set(Channel.Ooc);
    expect(channelIterator.isVisible()).toBe(false);
  });

  it('should not leak a message from a blacklisted channel', () => {
    channelIterator.set(Channel.Admin);
    expect(channelIterator.next()).toBe(Channel.Admin);
  });
});
