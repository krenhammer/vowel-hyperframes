# Transcription utilities

Transcription in this project produces **word-level** JSON in a **Scribe-compatible** shape: `text`, `words` (with `type`, `text`, `start`, `end`, optional `speaker_id`, etc.), so `render.py`, `timeline_view.py`, `pack_transcripts.py`, and the UI can consume the same format whether the backend is cloud or local.

## Requirements

- **`ffmpeg`** on `PATH` (extracts mono 16 kHz PCM for the ASR path).

## Backends (pick one per run)

1. **ElevenLabs Scribe** — set `ELEVENLABS_API_KEY` in the environment or in `.env` (see `helpers/transcribe.py` / `utility/.env.example`). Used when a non-empty key is found. Scribe can diarize, tag audio events, and return word timestamps.

2. **Local WhisperX** — if the key is **missing** or **empty**, the same scripts use **WhisperX** on your machine. Install optional deps from `utility/`:

   ```bash
   cd utility
   uv sync --extra local-transcription
   ```

   Optional: `HF_TOKEN` (or `HUGGINGFACE_TOKEN`) for speaker diarization with Hugging Face–hosted models, as described in `helpers/transcribe.py` and `.env.example`.

**Always run Python from the `utility` environment** so `torch` / WhisperX resolve correctly:

```bash
cd utility
uv run python helpers/<script>.py ...
```

Do not rely on a global `python3` unless it is that same venv.

## Scripts

| Script | Purpose |
|--------|---------|
| **`helpers/transcribe.py`** | One media file → `<edit_dir>/transcripts/<stem>.json` (default edit dir next to the video). For the main “drop footage, edit” workflow. |
| **`helpers/transcribe_to_json.py`** | One file → **any** output path; default is `../ui/public/transcriptions/<stem>.json` for web/demo assets. Same ASR pipeline as `transcribe.py`, different layout. |
| **`helpers/transcribe_batch.py`** | Parallel batch over a directory of videos. |

## Usage examples

**Edit workflow (default paths):**

```bash
cd utility
uv run python helpers/transcribe.py /path/to/clip.mp4
```

**Fixed JSON path (e.g. for `ui/public`):**

```bash
cd utility
uv run python helpers/transcribe_to_json.py ../ui/public/audio/demo.wav
# or explicit output:
uv run python helpers/transcribe_to_json.py ../ui/public/audio/demo.wav ../ui/public/transcriptions/demo.json
```

**Options (where supported by the active backend):**

- `--language en` — language hint (especially useful for local WhisperX).
- `--num-speakers N` — when diarization is available.

## Caching

If the **target JSON file already exists**, the helpers **skip** re-transcription and exit (see `transcribe.py` / `transcribe_to_json.py`). Delete the JSON to force a full rerun.

## More detail

- `helpers/README.transcribe_to_json.md` — CLI reference for the single-file → arbitrary JSON path helper.
- **TTS_UTILITIES.md** — Kokoro text-to-speech (separate from transcription).
