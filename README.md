# Chains Invent Insanity

![Chains Invent Insanity](https://ci2-assets.chainsinventinsanity.lol/images/Logo%20Black.png)

*A Markov Chain-based [Cards Against Humanity](https://cardsagainsthumanity.com) card generator.*

- - -

## Requirements

### API

* Pipenv: [pipenv](https://pipenv.pypa.io/)
* Python 3.9+

### Frontend

* Node.js: [Node.js](https://nodejs.org/)
* Next.js: [Next.js](https://nextjs.org/)
* Tailwind: [Tailwind](https://tailwindcss.com/)

## Setup

### API

1. Install Pipenv Environment and all dependencies

`pipenv install`

2. Start the API server

`pipenv run start`

### Frontend

1. Install Dependencies

`npm install`

2. Start the frontend server

`npm run start`

## Usage

### API

The API is accessible at `http://localhost:8000/api/v1/`. The OpenAPI spec is served at `http://localhost:8000/openapi.yaml`. With `dev-docker-compose.yml`, Swagger UI runs at `http://localhost:8080` and loads that spec.

To modify any API configuration, edit the `gunicorn.conf.py` file.

### Frontend
Once the Frontend service is up and running, it can be accessed at `http://localhost:3000/`.
