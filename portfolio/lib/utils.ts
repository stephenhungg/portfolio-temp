type ClassValue = string | number | boolean | undefined | null;

export function cn(...args: ClassValue[]): string {
  return args.filter((value) => typeof value === "string" && value.length > 0).join(" ");
}
