import io
import uuid

# Must match cors_allowlist in conftest.py
CORS_TEST_ORIGIN = "http://localhost:3000"


def test_openapi_yaml_served(client):
    res = client.get("/openapi.yaml", headers={"Origin": CORS_TEST_ORIGIN})
    assert res.status_code == 200
    assert b"swagger:" in res.data
    assert res.headers.get("Access-Control-Allow-Origin") == CORS_TEST_ORIGIN


def test_question_returns_json_list(client):
    res = client.get(
        "/api/v1/question?num_cards=2&attempts=10",
        headers={"Origin": CORS_TEST_ORIGIN},
    )
    assert res.status_code == 200
    data = res.get_json()
    assert "answer" in data
    assert data["answer"] == ["mock-question-0", "mock-question-1"]
    assert res.headers.get("Access-Control-Allow-Origin") == CORS_TEST_ORIGIN


def test_question_rejects_invalid_num_cards(client):
    res = client.get("/api/v1/question?num_cards=0&attempts=10")
    assert res.status_code == 400


def test_question_rejects_invalid_attempts(client):
    res = client.get("/api/v1/question?num_cards=1&attempts=0")
    assert res.status_code == 400


def test_answer_returns_json_list(client):
    res = client.get("/api/v1/answer?num_cards=1&attempts=500")
    assert res.status_code == 200
    data = res.get_json()
    assert data["answer"] == ["mock-answer-0"]


def test_print_cache_post_missing_file(client):
    res = client.post(
        "/api/v1/print-cache",
        headers={"Origin": CORS_TEST_ORIGIN},
    )
    assert res.status_code == 400
    assert res.get_json()["error"] == "missing file"


def test_print_cache_post_upload_and_download_roundtrip(client):
    pdf_bytes = b"%PDF-1.4 test"
    res = client.post(
        "/api/v1/print-cache",
        data={"file": (io.BytesIO(pdf_bytes), "cards.pdf")},
        content_type="multipart/form-data",
        headers={"Origin": CORS_TEST_ORIGIN},
    )
    assert res.status_code == 200
    body = res.get_json()
    assert "id" in body and "downloadPath" in body
    assert "downloadUrl" not in body
    uuid.UUID(body["id"])  # valid UUID

    dl = client.get(
        body["downloadPath"],
        headers={"Origin": CORS_TEST_ORIGIN},
    )
    assert dl.status_code == 200
    assert dl.data == pdf_bytes
    assert dl.headers.get("Access-Control-Allow-Origin") == CORS_TEST_ORIGIN
    assert "application/pdf" in (dl.headers.get("Content-Type") or "")


def test_print_cache_get_invalid_uuid(client):
    res = client.get("/api/v1/print-cache/files/not-a-uuid.pdf")
    assert res.status_code == 404


def test_print_cache_get_missing_file(client):
    res = client.get(f"/api/v1/print-cache/files/{uuid.uuid4()}.pdf")
    assert res.status_code == 404


def test_print_cache_options_post_preflight(client):
    res = client.open(
        "/api/v1/print-cache",
        method="OPTIONS",
        headers={
            "Origin": CORS_TEST_ORIGIN,
            "Access-Control-Request-Method": "POST",
        },
    )
    assert res.status_code == 200
    assert res.headers.get("Access-Control-Allow-Origin") == CORS_TEST_ORIGIN


def test_print_cache_post_includes_s3_download_url_when_enabled(client, monkeypatch):
    monkeypatch.setenv("PRINT_CACHE_S3_ENABLED", "true")
    monkeypatch.setenv("PRINT_CACHE_S3_BUCKET", "test-bucket")
    monkeypatch.setenv("AWS_REGION", "us-east-1")

    def fake_upload(local_path, filename):
        assert filename.endswith(".pdf")
        return "https://example.com/signed.pdf"

    monkeypatch.setattr("print_cache_s3.upload_print_cache_pdf", fake_upload)

    pdf_bytes = b"%PDF-1.4 test"
    res = client.post(
        "/api/v1/print-cache",
        data={"file": (io.BytesIO(pdf_bytes), "cards.pdf")},
        content_type="multipart/form-data",
    )
    assert res.status_code == 200
    body = res.get_json()
    assert body["downloadUrl"] == "https://example.com/signed.pdf"


def test_print_cache_options_get_preflight(client):
    res = client.open(
        "/api/v1/print-cache/files/00000000-0000-0000-0000-000000000000.pdf",
        method="OPTIONS",
        headers={
            "Origin": CORS_TEST_ORIGIN,
            "Access-Control-Request-Method": "GET",
        },
    )
    assert res.status_code == 200
    assert res.headers.get("Access-Control-Allow-Origin") == CORS_TEST_ORIGIN


def test_print_cache_rejects_path_segments_in_url(client):
    """Slashes in the filename are not a valid UUID route (no path traversal)."""
    res = client.get(
        "/api/v1/print-cache/files/../../../etc/passwd",
        headers={"Origin": CORS_TEST_ORIGIN},
    )
    assert res.status_code == 404


def test_cors_with_disallowed_origin_omits_acao(client):
    res = client.get(
        "/api/v1/question?num_cards=1&attempts=10",
        headers={"Origin": "https://evil.example"},
    )
    assert res.status_code == 200
    assert res.headers.get("Access-Control-Allow-Origin") is None


def test_cors_development_allows_loopback_any_port(client, monkeypatch):
    """APP_ENV=development allows loopback on any port (Next may use 3001, [::1], etc.)."""
    monkeypatch.setenv("APP_ENV", "development")
    monkeypatch.setenv("CORS_ORIGINS", "http://localhost:3000")
    res = client.get(
        "/api/v1/question?num_cards=1&attempts=10",
        headers={"Origin": "http://localhost:3001"},
    )
    assert res.status_code == 200
    assert res.headers.get("Access-Control-Allow-Origin") == "http://localhost:3001"


def test_cors_development_allows_ipv6_loopback(client, monkeypatch):
    monkeypatch.setenv("APP_ENV", "development")
    monkeypatch.setenv("CORS_ORIGINS", "")
    res = client.get(
        "/api/v1/question?num_cards=1&attempts=10",
        headers={"Origin": "http://[::1]:3000"},
    )
    assert res.status_code == 200
    assert res.headers.get("Access-Control-Allow-Origin") == "http://[::1]:3000"


def test_cors_production_default_allows_site_origin(client, monkeypatch):
    monkeypatch.delenv("CORS_ORIGINS", raising=False)
    monkeypatch.setenv("APP_ENV", "production")
    origin = "https://chainsinventinsanity.lol"
    res = client.get(
        "/api/v1/question?num_cards=1&attempts=10",
        headers={"Origin": origin},
    )
    assert res.status_code == 200
    assert res.headers.get("Access-Control-Allow-Origin") == origin


def test_cors_prod_alias_matches_production(client, monkeypatch):
    monkeypatch.delenv("CORS_ORIGINS", raising=False)
    monkeypatch.setenv("APP_ENV", "prod")
    origin = "https://www.chainsinventinsanity.lol"
    res = client.get(
        "/api/v1/question?num_cards=1&attempts=10",
        headers={"Origin": origin},
    )
    assert res.status_code == 200
    assert res.headers.get("Access-Control-Allow-Origin") == origin


def test_cors_production_default_omits_unknown_origin(client, monkeypatch):
    monkeypatch.delenv("CORS_ORIGINS", raising=False)
    monkeypatch.setenv("APP_ENV", "production")
    res = client.get(
        "/api/v1/question?num_cards=1&attempts=10",
        headers={"Origin": "https://evil.example"},
    )
    assert res.status_code == 200
    assert res.headers.get("Access-Control-Allow-Origin") is None
