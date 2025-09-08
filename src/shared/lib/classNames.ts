export const cn = (...xs: Array<string | false | undefined>) =>
  xs.filter(Boolean).join(" ");
