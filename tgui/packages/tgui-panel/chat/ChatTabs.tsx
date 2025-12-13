/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { useAtom, useAtomValue } from 'jotai';
import { Box, Button, Stack, Tabs } from 'tgui-core/components';
import { settingsVisibleAtom } from '../settings/atoms';
import { chatPagesAtom, chatPagesRecord, currentPageAtom } from './atom';
import { addChatPage, changeChatPage } from './helpers';

type UnreadCountWidgetProps = {
  value: number;
};

function UnreadCountWidget(props: UnreadCountWidgetProps) {
  const { value } = props;

  return <Box className="UnreadCount">{Math.min(value, 99)}</Box>;
}

export function ChatTabs(props) {
  const pages = useAtomValue(chatPagesAtom);
  const pagesRecord = useAtomValue(chatPagesRecord);
  const currentPage = useAtomValue(currentPageAtom);

  const [, setSettingsVisible] = useAtom(settingsVisibleAtom);

  return (
    <Stack align="center">
      <Stack.Item>
        <Tabs scrollable textAlign="center">
          {pages.map((page) => {
            const actual = pagesRecord[page];
            return (
              <Tabs.Tab
                key={page}
                selected={page === currentPage.id}
                onClick={() => changeChatPage(actual)}
              >
                {actual.name}
                {!actual.hideUnreadCount && actual.unreadCount > 0 && (
                  <UnreadCountWidget value={actual.unreadCount} />
                )}
              </Tabs.Tab>
            );
          })}
        </Tabs>
      </Stack.Item>
      <Stack.Item>
        <Button
          color="transparent"
          icon="plus"
          onClick={() => {
            addChatPage();
            setSettingsVisible(true);
          }}
        />
      </Stack.Item>
    </Stack>
  );
}
