import { normalizeClipboardToPath } from "../normalizePath";

describe("normalizeClipboardToPath", () => {
  test("returns null for empty string", () => {
    expect(normalizeClipboardToPath("")).toBeNull();
  });

  test("returns null for whitespace-only string", () => {
    expect(normalizeClipboardToPath("   \n\t  ")).toBeNull();
  });

  test("trims surrounding whitespace", () => {
    expect(normalizeClipboardToPath("  /foo/bar  ")).toBe("/foo/bar");
  });

  test("keeps leading slash for absolute path", () => {
    expect(normalizeClipboardToPath("/page/hogehuga")).toBe("/page/hogehuga");
  });

  test("adds leading slash when missing", () => {
    expect(normalizeClipboardToPath("bar/baz")).toBe("/bar/baz");
  });

  test("preserves query and hash on relative path", () => {
    expect(normalizeClipboardToPath("/page?id=1#sec")).toBe("/page?id=1#sec");
  });

  test("strips origin from absolute https URL", () => {
    expect(normalizeClipboardToPath("https://other-site.com/x/y?q=1#h")).toBe(
      "/x/y?q=1#h"
    );
  });

  test("strips origin from absolute http URL", () => {
    expect(normalizeClipboardToPath("http://example.com/foo")).toBe("/foo");
  });

  test("matches scheme case-insensitively", () => {
    expect(normalizeClipboardToPath("HTTPS://example.com/foo")).toBe("/foo");
  });

  test("absolute URL without path yields slash root", () => {
    expect(normalizeClipboardToPath("https://example.com")).toBe("/");
  });

  test("absolute URL with port preserves path only", () => {
    expect(normalizeClipboardToPath("http://localhost:3000/admin?a=1")).toBe(
      "/admin?a=1"
    );
  });

  test("non-http schemes are treated as relative path text", () => {
    expect(normalizeClipboardToPath("ftp://example.com/x")).toBe(
      "/ftp://example.com/x"
    );
  });
});
