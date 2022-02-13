from flask import Flask, request, jsonify, Response
from flasgger import Swagger, swag_from
import inventor

cfg             = inventor.Config()
app             = Flask(__name__)
app.debug       = cfg.debug_mode
app.secret_key  = cfg.app_key

template = {
  "swagger": "2.0",
  "swagger_ui_css": "https://raw.githubusercontent.com/Amoenus/SwaggerDark/master/SwaggerDark.css",
  "info": {
    "title": "Chains Invent Insanity",
    "description": "API for Chains Invent Insanity",
    "contact": {
      "responsibleOrganization": "Boxing Octopus Creative",
      "responsibleDeveloper": "ryan.draga@boxingoctop.us",
      "email": "ryan.draga@boxingoctop.us",
      "url": "https://boxingoctop.us",
    },
    "termsOfService": "https://chainsinventinsanity.com/terms",
    "version": "2.0"
  },
  #"host": "https://chainsinventinsanity.com",  # overrides localhost:500
  "basePath": "/api",  # base bash for blueprint registration
  "schemes": [
    "http",
    "https"
  ],
  "operationId": "getmyData"
}

swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": '/apispec_1.json',
            "rule_filter": lambda rule: True,  # all in
            "model_filter": lambda tag: True,  # all in
        }
    ],
    #"static_url_path": "/flasgger_static",
    # "static_folder": "static",  # must be set by user
    "swagger_ui": True,
    "specs_route": "/apidocs/",
    "favicon": "https://chains-invent-insanity-assets.sfo3.digitaloceanspaces.com/images/swagger_fav.png",
    "swagger_ui_bundle_js": 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.5.0/swagger-ui-bundle.js',
    "swagger_ui_standalone_preset_js": 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.5.0/swagger-ui-standalone-preset.js',
    'jquery_js': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
    'swagger_ui_css': 'https://chains-invent-insanity-assets.sfo3.digitaloceanspaces.com/css/theme-newspaper.css'
}

swagger = Swagger(app, template=template, config=swagger_config)

@app.route('/api/v1/question', methods=['GET'])
@swag_from('swagger/question.yaml')
def question():

    num_cards = request.args.get('num_cards', default=1, type=int)
    attempts  = request.args.get('attempts', default=1000, type=int)

    get_card = inventor.Invent(num_cards=num_cards, attempts=attempts)
    card     = {
        'answer': get_card.question()
    }

    response = jsonify(card)
    response.headers.add("Access-Control-Allow-Origin", "*")

    if num_cards < 1:
        error_msg = "Number of cards to be generated must be a non-zero value"
    elif attempts < 1:
        error_msg = "Number of attempts must be a non-zero value"
    else:
        error_msg = "An unknown error occurred"

    if num_cards < 1 or attempts < 1:
        return Response(error_msg, status=400)
    else:
        return response

@app.route('/api/v1/answer', methods=['GET'])
@swag_from('swagger/answer.yaml')
def answer():

    num_cards = request.args.get('num_cards', default=1, type=int)
    attempts  = request.args.get('attempts', default=1000, type=int)

    get_card = inventor.Invent(num_cards=num_cards, attempts=attempts)
    card     = {
        'answer': get_card.answer()
    }

    response = jsonify(card)
    response.headers.add("Access-Control-Allow-Origin", "*")

    if num_cards < 1:
        error_msg = "Number of cards to be generated must be a non-zero value"
    elif attempts < 1:
        error_msg = "Number of attempts must be a non-zero value"
    else:
        error_msg = "An unknown error occurred"

    if num_cards < 1 or attempts < 1:
        return Response(error_msg, status=400)
    else:
        return response

def main():
    app.run(listen=cfg.listen, port=cfg.port)


if __name__ == "__main__":
    main()
