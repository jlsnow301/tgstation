import { create } from 'zustand';

import { Page } from '../../chat/types';

type ChatMessage = {
  id: string;
  text: string;
  timestamp: number;
};

type ChatState = {
  chat: ChatMessage[];
  chatById: Record<string, ChatMessage>;
  chatVisible: boolean;
  pageById: Record<string, Page>[];
  pageVisible: boolean;
  page: Page;
  pages: Page[];
};

type Action = {
  togglePageVisibility: () => void;
  toggleAcceptedPage: () => void;
  moveChatPageLeft: () => void;
  updateChatPage: (page: Page) => void;
  removeChatPage: (id: string) => void;
  moveChatPageRight: () => void;
};

export const useChatStore = create<ChatState & Action>((set) => ({
  chat: [],
  chatById: {},
  chatVisible: true,
  pageById: [],
  pageVisible: true,
}));
