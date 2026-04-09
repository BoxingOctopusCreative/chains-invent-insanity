# Chains Invent Insanity

![Chains Invent Insanity](https://ci2-assets.chainsinventinsanity.lol/images/Logo%20Black.png)

*A Markov Chain-based [Cards Against Humanity](https://cardsagainsthumanity.com) card generator.*

- - -

## Prerequisites

### API Prerequisites

* Pipenv: [pipenv](https://pipenv.pypa.io/)
* Python 3.14+
* **CORS:** Set `CORS_ORIGINS` in the API environment (see `api/env.example`). Browsers only receive `Access-Control-Allow-Origin` when the request’s `Origin` is listed; there is no wildcard. Without a matching origin, cross-origin front ends cannot use the API from the browser.

### Frontend Prerequisites

* Node.js: [Node.js](https://nodejs.org/)
* Next.js: [Next.js](https://nextjs.org/)
* Tailwind: [Tailwind](https://tailwindcss.com/)

## Setup

### API Setup

Copy `api/env.example` to `api/.env` and configure variables. **You must set `CORS_ORIGINS`** to the exact origins of any web app that calls this API (comma-separated, e.g. `https://yourapp.example,http://localhost:3000`). Local development typically includes `http://localhost:3000` and `http://127.0.0.1:3000` for the Next.js frontend.

Install Pipenv Environment and all dependencies

```bash
pipenv install
```

Start the API server

```bash
pipenv run start
```

### Frontend Setup

Install Dependencies

```bash
npm install
```

Start the frontend server

```bash
npm run start
```

## Usage

### API Usage

The API is accessible at `http://localhost:8000/api/v1/`. The OpenAPI spec is served at `http://localhost:8000/openapi.yaml`. With `docker-compose.yml`, Swagger UI runs at `http://localhost:8080` and loads that spec.

To modify any API configuration, edit the `gunicorn.conf.py` file.

### Frontend Usage

Once the Frontend service is up and running, it can be accessed at `http://localhost:3000/`.
