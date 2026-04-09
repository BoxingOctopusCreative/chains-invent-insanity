import uuid

import pytest

from path_sanitization import safe_file_under_directory, safe_local_wordlist_path


def test_safe_file_under_directory_rejects_symlink_outside_base(tmp_path):
    outside = tmp_path.parent / "outside-secret.txt"
    outside.write_text("x", encoding="utf-8")
    bad = tmp_path / "bad.pdf"
    try:
        bad.symlink_to(outside)
    except OSError:
        pytest.skip("symlinks not supported")
    assert safe_file_under_directory(tmp_path, "bad.pdf") is None


def test_safe_file_under_directory_accepts_direct_child(tmp_path):
    f = tmp_path / f"{uuid.uuid4()}.pdf"
    f.write_bytes(b"%PDF")
    got = safe_file_under_directory(str(tmp_path), f.name)
    assert got is not None
    assert got.read_bytes() == b"%PDF"


def test_safe_local_wordlist_rejects_dotdot(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    with pytest.raises(ValueError, match="escape"):
        safe_local_wordlist_path("../words.txt")


def test_safe_local_wordlist_allows_relative_under_cwd(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    sub = tmp_path / "data"
    sub.mkdir()
    f = sub / "words.txt"
    f.write_text("hello", encoding="utf-8")
    got = safe_local_wordlist_path("data/words.txt")
    assert got.read_text() == "hello"
