let debug;

if (__DEV__) {
  debug = {
    logs: true,
  };
} else {
  debug = {
    logs: false,
  };
}

const logs = debug?.logs;

type LogType = 'info' | 'success' | any;

const Log = (msg: string, obj?: object | any, type?: LogType) => {
  if (!logs) return null;
  if (typeof obj === 'boolean') {
    console.log(coloredLog(msg, type), obj.toString());
    return null;
  }
  console.log(coloredLog(msg, type), obj ? JSON.stringify(obj, null, 4) : '');
};

const coloredLog = (msg = '', type: any) => {
  switch (type) {
    case 'info':
      return `ℹ️ \x1b[46m ${msg}  \x1b[0m`;
    case 'success':
      return `✅ \x1b[42m  ${msg} \x1b[0m`;
    case 'error':
      return `❌ \x1b[41m ${msg}  \x1b[0m`;

    case 'infoNetwork':
      return `📡 \x1b[46m ${msg}  \x1b[0m`;
    case 'successNetwork':
      return `✅ \x1b[42m  ${msg} \x1b[0m`;
    case 'errorNetwork':
      return `🚧 \x1b[41m ${msg}  \x1b[0m`;

    case 'event':
      return `🕒 \x1b[45m  ${msg} \x1b[0m`;

    case 'analytics':
      return `📊 \x1b[2m  ${msg}`;

    default:
      return `\x1b[46m ${msg}  \x1b[0m`;
  }
};

export default Log;

// NODE CONSOLE COLORS

// Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"

// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"

// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"
