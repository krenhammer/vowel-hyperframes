"""Render a voiceover script (markdown) to WAV with Kokoro-82M (hexgrad/Kokoro-82M).

Lines default to the **narrator** voice (default: British English male). A line whose
text ends with ``<AI voice>`` (case-insensitive) is spoken with the **AI** voice; the
tag is stripped before TTS. Default AI voice is ``af_heart`` (American English); the
narrator uses British ``bm_lewis`` with ``lang_code b``, and the AI uses ``lang_code a``.

Requires:
  pip install -r tts-utilities/requirements-kokoro.txt
  # or: pip install kokoro>=0.9.4 soundfile
  # Linux: espeak-ng for English G2P fallback (Arch: pacman -S espeak-ng)

Usage (from workspace root):
  python tts-utilities/kokoro_script.py path/to/script.md
  python tts-utilities/kokoro_script.py script.md -o /path/to/out.wav
  python tts-utilities/kokoro_script.py script.md -o out.wav --voice-narrator bm_fable --voice-ai am_fenrir

Default output: ``tts-utilities/output/<input-stem>.wav`` (use ``-o`` to override).

See https://github.com/hexgrad/kokoro and https://huggingface.co/hexgrad/Kokoro-82M for voices.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Any, Literal

# ``kokoro_script.py`` lives in ``tts-utilities/`` at the workspace root.
_TTS_UTIL_DIR = Path(__file__).resolve().parent
_DEFAULT_AUDIO_DIR = _TTS_UTIL_DIR / "output"

Role = Literal["narrator", "ai"]

# Line ends with <AI voice> (flexible whitespace, case-insensitive).
_RE_AI_TAG = re.compile(r"\s*<AI\s+voice>\s*$", re.IGNORECASE)

# Kokoro outputs 24 kHz float audio.
_SAMPLE_RATE = 24_000


def strip_markdown_for_speech(text: str) -> str:
    """Remove common markdown so TTS reads natural language, not markup.

    Strips: ``**bold**``, ``[label](url)`` → label, leading ``#`` heading markers.
    """
    s = text.strip()
    if not s:
        return ""
    # ATX headings: ## Title → Title
    s = re.sub(r"^#{1,6}\s+", "", s)
    # Bold / italic (single pass, non-greedy)
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"\*(.+?)\*", r"\1", s)
    # Markdown links [text](url) → text
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    return s.strip()


def parse_script_lines(raw: str) -> list[tuple[Role, str]]:
    """Split markdown into non-empty lines; assign narrator vs AI by trailing tag."""
    out: list[tuple[Role, str]] = []
    for line in raw.splitlines():
        role: Role = "narrator"
        work = line.rstrip()
        if _RE_AI_TAG.search(work):
            work = _RE_AI_TAG.sub("", work).rstrip()
            role = "ai"
        spoken = strip_markdown_for_speech(work)
        if not spoken:
            continue
        out.append((role, spoken))
    return out


def _load_text(path: Path | None, inline: str | None) -> str:
    if path is not None:
        return path.read_text(encoding="utf-8")
    if inline is not None:
        return inline
    raise ValueError("either input or --text is required")


def _concat_with_gaps(
    segments: list[tuple[Role, Any]],
) -> Any:
    import numpy as np

    if not segments:
        return np.array([], dtype=np.float32)
    gap_s = 0.22
    gap = int(gap_s * _SAMPLE_RATE)
    gap_buf = np.zeros(gap, dtype=np.float32)
    parts: list[object] = []
    for i, (_role, audio) in enumerate(segments):
        a = np.asarray(audio, dtype=np.float32).reshape(-1)
        if a.size:
            parts.append(a)
        if i < len(segments) - 1 and a.size:
            parts.append(gap_buf)
    if not parts:
        return np.array([], dtype=np.float32)
    return np.concatenate(parts) if len(parts) > 1 else parts[0]


def render_kokoro(
    segments: list[tuple[Role, str]],
    *,
    voice_narrator: str,
    voice_ai: str,
    lang_narrator: str,
    lang_ai: str,
    speed: float,
) -> Any:
    """Run Kokoro-82M on each segment; return one float32 1D numpy array at 24 kHz.

    Uses a separate :class:`KPipeline` per role so e.g. British ``bm_*`` + American
    ``af_*`` voices can each use the correct ``lang_code`` (``b`` vs ``a``).
    """
    try:
        from kokoro import KPipeline
    except ImportError as e:
        raise SystemExit(
            "Missing dependency: pip install -r tts-utilities/requirements-kokoro.txt\n"
            "Or: pip install 'kokoro>=0.9.4' soundfile"
        ) from e

    import numpy as np

    pipe_narr = KPipeline(lang_code=lang_narrator)
    pipe_ai = KPipeline(lang_code=lang_ai)
    # Per segment: all chunks from the generator (long lines may split internally).
    built: list[tuple[Role, Any]] = []
    for role, text in segments:
        voice = voice_ai if role == "ai" else voice_narrator
        pipeline = pipe_ai if role == "ai" else pipe_narr
        chunks: list[object] = []
        for _gs, _ps, audio in pipeline(
            text,
            voice=voice,
            speed=speed,
            # One utterance per segment; newlines in ``text`` still split (per Kokoro defaults).
            split_pattern=r"\n+",
        ):
            chunks.append(np.asarray(audio, dtype=np.float32).reshape(-1))
        if chunks:
            seg_audio = (
                np.concatenate(chunks) if len(chunks) > 1 else chunks[0]
            )
            built.append((role, seg_audio))
    return _concat_with_gaps(built)


def main() -> None:
    ap = argparse.ArgumentParser(
        description="Synthesize a markdown voiceover script with Kokoro-82M (two voices: narrator + AI).",
    )
    ap.add_argument(
        "input",
        nargs="?",
        type=Path,
        help="Path to a .md script (or omit and use --text)",
    )
    ap.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help=(
            "Output path for a single combined .wav. "
            "If omitted, writes to tts-utilities/output/<input-stem>.wav under the workspace "
            "(or voiceover.wav there when using --text only)."
        ),
    )
    ap.add_argument(
        "--text",
        type=str,
        default=None,
        help="Inline script text instead of a file (for quick tests).",
    )
    ap.add_argument(
        "--voice-narrator",
        type=str,
        default="bm_lewis",
        help="Kokoro voice id for normal lines (default: bm_lewis, British English male).",
    )
    ap.add_argument(
        "--voice-ai",
        type=str,
        default="af_heart",
        help="Kokoro voice id for lines ending with <AI voice> (default: af_heart).",
    )
    ap.add_argument(
        "--lang-narrator",
        type=str,
        default="b",
        help="Kokoro language code for the narrator voice (default: b = British English).",
    )
    ap.add_argument(
        "--lang-ai",
        type=str,
        default="a",
        help="Kokoro language code for the AI voice (default: a = American English).",
    )
    ap.add_argument(
        "--speed",
        type=float,
        default=1.0,
        help="Speech speed (default: 1.0).",
    )
    ap.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse and print segments only; do not load models or write audio.",
    )
    args = ap.parse_args()

    if not args.input and not args.text:
        ap.error("provide INPUT.md or --text")

    if args.input is not None:
        inp = args.input.expanduser().resolve()
        if not inp.exists():
            sys.exit(f"input not found: {inp}")
        raw = inp.read_text(encoding="utf-8")
        default_out = _DEFAULT_AUDIO_DIR / f"{inp.stem}.wav"
    else:
        raw = args.text  # type: ignore[assignment]
        default_out = _DEFAULT_AUDIO_DIR / "voiceover.wav"

    if args.output is None:
        args.output = default_out

    segments = parse_script_lines(raw)
    if not segments:
        sys.exit("no speakable lines after parsing (empty file or only markup?)")

    n_narr = sum(1 for r, _ in segments if r == "narrator")
    n_ai = sum(1 for r, _ in segments if r == "ai")
    print(
        f"segments: {len(segments)} (narrator={n_narr}, ai={n_ai})",
        flush=True,
    )

    if args.dry_run:
        for i, (role, text) in enumerate(segments):
            preview = text if len(text) <= 120 else text[:117] + "..."
            print(f"  {i:04d} [{role:8s}] {preview}", flush=True)
        return

    audio = render_kokoro(
        segments,
        voice_narrator=args.voice_narrator,
        voice_ai=args.voice_ai,
        lang_narrator=args.lang_narrator,
        lang_ai=args.lang_ai,
        speed=args.speed,
    )

    import soundfile as sf  # type: ignore[import-untyped]

    out = args.output.expanduser().resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(out), audio, _SAMPLE_RATE)
    print(out, flush=True)


if __name__ == "__main__":
    main()
