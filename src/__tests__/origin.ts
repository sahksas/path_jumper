import { extractOrigin } from "../origin";

describe("extractOrigin", () => {
  test("returns null for undefined", () => {
    expect(extractOrigin(undefined)).toBeNull();
  });

  test("returns null for null", () => {
    expect(extractOrigin(null)).toBeNull();
  });

  test("returns null for empty string", () => {
    expect(extractOrigin("")).toBeNull();
  });

  test("returns null for malformed URL", () => {
    expect(extractOrigin("not a url")).toBeNull();
  });

  test("extracts https origin", () => {
    expect(extractOrigin("https://example.com/foo")).toBe("https://example.com");
  });

  test("preserves http origin with non-default port", () => {
    expect(extractOrigin("http://localhost:8080/old")).toBe(
      "http://localhost:8080"
    );
  });

  test("preserves http origin with three-digit port", () => {
    expect(extractOrigin("http://localhost:800/old")).toBe(
      "http://localhost:800"
    );
  });

  test("preserves https origin with non-default port", () => {
    expect(extractOrigin("https://example.com:8443/x")).toBe(
      "https://example.com:8443"
    );
  });

  test("strips default http port (80)", () => {
    expect(extractOrigin("http://example.com:80/x")).toBe("http://example.com");
  });

  test("strips default https port (443)", () => {
    expect(extractOrigin("https://example.com:443/x")).toBe(
      "https://example.com"
    );
  });

  test("returns null for about:blank (origin is opaque)", () => {
    expect(extractOrigin("about:blank")).toBeNull();
  });
});
