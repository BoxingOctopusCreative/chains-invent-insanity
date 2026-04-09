# Chains Invent Insanity

![Chains Invent Insanity](https://ci2-assets.chainsinventinsanity.lol/images/Logo%20Black.png)

*A Markov Chain-based [Cards Against Humanity](https://cardsagainsthumanity.com) card generator.*

- - -

## Prerequisites

### API Prerequisites

* Pipenv: [pipenv](https://pipenv.pypa.io/)
* Python 3.14+

### Frontend Prerequisites

* Node.js: [Node.js](https://nodejs.org/)
* Next.js: [Next.js](https://nextjs.org/)
* Tailwind: [Tailwind](https://tailwindcss.com/)

## Setup

### API Setup

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
