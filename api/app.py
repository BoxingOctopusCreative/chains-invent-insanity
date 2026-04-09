from flask import Flask, request, jsonify, Response, send_file
import inventor
import logging
import os
import uuid as uuid_lib

import print_cache_s3
from print_cache_paths import get_print_cache_dir

logger = logging.getLogger(__name__)

PRINT_CACHE_DIR = get_print_cache_dir()
os.makedirs(PRINT_CACHE_DIR, exist_ok=True)

_OPENAPI_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'swagger', 'openapi.yaml')

cfg             = inventor.Config()
app             = Flask(__name__)
app.debug       = cfg.debug_mode
app.secret_key  = cfg.app_key
app.config['MAX_CONTENT_LENGTH'] = 32 * 1024 * 1024  # 32 MiB PDF uploads


@app.route('/openapi.yaml', methods=['GET', 'OPTIONS'])
def openapi_yaml():
    if request.method == 'OPTIONS':
        r = Response()
        r.headers['Access-Control-Allow-Origin'] = '*'
        r.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        r.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        r.headers['Access-Control-Max-Age'] = '3600'
        return r
    if not os.path.isfile(_OPENAPI_PATH):
        return Response('OpenAPI spec not found', status=404)
    resp = send_file(_OPENAPI_PATH, mimetype='application/yaml')
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp


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


def _cors(resp):
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp


@app.route('/api/v1/print-cache', methods=['POST', 'OPTIONS'])
def print_cache_upload():
    if request.method == 'OPTIONS':
        r = Response()
        r.headers['Access-Control-Allow-Origin'] = '*'
        r.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        r.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        r.headers['Access-Control-Max-Age'] = '3600'
        return r

    if 'file' not in request.files:
        return _cors(jsonify({'error': 'missing file'})), 400
    f = request.files['file']
    if f.filename is None or f.filename == '':
        return _cors(jsonify({'error': 'empty upload'})), 400

    uid = uuid_lib.uuid4()
    dest = os.path.join(PRINT_CACHE_DIR, f'{uid}.pdf')
    f.save(dest)

    download_path = f'/api/v1/print-cache/files/{uid}.pdf'
    body = {'id': str(uid), 'downloadPath': download_path}

    if print_cache_s3.is_s3_enabled():
        try:
            body['downloadUrl'] = print_cache_s3.upload_print_cache_pdf(dest, f'{uid}.pdf')
        except Exception as e:
            logger.warning('Print-cache S3 upload failed: %s', e, exc_info=True)
            require = str(os.environ.get('PRINT_CACHE_S3_REQUIRE_UPLOAD', '')).strip().lower() in (
                '1', 'true', 'yes', 'on',
            )
            if require:
                return _cors(jsonify({'error': 's3_upload_failed', 'detail': str(e)})), 503

    resp = jsonify(body)
    return _cors(resp), 200


@app.route('/api/v1/print-cache/files/<path:file_id>', methods=['GET', 'OPTIONS'])
def print_cache_download(file_id):
    if request.method == 'OPTIONS':
        r = Response()
        r.headers['Access-Control-Allow-Origin'] = '*'
        r.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        r.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return r

    id_clean = file_id[:-4] if file_id.endswith('.pdf') else file_id
    try:
        uid = uuid_lib.UUID(id_clean)
    except ValueError:
        return Response('Not found', status=404)

    path = os.path.join(PRINT_CACHE_DIR, f'{uid}.pdf')
    if not os.path.isfile(path):
        return Response('Not found', status=404)

    resp = send_file(
        path,
        mimetype='application/pdf',
        as_attachment=True,
        download_name='chains-invent-cards.pdf',
    )
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp


def main():
    host = cfg.listen or "127.0.0.1"
    port = int(cfg.port) if cfg.port else 5000
    app.run(host=host, port=port)


if __name__ == "__main__":
    main()
