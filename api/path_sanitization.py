"""Helpers to prevent path traversal when resolving user- or config-influenced paths."""
from __future__ import annotations

import os
from pathlib import Path


def safe_file_under_directory(directory: str | os.PathLike[str], filename: str) -> Path | None:
    """
    Return a resolved Path to directory/filename only if the result stays under directory.
    Returns None if traversal is detected or the path is not a regular file.
    """
    try:
        base = Path(directory).resolve()
        candidate = (base / filename).resolve()
        candidate.relative_to(base)
    except ValueError:
        return None
    except OSError:
        return None
    if not candidate.is_file():
        return None
    return candidate


def safe_local_wordlist_path(configured: str) -> Path:
    """
    Resolve a local wordlist path from config. Relative paths must not escape the current
    working directory; absolute paths are allowed (operator-controlled).
    """
    if not configured or not str(configured).strip():
        raise ValueError("Local wordlist path is not set")
    p = Path(configured)
    if p.is_absolute():
        resolved = p.resolve()
    else:
        cwd = Path.cwd().resolve()
        resolved = (cwd / configured).resolve()
        try:
            resolved.relative_to(cwd)
        except ValueError as e:
            raise ValueError(
                "Local wordlist path must not escape the working directory"
            ) from e
    if not resolved.is_file():
        raise FileNotFoundError(f"Wordlist not found: {resolved}")
    return resolved
