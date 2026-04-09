import pytest


@pytest.fixture(autouse=True)
def cors_allowlist(monkeypatch):
    """Mirror a real front-end origin; CORS headers are only sent when Origin matches."""
    monkeypatch.setenv("CORS_ORIGINS", "http://localhost:3000")


@pytest.fixture(autouse=True)
def mock_invent(monkeypatch):
    """Avoid network and local wordlist coupling; exercise HTTP layer only."""
    import inventor

    class FakeInvent:
        def __init__(self, num_cards, attempts):
            self._n = int(num_cards)
            self._attempts = int(attempts)

        def question(self):
            return [f"mock-question-{i}" for i in range(self._n)]

        def answer(self):
            return [f"mock-answer-{i}" for i in range(self._n)]

    monkeypatch.setattr(inventor, "Invent", FakeInvent)


@pytest.fixture(autouse=True)
def isolated_print_cache(tmp_path, monkeypatch):
    import app as app_module

    monkeypatch.setattr(app_module, "PRINT_CACHE_DIR", str(tmp_path))


@pytest.fixture
def client():
    import app as app_module

    app_module.app.config["TESTING"] = True
    return app_module.app.test_client()
