import pc from "picocolors";

const theme = {
  info: pc.blue,
  success: pc.green,
  warning: pc.yellow,
  error: pc.red,
  dim: pc.dim,
  command: pc.magenta,
  branch: pc.cyan,
};

const symbols = {
  info: theme.info("ℹ"),
  success: theme.success("✔"),
  warning: theme.warning("⚠"),
  error: theme.error("✖"),
  arrow: theme.dim("→"),
};

export const logger = {
  log: (msg) => console.log(msg),

  info: (msg, label = "INFO") => {
    console.log(`${symbols.info} ${theme.info(label)} ${msg}`);
  },

  success: (msg, label = "SUCCESS") => {
    console.log(`${symbols.success} ${theme.success(label)} ${msg}`);
  },

  warn: (msg, label = "WARN") => {
    console.log(`${symbols.warning} ${theme.warning(label)} ${msg}`);
  },

  error: (msg, label = "ERROR") => {
    console.error(`${symbols.error} ${theme.error(label)} ${msg}`);
  },

  step: (msg) => {
    console.log(`${theme.dim("•")} ${msg}`);
  },

  command: (cmd) => {
    console.log(`${theme.dim("$")} ${theme.command(cmd)}`);
  },

  box: (title, content) => {
    const len = Math.max(title.length, ...content.map((c) => c.length)) + 4;
    const line = theme.dim("─".repeat(len));
    console.log(theme.dim(`┌${line}┐`));
    console.log(
      theme.dim(`│`) +
        ` ${pc.bold(title)} ` +
        " ".repeat(len - title.length - 2) +
        theme.dim(`│`),
    );
    content.forEach((c) => {
      console.log(
        theme.dim(`│`) +
          ` ${c} ` +
          " ".repeat(len - c.length - 2) +
          theme.dim(`│`),
      );
    });
    console.log(theme.dim(`└${line}┘`));
  },
};

export { theme, symbols };
