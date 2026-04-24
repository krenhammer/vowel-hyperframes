/**
 * Reusable “RAG debug button” style background: a rotated grid of circular frames,
 * each showing the same image, with optional independent press-bounce animation.
 *
 * @example
 * ```ts
 * import { AnimatedImageBackground } from "./AnimatedImageBackground";
 * const bg = new AnimatedImageBackground("#wrap", {
 *   imageSrc: "logo.png",
 *   angleDeg: -45,
 *   cellMaxPx: 184,
 *   pressAnimation: "random",
 *   seed: 0x5a7e1c3f,
 * });
 * ```
 *
 * In HTML, link `AnimatedImageBackground.css` in `<head>`.
 */

/** Deterministic PRNG — safe for fixed renders (e.g. HyperFrames) where Math.random is disallowed. */
function mulberry32(seed: number): () => number {
  let t = seed;
  return function () {
    t = (t + 0x6d2b79f5) | 0;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * How each cell’s press animation is scheduled.
 * - `random` — per-cell delay and period from a deterministic PRNG (`seed`)
 * - `stagger` — delay scales with grid index (wave), same period
 * - `off` — no press keyframes, static grid only
 */
export type AnimatedImagePressMode = "random" | "stagger" | "off";

export interface AnimatedImageBackgroundOptions {
  /** URL for the image inside every circular “button” (required). */
  imageSrc: string;
  /**
   * Rotation of the entire grid, in degrees (default `-45`, matching the Turso RAG block).
   */
  angleDeg?: number;
  /**
   * Max diameter of each ring (CSS length). Sets `--aib-cell-max`. Use a string like
   * `"min(10.4rem, 100%)"` or `"120px"`.
   */
  cellSize?: string;
  /**
   * Second cap on ring width/height (CSS length). Maps to `--aib-cell-cap` (default `184px`).
   * Lower this if the grid should show smaller “buttons” overall.
   */
  cellMaxCap?: string;
  /**
   * Minimum width/height of each ring. Default `80px`.
   */
  minCellSize?: string;
  /**
   * Side length of the centered square that gets rotated and clipped (default `280vmin`).
   */
  rotorSize?: string;
  /**
   * Grid dimensions (default `9` × `16` like the video composition).
   */
  columns?: number;
  rows?: number;
  /** Solid fill behind the pattern. */
  backgroundColor?: string;
  /** Ring stroke color. */
  ringColor?: string;
  /** Optional tint for the image’s drop-shadow (CSS color). */
  accentColor?: string;
  /**
   * `true` (default): circular “button” frames and optional `aib-btn-press` (see `pressAnimation`).
   * `false`: no button/press; plain tiles, 2× image size, and slow alternating **row** marquee scroll.
   */
  hasButton?: boolean;
  /**
   * When `hasButton` is false: each row’s horizontal scroll period is picked in
   * `[rowMarqueeSecMin, rowMarqueeSecMax]` seconds (per row, from `seed`).
   */
  rowMarqueeSecMin?: number;
  rowMarqueeSecMax?: number;
  /**
   * When not `off`, each ring runs the `aib-btn-press` loop.
   * `random` uses `seed` for repeatable “chaotic” timing; `stagger` uses index-based delay.
   * Ignored when `hasButton` is false (treated as `off`).
   */
  pressAnimation?: AnimatedImagePressMode;
  /**
   * Seed for `pressAnimation: "random"` (default `0x5a7e1c3f`).
   */
  seed?: number;
  /**
   * For `random`: each cell’s period is in `[periodMin, periodMax]` seconds.
   * Default min `5`, max `9.5` (same spirit as 5.0 + rnd * 4.5).
   */
  periodRangeSec?: { min: number; max: number };
  /**
   * For `random`: initial delay in `[-16, 0)` seconds (scaled by -rnd * 16 in the original).
   */
  maxNegativeDelaySec?: number;
  /**
   * For `stagger`: seconds between neighbor cells (delay = index * step).
   */
  staggerStepSec?: number;
  /**
   * For `stagger`: shared animation period in seconds.
   */
  staggerPeriodSec?: number;
  /** `alt` for each `<img>` (default empty for decorative). */
  imageAlt?: string;
  /** Optional class on the root `.aib` for your layout. */
  className?: string;
}

const DEFAULTS = {
  angleDeg: -45,
  cellSize: "min(10.4rem, 100%)",
  cellMaxCap: "184px",
  minCellSize: "80px",
  rotorSize: "280vmin",
  columns: 9,
  rows: 16,
  backgroundColor: "#0a1612",
  ringColor: "rgba(15, 208, 110, 0.42)",
  accentColor: "#0fd06e",
  hasButton: true,
  rowMarqueeSecMin: 70,
  rowMarqueeSecMax: 120,
  pressAnimation: "random" as AnimatedImagePressMode,
  seed: 0x5a7e1c3f,
  periodRangeSec: { min: 5, max: 9.5 },
  maxNegativeDelaySec: 16,
  staggerStepSec: 0.12,
  staggerPeriodSec: 6.5,
  imageAlt: "",
} satisfies Partial<AnimatedImageBackgroundOptions>;

/**
 * Builds and manages a full-bleed animated image grid in a host element.
 */
type ResolvedOptions = Readonly<
  Required<Pick<AnimatedImageBackgroundOptions, "imageSrc">> &
    typeof DEFAULTS &
    Required<Pick<AnimatedImageBackgroundOptions, "hasButton" | "rowMarqueeSecMin" | "rowMarqueeSecMax">> & {
      className: string;
      pressAnimation: AnimatedImagePressMode;
    }
>;

export class AnimatedImageBackground {
  private readonly root: HTMLDivElement;
  private readonly options: ResolvedOptions;
  private currentSrc: string;

  public constructor(
    host: HTMLElement | string,
    options: AnimatedImageBackgroundOptions
  ) {
    if (!options?.imageSrc) {
      throw new Error("AnimatedImageBackground: imageSrc is required");
    }

    this.currentSrc = options.imageSrc;
    const hasButton = options.hasButton ?? DEFAULTS.hasButton;
    const pressAnimation: AnimatedImagePressMode = hasButton
      ? options.pressAnimation ?? DEFAULTS.pressAnimation
      : "off";
    this.options = {
      imageSrc: options.imageSrc,
      angleDeg: options.angleDeg ?? DEFAULTS.angleDeg,
      cellSize: options.cellSize ?? DEFAULTS.cellSize,
      cellMaxCap: options.cellMaxCap ?? DEFAULTS.cellMaxCap,
      minCellSize: options.minCellSize ?? DEFAULTS.minCellSize,
      rotorSize: options.rotorSize ?? DEFAULTS.rotorSize,
      columns: options.columns ?? DEFAULTS.columns,
      rows: options.rows ?? DEFAULTS.rows,
      backgroundColor: options.backgroundColor ?? DEFAULTS.backgroundColor,
      ringColor: options.ringColor ?? DEFAULTS.ringColor,
      accentColor: options.accentColor ?? DEFAULTS.accentColor,
      hasButton,
      rowMarqueeSecMin: options.rowMarqueeSecMin ?? DEFAULTS.rowMarqueeSecMin,
      rowMarqueeSecMax: options.rowMarqueeSecMax ?? DEFAULTS.rowMarqueeSecMax,
      pressAnimation,
      seed: options.seed ?? DEFAULTS.seed,
      periodRangeSec: options.periodRangeSec ?? DEFAULTS.periodRangeSec,
      maxNegativeDelaySec: options.maxNegativeDelaySec ?? DEFAULTS.maxNegativeDelaySec,
      staggerStepSec: options.staggerStepSec ?? DEFAULTS.staggerStepSec,
      staggerPeriodSec: options.staggerPeriodSec ?? DEFAULTS.staggerPeriodSec,
      imageAlt: options.imageAlt ?? DEFAULTS.imageAlt,
      className: options.className ?? "",
    };

    this.root = document.createElement("div");
    this.root.className = "aib" + (this.options.className ? " " + this.options.className : "");
    if (!this.options.hasButton) {
      this.root.classList.add("aib--no-button");
    }
    this.applyCustomProperties();
    if (this.options.hasButton) {
      this.buildGrid();
    } else {
      this.buildRowMarqueeGrid();
    }

    const el = typeof host === "string" ? document.querySelector<HTMLElement>(host) : host;
    if (!el) {
      throw new Error("AnimatedImageBackground: host element not found");
    }
    el.appendChild(this.root);
  }

  /**
   * The outer container (`.aib`) — for GSAP, sizing, or z-index in your layout.
   */
  public get element(): HTMLDivElement {
    return this.root;
  }

  /**
   * Replaces the image URL on every cell and updates `img.src`.
   */
  public setImageSrc(src: string): void {
    this.currentSrc = src;
    this.root.querySelectorAll<HTMLImageElement>(".aib__img").forEach((img) => {
      img.src = src;
    });
  }

  /** Detaches the component from the DOM. */
  public destroy(): void {
    this.root.remove();
  }

  private applyCustomProperties(): void {
    const o = this.options;
    this.root.style.setProperty("--aib-angle", `${o.angleDeg}deg`);
    this.root.style.setProperty("--aib-bg", o.backgroundColor);
    this.root.style.setProperty("--aib-ring", o.ringColor);
    this.root.style.setProperty("--aib-accent", o.accentColor);
    this.root.style.setProperty("--aib-cell-max", o.cellSize);
    this.root.style.setProperty("--aib-cell-cap", o.cellMaxCap);
    this.root.style.setProperty("--aib-cell-min", o.minCellSize);
    this.root.style.setProperty("--aib-rotor", o.rotorSize);
    this.root.style.setProperty("--aib-grid-cols", String(o.columns));
    this.root.style.setProperty("--aib-grid-rows", String(o.rows));
  }

  private buildGrid(): void {
    const o = this.options;
    if (o.pressAnimation !== "off") {
      this.root.classList.add("aib--press");
    } else {
      this.root.classList.remove("aib--press");
    }

    const rnd = o.pressAnimation === "random" ? mulberry32(o.seed) : null;
    const pr = o.periodRangeSec;
    const maxNeg = o.maxNegativeDelaySec;

    const rotor = document.createElement("div");
    rotor.className = "aib__rotor";

    const grid = document.createElement("div");
    grid.className = "aib__grid";

    let index = 0;
    for (let r = 0; r < o.rows; r++) {
      for (let c = 0; c < o.columns; c++) {
        const cell = document.createElement("div");
        cell.className = "aib__cell";

        const ring = document.createElement("div");
        ring.className = "aib__ring";

        if (o.pressAnimation === "random" && rnd) {
          const delayS = -rnd() * maxNeg;
          const periodS = pr.min + rnd() * (pr.max - pr.min);
          ring.style.setProperty("--aib-btn-delay", `${delayS}s`);
          ring.style.setProperty("--aib-btn-period", `${periodS}s`);
        } else if (o.pressAnimation === "stagger") {
          const delayS = index * o.staggerStepSec;
          ring.style.setProperty("--aib-btn-delay", `${delayS}s`);
          ring.style.setProperty("--aib-btn-period", `${o.staggerPeriodSec}s`);
        }

        const img = document.createElement("img");
        img.className = "aib__img";
        img.src = this.currentSrc;
        img.alt = o.imageAlt;
        img.setAttribute("draggable", "false");
        img.decoding = "async";
        if (!o.imageAlt) {
          img.setAttribute("aria-hidden", "true");
        }

        ring.appendChild(img);
        cell.appendChild(ring);
        grid.appendChild(cell);
        index += 1;
      }
    }

    rotor.appendChild(grid);
    this.root.appendChild(rotor);
  }

  /**
   * No-“button” mode: duplicated horizontal chunks per row, slow `translate3d` loop;
   * odd and even rows use opposite `animation-direction` (`.aib__mrow--alt`).
   */
  private buildRowMarqueeGrid(): void {
    const o = this.options;
    const rnd = mulberry32(o.seed ^ 0x2d4e6f01);
    let prLo = o.rowMarqueeSecMin;
    let prHi = o.rowMarqueeSecMax;
    if (prHi < prLo) {
      prHi = prLo;
    }

    const rotor = document.createElement("div");
    rotor.className = "aib__rotor aib__rotor--marquee";
    const wrap = document.createElement("div");
    wrap.className = "aib__marquee";

    const makeImageCell = (): HTMLDivElement => {
      const cell = document.createElement("div");
      cell.className = "aib__cell aib__mcell";
      const ring = document.createElement("div");
      ring.className = "aib__ring";
      const img = document.createElement("img");
      img.className = "aib__img";
      img.src = this.currentSrc;
      img.alt = o.imageAlt;
      img.setAttribute("draggable", "false");
      img.decoding = "async";
      if (!o.imageAlt) {
        img.setAttribute("aria-hidden", "true");
      }
      ring.appendChild(img);
      cell.appendChild(ring);
      return cell;
    };

    for (let r = 0; r < o.rows; r++) {
      const mrow = document.createElement("div");
      mrow.className = "aib__mrow" + (r % 2 ? " aib__mrow--alt" : "");
      const periodS = prLo + rnd() * (prHi - prLo);
      mrow.style.setProperty("--aib-mrow-sec", `${periodS}s`);

      const mtrack = document.createElement("div");
      mtrack.className = "aib__mtrack";

      for (let half = 0; half < 2; half++) {
        const mchunk = document.createElement("div");
        mchunk.className = "aib__mchunk";
        if (half === 1) {
          mchunk.setAttribute("aria-hidden", "true");
        }
        for (let c = 0; c < o.columns; c++) {
          mchunk.appendChild(makeImageCell());
        }
        mtrack.appendChild(mchunk);
      }

      mrow.appendChild(mtrack);
      wrap.appendChild(mrow);
    }

    rotor.appendChild(wrap);
    this.root.appendChild(rotor);
  }
}
