import { useChatStore } from '../events/stores/chat';

export function useChat() {
  const page = useChatStore((state) => state.page);
  const moveChatPageLeft = useChatStore((state) => state.moveChatPageLeft);
  const updateChatPage = useChatStore((state) => state.updateChatPage);
  const removeChatPage = useChatStore((state) => state.removeChatPage);
  const moveChatPageRight = useChatStore((state) => state.moveChatPageRight);

  return {
    page,
    moveChatPageLeft,
    updateChatPage,
    removeChatPage,
    moveChatPageRight,
  };
}
