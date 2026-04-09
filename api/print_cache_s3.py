"""
Optional S3 upload for print-cache PDFs. Controlled via environment variables (see env.example).
"""
from __future__ import annotations

import logging
import os
from datetime import datetime, timezone

import inventor

logger = logging.getLogger(__name__)


def _truthy(value: str | None) -> bool:
    if value is None:
        return False
    return str(value).strip().lower() in ("1", "true", "yes", "on")


def is_s3_enabled() -> bool:
    inventor._ensure_dotenv()
    return _truthy(os.environ.get("PRINT_CACHE_S3_ENABLED"))


def _normalize_prefix(raw: str | None) -> str:
    p = (raw or "print-cache").strip().strip("/")
    return f"{p}/"


def upload_print_cache_pdf(local_path: str, filename: str) -> str:
    """
    Upload a PDF to S3. Returns an HTTPS URL: presigned GET by default, or a public URL
    when PRINT_CACHE_S3_PUBLIC_BASE_URL is set (no trailing slash on the base).
    """
    import boto3
    from botocore.exceptions import BotoCoreError, ClientError

    inventor._ensure_dotenv()

    bucket = (os.environ.get("PRINT_CACHE_S3_BUCKET") or "").strip()
    if not bucket:
        raise ValueError("PRINT_CACHE_S3_BUCKET is required when PRINT_CACHE_S3_ENABLED is true")

    region = (
        (os.environ.get("AWS_REGION") or os.environ.get("AWS_DEFAULT_REGION") or "us-east-1").strip()
    )
    prefix = _normalize_prefix(os.environ.get("PRINT_CACHE_S3_PREFIX"))
    key = f"{prefix}{filename}"

    endpoint_url = (os.environ.get("AWS_S3_ENDPOINT_URL") or "").strip() or None

    session = boto3.session.Session()
    client = session.client("s3", region_name=region, endpoint_url=endpoint_url)

    try:
        client.upload_file(
            local_path,
            bucket,
            key,
            ExtraArgs={"ContentType": "application/pdf"},
        )
    except (BotoCoreError, ClientError) as e:
        logger.warning("S3 upload failed: %s", e, exc_info=True)
        raise

    public_base = (os.environ.get("PRINT_CACHE_S3_PUBLIC_BASE_URL") or "").strip().rstrip("/")
    if public_base:
        return f"{public_base}/{key}"

    expires = int(os.environ.get("PRINT_CACHE_S3_URL_EXPIRES", "3600"))
    try:
        url = client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket, "Key": key},
            ExpiresIn=expires,
        )
    except (BotoCoreError, ClientError) as e:
        logger.warning("S3 presign failed: %s", e, exc_info=True)
        raise
    return url


def cleanup_s3_print_cache(max_age_seconds: int) -> int:
    """
    Delete objects under the print-cache prefix whose keys end with .pdf and whose
    LastModified is older than max_age_seconds. No-op if S3 is not enabled.
    Returns the number of objects deleted.
    """
    if not is_s3_enabled():
        return 0

    import boto3
    from botocore.exceptions import BotoCoreError, ClientError

    inventor._ensure_dotenv()

    bucket = (os.environ.get("PRINT_CACHE_S3_BUCKET") or "").strip()
    if not bucket:
        logger.warning("PRINT_CACHE_S3_BUCKET missing; skipping S3 cleanup")
        return 0

    region = (
        (os.environ.get("AWS_REGION") or os.environ.get("AWS_DEFAULT_REGION") or "us-east-1").strip()
    )
    prefix = _normalize_prefix(os.environ.get("PRINT_CACHE_S3_PREFIX"))
    endpoint_url = (os.environ.get("AWS_S3_ENDPOINT_URL") or "").strip() or None

    session = boto3.session.Session()
    client = session.client("s3", region_name=region, endpoint_url=endpoint_url)

    now = datetime.now(timezone.utc)
    deleted = 0

    try:
        paginator = client.get_paginator("list_objects_v2")
        for page in paginator.paginate(Bucket=bucket, Prefix=prefix):
            for obj in page.get("Contents") or []:
                key = obj.get("Key") or ""
                if not key.endswith(".pdf"):
                    continue
                lm = obj.get("LastModified")
                if lm is None:
                    continue
                if lm.tzinfo is None:
                    lm = lm.replace(tzinfo=timezone.utc)
                age = (now - lm).total_seconds()
                if age <= max_age_seconds:
                    continue
                try:
                    client.delete_object(Bucket=bucket, Key=key)
                    deleted += 1
                except (BotoCoreError, ClientError) as e:
                    logger.warning("S3 delete failed for %s: %s", key, e)
    except (BotoCoreError, ClientError) as e:
        logger.warning("S3 list/cleanup failed: %s", e, exc_info=True)

    return deleted
