import os
import time
from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock


def test_cleanup_local_removes_stale_pdf(tmp_path, monkeypatch):
    monkeypatch.setenv("PRINT_CACHE_DIR", str(tmp_path))
    p = tmp_path / "stale.pdf"
    p.write_bytes(b"%PDF")
    old = time.time() - 10_000
    os.utime(p, (old, old))

    from print_cache_cleanup import cleanup_local_print_cache

    assert cleanup_local_print_cache(3600) == 1
    assert not p.exists()


def test_cleanup_local_keeps_recent_pdf(tmp_path, monkeypatch):
    monkeypatch.setenv("PRINT_CACHE_DIR", str(tmp_path))
    p = tmp_path / "fresh.pdf"
    p.write_bytes(b"%PDF")

    from print_cache_cleanup import cleanup_local_print_cache

    assert cleanup_local_print_cache(3600) == 0
    assert p.exists()


def test_cleanup_s3_returns_zero_when_disabled(monkeypatch):
    monkeypatch.delenv("PRINT_CACHE_S3_ENABLED", raising=False)
    from print_cache_s3 import cleanup_s3_print_cache

    assert cleanup_s3_print_cache(3600) == 0


def test_cleanup_s3_deletes_only_stale_objects(monkeypatch):
    monkeypatch.setenv("PRINT_CACHE_S3_ENABLED", "true")
    monkeypatch.setenv("PRINT_CACHE_S3_BUCKET", "buck")
    monkeypatch.setenv("AWS_REGION", "us-east-1")

    import boto3

    stale = datetime.now(timezone.utc) - timedelta(days=7)
    fresh = datetime.now(timezone.utc) - timedelta(minutes=1)

    mock_client = MagicMock()
    mock_paginator = MagicMock()
    mock_client.get_paginator.return_value = mock_paginator
    mock_paginator.paginate.return_value = [
        {
            "Contents": [
                {"Key": "print-cache/stale.pdf", "LastModified": stale},
                {"Key": "print-cache/fresh.pdf", "LastModified": fresh},
                {"Key": "print-cache/readme.txt", "LastModified": stale},
            ]
        }
    ]
    deleted = []
    mock_client.delete_object.side_effect = lambda **kw: deleted.append(kw["Key"])

    mock_sess = MagicMock()
    mock_sess.client.return_value = mock_client
    monkeypatch.setattr(boto3.session, "Session", lambda: mock_sess)

    from print_cache_s3 import cleanup_s3_print_cache

    n = cleanup_s3_print_cache(3600)
    assert n == 1
    assert deleted == ["print-cache/stale.pdf"]
