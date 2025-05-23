import Juke from '../juke/index.js';

let bunPath;

export function bun(...args){
    if (!bunPath) {
      bunPath = Juke.glob('./tgui/.bun/releases/*.cjs')[0]
        .replace('/tgui/', '/');
    }
    return Juke.exec('node', [
      bunPath,
      ...args.filter((arg) => typeof arg === 'string'),
    ], {
      cwd: './tgui',
    });
  };


