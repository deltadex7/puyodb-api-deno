/**
 * Take a string and break it at every brackets '()'.
 * */
export function tokenizeBrackets(s: string): string[] {
  return s.replaceAll(/\s*\(.*?\)\s*/g, "\n").trim().split("\n");
}

/**
 * Take a string and break it at every <br> tag.
 * */
export function tokenizeBRs(s: string): string[] {
  return s.trim().split("<br>").map((s2) => s2.trim());
}
/**
 * Take a string remove all tags and brackets.
 * */
export function stripBrackets(s: string): string {
  return s.replaceAll(/\s*<[^<>]*>\s*/g, "")
    .replaceAll(/\s*\([^()]*\)\s*/g, "");
}
/**
 * Take a string replace all tags and brackets with a space.
 * */
export function removeBrackets(s: string): string {
  return s.replaceAll(/\s*<[^<>]*>\s*/g, " ")
    .replaceAll(/\s*\([^()]*\)\s*/g, " ").trim();
}

export function getNumbers(s: string): number[] {
  return s.match(/\d+/g)?.map((r) => parseInt(r)) ?? [];
}
