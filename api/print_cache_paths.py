"""Shared print-cache directory (API uploads and cleanup service)."""
from __future__ import annotations

import os


def get_print_cache_dir() -> str:
    root = os.path.dirname(os.path.abspath(__file__))
    return os.environ.get("PRINT_CACHE_DIR", os.path.join(root, "print_cache"))
