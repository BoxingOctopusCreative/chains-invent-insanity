from flask import Flask, flash, render_template, request
from flask_analytics import Analytics
from wtforms import Form, IntegerField, validators
from os.path import join, dirname
from dotenv import load_dotenv, find_dotenv
import os
import markovify
import requests

# Tell our app where to get its environment variables from
dotenv_path = join(dirname(__file__), '.env')
try:
    load_dotenv(dotenv_path)
except IOError:
    find_dotenv()

app = Flask(__name__)
app.debug = os.environ.get('DEBUG_MODE')
app.secret_key = os.environ.get('APP_KEY')

# Simple check for Google Analytics
if os.environ.get('USE_ANALYTICS') is not None and not False:
    Analytics(app)
    app.config['ANALYTICS']['GOOGLE_CLASSIC_ANALYTICS']['ENABLED'] = True
    app.config['ANALYTICS']['GOOGLE_CLASSIC_ANALYTICS']['ACCOUNT'] = os.environ.get('GOOGLE_ANALYTICS_ACCOUNT')

# Are we storing the cardback image locally?
if os.environ.get('USE_LOCAL_CARD_IMG') is True:
    card_img = os.environ.get('LOCAL_CARD_IMG')
else:
    card_img = os.environ.get('REMOTE_CARD_IMG')

assets_dir = os.path.join(os.getcwd(), 'assets')


class OptionForm(Form):
    num_card_field = IntegerField('Number of cards to generate:',
                                  [validators.NumberRange(min=1, max=2048)])
    attempts_field = IntegerField('Number of attempts to generate valid cards each time:',
                                  [validators.NumberRange(min=1000, max=1000000)])


def invent(attempts=10000, num_cards=1):
    """
    :param attempts: Number of attempts markovify should take to generate a valid sentence for each card.
    :param num_cards: Number of cards to generate.
    :return:
    """

    use_local = os.environ.get('USE_LOCAL_WORDLIST')

    attempts_str2int = int(attempts)
    num_cards_str2int = int(num_cards)
    cards = []

    if use_local is True:
        local_wordlist = os.environ.get('LOCAL_WORDLIST')
        text = local_wordlist
    else:
        remote_wordlist = os.environ.get('REMOTE_WORDLIST')
        r = requests.get(remote_wordlist)
        text = r.text

    text_model = markovify.Text(text)

    for i in range(num_cards_str2int):
        cards.append(text_model.make_sentence(tries=attempts_str2int))

    return cards


@app.route('/', methods=['GET', 'POST'])
def index():

    form = OptionForm(request.form)
    if request.method == 'POST' and not form.validate():
        try:
            num_cards = request.form['num_cards']
        except ValueError:
            flash(u'Invalid Integer', 'error')
        try:
            attempts = request.form['attempts']
        except ValueError:
            flash(u'Invalid Integer', 'error')

        cards = invent(attempts, num_cards)

        return render_template('result.html', card_bg=card_img, cards=cards)

    return render_template('index.html')


@app.route('/api', methods=['GET'])
def api():
    card = invent()
    try:
        return card[0].encode('utf-8')
    except UnicodeEncodeError:
        return None

app.jinja_env.globals.update(invent=invent)


def main():
    app.run()

if __name__ == "__main__":
    main()
