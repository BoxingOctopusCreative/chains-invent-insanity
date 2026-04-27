# Chains Invent Insanity

![Chains Invent Insanity](https://ci2-assets.chainsinventinsanity.lol/images/Logo%20Black.png)

*A Markov Chain-based [Cards Against Humanity](https://cardsagainsthumanity.com) card generator.*

- - -

## Prerequisites

### API Prerequisites

* Pipenv: [pipenv](https://pipenv.pypa.io/)
* Python 3.14+
* **CORS / `APP_ENV`:** Set `APP_ENV=production` or `APP_ENV=prod` on the API for the default production browser origins, or `APP_ENV=development` / `APP_ENV=dev` for localhost defaults (see `api/env.example`). Optionally set `CORS_ORIGINS` to override the allowlist entirely.

### Frontend Prerequisites

* Node.js: [Node.js](https://nodejs.org/)
* Next.js: [Next.js](https://nextjs.org/)
* Tailwind: [Tailwind](https://tailwindcss.com/)

## Setup

### API Setup

Copy `api/env.example` to `api/.env` and configure variables. Use **`APP_ENV=prod`** (or `production`) when deploying the API so CORS allows the public site by default, or set **`CORS_ORIGINS`** to a comma-separated list of exact origins if you need a custom allowlist.

Install Pipenv Environment and all dependencies

```bash
pipenv install
```

Start the API server

```bash
pipenv run start
```

### Frontend Setup

Set **`APP_ENV=prod`** (or `production`) when building the UI for deployment so the client uses the production API and OpenAPI URL by default (`ui/.env.example`). Local development can omit this or use **`APP_ENV=dev`** / `development`.

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

### Docker Compose vs production

`docker-compose.yml` and `dev-docker-compose.yml` include an optional **nginx** service so you can hit everything on port 80 locally. **In production, traffic goes through [Traefik](https://traefik.io/)** (or your own proxy) directly to the **api** and **ui** containers; nginx from this repo is not part of that layout.

Both services expose **`GET /health`** (JSON `{"status":"ok"}`) for Docker’s `healthcheck` and for upstream checks (for example Traefik’s HTTP health check pointed at `/health` on each backend).
