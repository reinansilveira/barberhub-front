import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useBodyScrollLock } from "./use-body-scroll-lock";
import { useEscapeKey } from "./use-escape-key";
import { useImageError } from "./use-image-error";
import { useOutsideClick } from "./use-outside-click";

describe("useEscapeKey", () => {
  it("chama o callback mais recente só quando habilitado", () => {
    const first = vi.fn();
    const latest = vi.fn();
    const { rerender } = renderHook(
      ({ callback, enabled }) => useEscapeKey(callback, enabled),
      { initialProps: { callback: first, enabled: false } },
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(first).not.toHaveBeenCalled();

    rerender({ callback: latest, enabled: true });
    fireEvent.keyDown(window, { key: "Enter" });
    fireEvent.keyDown(window, { key: "Escape" });

    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledTimes(1);
  });
});

function OutsideClickProbe({ onOutside }: { onOutside: () => void }) {
  const ref = useOutsideClick(onOutside);
  return (
    <>
      <div ref={ref}>
        <button type="button">dentro</button>
      </div>
      <button type="button">fora</button>
    </>
  );
}

describe("useOutsideClick", () => {
  it("dispara apenas para cliques fora do container", () => {
    const onOutside = vi.fn();
    render(<OutsideClickProbe onOutside={onOutside} />);

    fireEvent.mouseDown(screen.getByRole("button", { name: "dentro" }));
    expect(onOutside).not.toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByRole("button", { name: "fora" }));
    expect(onOutside).toHaveBeenCalledTimes(1);
  });
});

describe("useBodyScrollLock", () => {
  it("trava o scroll e restaura o valor anterior", () => {
    document.body.style.overflow = "auto";
    const { rerender, unmount } = renderHook(
      ({ locked }) => useBodyScrollLock(locked),
      { initialProps: { locked: true } },
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender({ locked: false });
    expect(document.body.style.overflow).toBe("auto");

    rerender({ locked: true });
    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });
});

describe("useImageError", () => {
  it("marca a imagem como quebrada quando ela falha", () => {
    const { result } = renderHook(() => useImageError());

    expect(result.current.failed).toBe(false);
    act(() => result.current.onError());
    expect(result.current.failed).toBe(true);
  });
});
