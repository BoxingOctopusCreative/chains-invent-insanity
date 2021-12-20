from flask import Flask, request, jsonify
import inventor

cfg             = inventor.Config()
app             = Flask(__name__)
app.debug       = cfg.debug_mode
app.secret_key  = cfg.app_key

@app.route('/api/v1/question', methods=['GET'])
def question():

    num_cards = request.args.get('num_cards', default=1, type=int)
    attempts  = request.args.get('attempts', default=1000, type=int)

    get_card = inventor.Invent(num_cards=num_cards, attempts=attempts)
    card     = {
        'answer': get_card.question()
    }

    response = jsonify(card)
    response.headers.add("Access-Control-Allow-Origin", "*")

    return response

@app.route('/api/v1/answer', methods=['GET'])
def answer():

    num_cards = request.args.get('num_cards', default=1, type=int)
    attempts  = request.args.get('attempts', default=1000, type=int)

    get_card = inventor.Invent(num_cards=num_cards, attempts=attempts)
    card     = {
        'answer': get_card.answer()
    }

    response = jsonify(card)
    response.headers.add("Access-Control-Allow-Origin", "*")

    return response

def main():
    app.run(listen=cfg.listen, port=cfg.port)


if __name__ == "__main__":
    main()
