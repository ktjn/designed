import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "./use-copy-to-clipboard";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it("exposes copy feedback to a caller without a CopyButton", async () => {
  vi.useFakeTimers();
  const error = new Error("Clipboard denied");
  const writeText = vi
    .fn()
    .mockResolvedValueOnce(undefined)
    .mockRejectedValueOnce(error);
  vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
  const { result } = renderHook(() => useCopyToClipboard(1000));

  expect(result.current.state).toBe("idle");
  await act(async () => {
    await expect(result.current.copy("value")).resolves.toEqual({
      ok: true,
      value: "value",
    });
  });
  expect(writeText).toHaveBeenCalledWith("value");
  expect(result.current.state).toBe("copied");

  await act(async () => {
    await expect(result.current.copy("retry")).resolves.toEqual({
      ok: false,
      error,
    });
  });
  expect(result.current.state).toBe("error");

  await act(() => vi.advanceTimersByTimeAsync(1000));
  expect(result.current.state).toBe("idle");
});
