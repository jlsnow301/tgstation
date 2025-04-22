export const listeners = {
  // Audio
  'audio/playing': () => {},
  'audio/playMusic': () => {},
  'audio/stopMusic': () => {},
  'audio/stopped': () => {},
  'audio/toggle': () => {},
  // Chat
  'chat/changeScrollTracking': () => {},
  'chat/clear': () => {},
  'chat/load': () => {},
  'chat/message': () => {},
  'chat/movePageRight': () => {},
  'chat/rebuild': () => {},
  'chat/removePage': () => {},
  'chat/saveToDisk': () => {},
  'chat/updateMessageCount': () => {},
  'chat/updatePage': () => {},
  // Game
  'game/connectionLost': () => {},
  'game/connectionRestored': () => {},
  roundrestart: () => {},
  // Ping
  'ping/fail': () => {},
  'ping/reply': () => {},
  'ping/soft': () => {},
  'ping/success': () => {},
  // Settings
  'settings/addHighlightSetting': () => {},
  'settings/changeTab': () => {},
  'settings/export': () => {},
  'settings/import': () => {},
  'settings/load': () => {},
  'settings/openChatTab': () => {},
  'settings/removeHighlightSetting': () => {},
  'settings/update': () => {},
  'settings/updateHighlightSetting': () => {},
  // Telemetry
  'telemetry/request': () => {},
  testTelementryCommand: () => {},
} as const;
