"""
Periodic cleanup of print-cache PDFs: local directory and (when enabled) S3 mirror.

Run once:  python print_cache_cleanup.py --once
Loop:      python print_cache_cleanup.py   (interval from PRINT_CACHE_CLEANUP_INTERVAL_SECONDS)
"""
from __future__ import annotations

import argparse
import logging
import os
import sys
import time

import inventor
import print_cache_s3
from path_sanitization import safe_file_under_directory
from print_cache_paths import get_print_cache_dir

logger = logging.getLogger(__name__)


def max_age_seconds_from_env() -> int:
    inventor._ensure_dotenv()
    raw = os.environ.get("PRINT_CACHE_MAX_AGE_SECONDS")
    if raw is not None and str(raw).strip() != "":
        return int(raw)
    hours = float(os.environ.get("PRINT_CACHE_MAX_AGE_HOURS", "24"))
    return int(hours * 3600)


def interval_seconds_from_env() -> int:
    inventor._ensure_dotenv()
    return int(os.environ.get("PRINT_CACHE_CLEANUP_INTERVAL_SECONDS", "3600"))


def cleanup_local_print_cache(max_age_seconds: int) -> int:
    """Remove *.pdf files in PRINT_CACHE_DIR older than max_age_seconds. Returns count removed."""
    directory = get_print_cache_dir()
    os.makedirs(directory, exist_ok=True)
    now = time.time()
    removed = 0
    try:
        names = os.listdir(directory)
    except OSError as e:
        logger.warning("Cannot list print-cache dir %s: %s", directory, e)
        return 0

    for name in names:
        if not name.endswith(".pdf"):
            continue
        path_obj = safe_file_under_directory(directory, name)
        if path_obj is None:
            continue
        path = str(path_obj)
        try:
            mtime = os.path.getmtime(path)
            if now - mtime <= max_age_seconds:
                continue
            os.remove(path)
            removed += 1
        except OSError as e:
            logger.warning("Failed to remove %s: %s", path, e)

    return removed


def run_once() -> tuple[int, int]:
    age = max_age_seconds_from_env()
    local_n = cleanup_local_print_cache(age)
    s3_n = print_cache_s3.cleanup_s3_print_cache(age)
    return local_n, s3_n


def main(argv: list[str] | None = None) -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
        stream=sys.stdout,
    )
    parser = argparse.ArgumentParser(description="Print-cache PDF cleanup (local + optional S3)")
    parser.add_argument(
        "--once",
        action="store_true",
        help="Run a single cleanup and exit (default: loop forever)",
    )
    args = parser.parse_args(argv)

    if args.once:
        local_n, s3_n = run_once()
        logger.info("cleanup done: local_removed=%s s3_removed=%s", local_n, s3_n)
        return 0

    interval = max(1, interval_seconds_from_env())
    logger.info(
        "print-cache cleanup loop: interval=%ss max_age=%ss",
        interval,
        max_age_seconds_from_env(),
    )
    while True:
        try:
            local_n, s3_n = run_once()
            logger.info("cleanup: local_removed=%s s3_removed=%s", local_n, s3_n)
        except Exception:
            logger.exception("cleanup run failed")
        time.sleep(interval)


if __name__ == "__main__":
    raise SystemExit(main())
