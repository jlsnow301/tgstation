import { logger } from 'tgui/logging';
import { classes } from 'tgui-core/react';
import { IMAGE_RETRY_DELAY, IMAGE_RETRY_LIMIT } from '../constants';
import { TGUI_CHAT_ATTRIBUTES_TO_PROPS } from './constants';

export function parseProps(node: Element) {
  const outputProps: Record<string, any> = {};
  for (let j = 0; j < node.attributes.length; j++) {
    const attribute = node.attributes[j];

    let workingValue: string | boolean | number | null = attribute.nodeValue;
    // We can't do the "if it has no value it's truthy" trick
    // Because getAttribute returns "", not null. Hate IE
    if (workingValue === '$true') {
      workingValue = true;
    } else if (workingValue === '$false') {
      workingValue = false;
    } else if (
      typeof workingValue === 'string' &&
      workingValue !== '' &&
      !Number.isNaN(Number(workingValue))
    ) {
      workingValue = parseFloat(workingValue);
    }

    let canonName = attribute.nodeName.replace('data-', '');
    canonName = TGUI_CHAT_ATTRIBUTES_TO_PROPS[canonName];
    if (!canonName) {
      continue;
    }
    outputProps[canonName] = workingValue;
  }
  return outputProps;
}

export function findNearestScrollableParent(startingNode) {
  const body = document.body;
  let node = startingNode;
  while (node && node !== body) {
    // This definitely has a vertical scrollbar, because it reduces
    // scrollWidth of the element. Might not work if element uses
    // overflow: hidden.
    if (node.scrollWidth < node.offsetWidth) {
      return node;
    }
    node = node.parentNode;
  }
  return window;
}

export function createHighlightNode(text, color) {
  const node = document.createElement('span');
  node.className = 'Chat__highlight';
  node.setAttribute('style', `background-color:${color}`);
  node.textContent = text;
  return node;
}

export function createMessageNode() {
  const node = document.createElement('div');
  node.className = 'ChatMessage';
  return node;
}

export function createReconnectedNode() {
  const node = document.createElement('div');
  node.className = 'Chat__reconnected';
  return node;
}

export function handleImageError(e) {
  setTimeout(() => {
    /** @type {HTMLImageElement} */
    const node = e.target;
    if (!node) {
      return;
    }
    const attempts = parseInt(node.getAttribute('data-reload-n'), 10) || 0;
    if (attempts >= IMAGE_RETRY_LIMIT) {
      logger.error(`failed to load an image after ${attempts} attempts`);
      return;
    }
    const src = node.src;
    node.src = null;
    node.src = `${src}#${attempts}`;
    node.setAttribute('data-reload-n', attempts + 1);
  }, IMAGE_RETRY_DELAY);
}

/**
 * Assigns a "times-repeated" badge to the message.
 */
export function updateMessageBadge(message) {
  const { node, times } = message;
  if (!node || !times) {
    // Nothing to update
    return;
  }
  const foundBadge = node.querySelector('.Chat__badge');
  const badge = foundBadge || document.createElement('div');
  badge.textContent = times;
  badge.className = classes(['Chat__badge', 'Chat__badge--animate']);
  requestAnimationFrame(() => {
    badge.className = 'Chat__badge';
  });
  if (!foundBadge) {
    node.appendChild(badge);
  }
}
