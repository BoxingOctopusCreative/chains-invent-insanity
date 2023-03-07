# Chains Invent Insanity

![Chains Invent Insanity](https://chains-invent-insanity-assets.sfo3.digitaloceanspaces.com/images/Logo%20Black.png)

*A Markov Chain-based [Cards Against Humanity](https://cardsagainsthumanity.com) card generator.*

- - -

## Requirements

### API

* Pipenv: [pipenv](https://pipenv.pypa.io/)
* Python 3.9+

### Frontend

* Node.js: [Node.js](https://nodejs.org/)
* React: [React](https://reactjs.org/)

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

The API is accessible at `http://localhost:8000/api/v1/`, however there are also Swagger docs available at `http://localhost:8000/apidocs/`.

To modify any API configuration, edit the `gunicorn.conf.py` file.

### Frontend
Once the Frontend service is up and running, it can be accessed at `http://localhost:3000/`.
