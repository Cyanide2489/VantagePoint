import { describe, it, expect } from "vitest";
import { levelFor } from "./useScoring";

describe("levelFor", () => {
  it("should return the correct level and name for integer scores", () => {
    expect(levelFor(0).name).toBe("不存在");
    expect(levelFor(1).name).toBe("初始");
    expect(levelFor(2).name).toBe("可重複");
    expect(levelFor(3).name).toBe("已定義");
    expect(levelFor(4).name).toBe("已管理");
    expect(levelFor(5).name).toBe("最佳化");
  });

  it("should handle rounding and boundary values", () => {
    expect(levelFor(0.4).name).toBe("不存在");
    expect(levelFor(0.5).name).toBe("初始");
    expect(levelFor(1.4).name).toBe("初始");
    expect(levelFor(1.5).name).toBe("可重複");
    expect(levelFor(4.4).name).toBe("已管理");
    expect(levelFor(4.5).name).toBe("最佳化");
  });

  it("should clamp values outside the 0-5 range", () => {
    expect(levelFor(-1).name).toBe("不存在");
    expect(levelFor(6).name).toBe("最佳化");
    expect(levelFor(100).name).toBe("最佳化");
  });
});
