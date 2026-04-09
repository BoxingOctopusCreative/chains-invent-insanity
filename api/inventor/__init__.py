import markovify
import requests
import os
from dotenv import load_dotenv, find_dotenv

from path_sanitization import safe_local_wordlist_path

# api/.env (parent of this package), loaded once before any os.environ reads
_dotenv_loaded = False


def _ensure_dotenv():
    global _dotenv_loaded
    if _dotenv_loaded:
        return
    api_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    env_path = os.path.join(api_root, ".env")
    if os.path.isfile(env_path):
        load_dotenv(env_path)
    else:
        find_dotenv()
    _dotenv_loaded = True


def _env_truthy(*keys: str) -> bool:
    for key in keys:
        v = os.environ.get(key)
        if v is None:
            continue
        return str(v).strip().lower() in ("1", "true", "yes", "on")
    return False


def _read_local_corpus(path: str) -> str:
    resolved = safe_local_wordlist_path(path)
    return resolved.read_text(encoding="utf-8", errors="replace")


class Config:

    def __init__(self):
        _ensure_dotenv()
        self.debug_mode = os.environ.get("DEBUG_MODE")
        self.app_key = os.environ.get("APP_KEY")
        self.listen = os.environ.get("LISTEN")
        self.port = os.environ.get("PORT")
        # Support USE_LOCAL_WORDLISTS (documented) and USE_LOCAL_WORDLIST (legacy .env typo)
        self.use_local_wordlists = _env_truthy("USE_LOCAL_WORDLISTS", "USE_LOCAL_WORDLIST")
        self.local_question_wordlist = os.environ.get("LOCAL_QUESTION_WORDLIST")
        self.remote_question_wordlist = os.environ.get("REMOTE_QUESTION_WORDLIST")
        self.local_answer_wordlist = os.environ.get("LOCAL_ANSWER_WORDLIST")
        self.remote_answer_wordlist = os.environ.get("REMOTE_ANSWER_WORDLIST")
        self.assets_dir = os.path.join(os.getcwd(), "assets")


class Invent:

    def __init__(self, num_cards, attempts):
        self.num_cards = int(num_cards)
        self.attempts = int(attempts)

    def question(self):

        cfg = Config()

        attempts_str2int = int(self.attempts)
        num_cards_str2int = int(self.num_cards)
        cards = []

        if cfg.use_local_wordlists:
            text = _read_local_corpus(cfg.local_question_wordlist or "")
        else:
            req = requests.get(cfg.remote_question_wordlist, timeout=60)
            req.raise_for_status()
            text = req.text

        text_model = markovify.Text(text)

        for _i in range(num_cards_str2int):
            s = text_model.make_sentence(tries=attempts_str2int)
            cards.append(s if s is not None else "(Could not generate a sentence — try more attempts.)")

        return cards

    def answer(self):

        cfg = Config()

        attempts_str2int = int(self.attempts)
        num_cards_str2int = int(self.num_cards)
        cards = []

        if cfg.use_local_wordlists:
            text = _read_local_corpus(cfg.local_answer_wordlist or "")
        else:
            req = requests.get(cfg.remote_answer_wordlist, timeout=60)
            req.raise_for_status()
            text = req.text

        text_model = markovify.Text(text)

        for _i in range(num_cards_str2int):
            s = text_model.make_sentence(tries=attempts_str2int)
            cards.append(s if s is not None else "(Could not generate a sentence — try more attempts.)")

        return cards
