import markovify
import requests
import os
from dotenv import load_dotenv, find_dotenv

class Config:

    def __init__(self):
        self.debug_mode               = os.environ.get('DEBUG_MODE')
        self.app_key                  = os.environ.get('APP_KEY')
        self.listen                   = os.environ.get('LISTEN')
        self.port                     = os.environ.get('PORT')
        self.use_local_wordlists      = os.environ.get('USE_LOCAL_WORDLISTS')
        self.local_question_wordlist  = os.environ.get('LOCAL_QUESTION_WORDLIST')
        self.remote_question_wordlist = os.environ.get('REMOTE_QUESTION_WORDLIST')
        self.local_answer_wordlist    = os.environ.get('LOCAL_ANSWER_WORDLIST')
        self.remote_answer_wordlist   = os.environ.get('REMOTE_ANSWER_WORDLIST')
        self.assets_dir               = os.path.join(os.getcwd(), 'assets')

        # Tell our app where to get its environment variables from
        dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
        try:
            load_dotenv(dotenv_path)
        except IOError:
            find_dotenv()

class Invent:

    def __init__(self, num_cards, attempts):
        self.num_cards = int(num_cards)
        self.attempts = int(attempts)

    def question(self):

        cfg = Config()

        attempts_str2int  = int(self.attempts)
        num_cards_str2int = int(self.num_cards)
        cards = []

        if cfg.use_local_wordlists is True:
            text = cfg.local_question_wordlist
        else:
            req = requests.get(cfg.remote_question_wordlist)
            text = req.text

        text_model = markovify.Text(text)

        for i in range(num_cards_str2int):
            cards.append(text_model.make_sentence(tries=attempts_str2int))

        return cards

    def answer(self):

        cfg = Config()

        attempts_str2int  = int(self.attempts)
        num_cards_str2int = int(self.num_cards)
        cards = []

        if cfg.use_local_wordlists is True:
            text = cfg.local_answer_wordlist
        else:
            req = requests.get(cfg.remote_answer_wordlist)
            text = req.text

        text_model = markovify.Text(text)

        for i in range(num_cards_str2int):
            cards.append(text_model.make_sentence(tries=attempts_str2int))

        return cards