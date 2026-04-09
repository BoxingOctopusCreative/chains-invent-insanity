from flask import Flask, request, jsonify, Response, send_file
import inventor
import logging
import os
import uuid as uuid_lib

import print_cache_s3
from path_sanitization import safe_file_under_directory
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


def _cors_allowed_origins():
    """Comma-separated exact origins in CORS_ORIGINS (e.g. https://app.example.com,http://localhost:3000)."""
    raw = os.environ.get('CORS_ORIGINS', '').strip()
    if not raw:
        return frozenset()
    out = set()
    for part in raw.split(','):
        p = part.strip().rstrip('/')
        if p:
            out.add(p)
    return frozenset(out)


def _cors_allow_origin():
    """If the browser Origin is in the allowlist, return that origin for Access-Control-Allow-Origin; else None."""
    origin = request.headers.get('Origin')
    if not origin:
        return None
    origin_key = origin.strip().rstrip('/')
    if origin_key in _cors_allowed_origins():
        return origin
    return None


def _apply_cors(resp):
    allowed = _cors_allow_origin()
    if allowed:
        resp.headers['Access-Control-Allow-Origin'] = allowed
        resp.headers.add('Vary', 'Origin')
    return resp


@app.route('/openapi.yaml', methods=['GET', 'OPTIONS'])
def openapi_yaml():
    if request.method == 'OPTIONS':
        r = Response()
        allowed = _cors_allow_origin()
        if allowed:
            r.headers['Access-Control-Allow-Origin'] = allowed
            r.headers.add('Vary', 'Origin')
        r.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        r.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        r.headers['Access-Control-Max-Age'] = '3600'
        return r
    if not os.path.isfile(_OPENAPI_PATH):
        return Response('OpenAPI spec not found', status=404)
    resp = send_file(_OPENAPI_PATH, mimetype='application/yaml')
    return _apply_cors(resp)


@app.route('/api/v1/question', methods=['GET'])
def question():

    num_cards = request.args.get('num_cards', default=1, type=int)
    attempts  = request.args.get('attempts', default=1000, type=int)

    get_card = inventor.Invent(num_cards=num_cards, attempts=attempts)
    card     = {
        'answer': get_card.question()
    }

    response = jsonify(card)
    _apply_cors(response)

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
    _apply_cors(response)

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
    return _apply_cors(resp)


@app.route('/api/v1/print-cache', methods=['POST', 'OPTIONS'])
def print_cache_upload():
    if request.method == 'OPTIONS':
        r = Response()
        allowed = _cors_allow_origin()
        if allowed:
            r.headers['Access-Control-Allow-Origin'] = allowed
            r.headers.add('Vary', 'Origin')
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


@app.route('/api/v1/print-cache/files/<uuid:uid>.pdf', methods=['GET', 'OPTIONS'])
def print_cache_download(uid):
    if request.method == 'OPTIONS':
        r = Response()
        allowed = _cors_allow_origin()
        if allowed:
            r.headers['Access-Control-Allow-Origin'] = allowed
            r.headers.add('Vary', 'Origin')
        r.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        r.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return r

    path = safe_file_under_directory(PRINT_CACHE_DIR, f'{uid}.pdf')
    if path is None:
        return Response('Not found', status=404)

    resp = send_file(
        str(path),
        mimetype='application/pdf',
        as_attachment=True,
        download_name='chains-invent-cards.pdf',
    )
    return _apply_cors(resp)


def main():
    host = cfg.listen or "127.0.0.1"
    port = int(cfg.port) if cfg.port else 5000
    app.run(host=host, port=port)


if __name__ == "__main__":
    main()
