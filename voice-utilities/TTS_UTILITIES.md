# TTS utilities (Kokoro)

This repo uses **[Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M)** — a small open-weights TTS model — for **markdown voiceover scripts** that power web UI demos and similar assets. Implementation lives in [`helpers/kokoro_script.py`](helpers/kokoro_script.py).

Upstream references: [hexgrad/kokoro on GitHub](https://github.com/hexgrad/kokoro), [model card on Hugging Face](https://huggingface.co/hexgrad/Kokoro-82M) (voice IDs and language codes).

## Why Kokoro here

- **No cloud API** required for this path (unlike ElevenLabs for transcription in other helpers).
- **Two roles in one script**: a default **narrator** line and an **AI** line, toggled in markdown so one pass produces a single combined WAV.
- Output is **24 kHz mono float → written as WAV** via `soundfile`, with a short **silence gap (~0.22 s)** between segments.

## Setup

From the **`utility/`** directory (same pattern as other helpers: use `uv run` so the project venv is used):

```bash
cd utility
uv sync --extra kokoro
```

Optional dependencies are declared in [`pyproject.toml`](pyproject.toml) as the `kokoro` extra (`kokoro>=0.9.4`, `soundfile`).

**Linux:** install **espeak-ng** for English G2P fallback (e.g. Arch: `pacman -S espeak-ng`). The `kokoro_script.py` docstring notes this requirement.

## Running the script

```bash
cd utility
uv run python helpers/kokoro_script.py ../ui/public/scripts/your-script.md
```

- **Default output:** `ui/public/audio/<script-stem>.wav` under the repo root (override with `-o`).
- **Inline text:** omit the file and use `--text '...'`; default output name is `voiceover.wav` in the same audio folder.

Useful flags (see `helpers/kokoro_script.py --help` for the full list):

| Flag | Role |
|------|------|
| `--voice-narrator` | Kokoro voice ID for normal lines (default `bm_lewis`, British English male) |
| `--voice-ai` | Voice for AI-tagged lines (default `af_heart`) |
| `--lang-narrator` / `--lang-ai` | Kokoro `lang_code` per pipeline (defaults `b` and `a`) |
| `--speed` | Speech speed multiplier (default `1.0`) |
| `--dry-run` | Parse markdown and print segments; no model load, no WAV |

## Markdown format

- **Non-empty lines** become TTS segments (after stripping trivial markdown).
- **Narrator:** any line that does **not** end with the AI tag.
- **AI voice:** a line whose text **ends with** `<AI voice>` (whitespace-flexible, case-insensitive). The tag is removed before synthesis.

**Stripped for speech:** ATX heading `#` markers, `**bold**` / `*italic*`, and links `[label](url)` → spoken as `label`.

## Pipeline details

- Two [`KPipeline`](https://github.com/hexgrad/kokoro) instances (narrator vs AI) so **British** and **American** style voices can use different `lang_code` in one run.
- Each segment is synthesized with the appropriate voice; chunks from Kokoro’s generator are concatenated, then segments are joined with a fixed gap.
- This path is **independent** of `transcribe_to_json.py` / `transcribe.py` (those use ElevenLabs Scribe or local WhisperX). Typical workflow: write script → `kokoro_script.py` → optional `transcribe_to_json.py` on the WAV for word-level JSON captions.

## Related paths in the repo

| Path | Purpose |
|------|---------|
| `ui/public/scripts/*.md` | Source voiceover copy |
| `ui/public/audio/*.wav` | Kokoro (and other) exports |
| `helpers/kokoro_script.py` | CLI + `render_kokoro()` / parsing |
