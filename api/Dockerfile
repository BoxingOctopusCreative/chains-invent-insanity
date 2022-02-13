FROM python:3.9-alpine

LABEL author="Ryan Draga <ryan.draga@boxingoctop.us>"
LABEL version="2.0"

ENV PYTHONDONTWRITEBYTECODE 1

RUN apk update && apk upgrade
RUN adduser -D ci2
RUN mkdir /app
RUN chown ci2:ci2 /app

COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt --no-cache-dir --disable-pip-version-check

USER ci2

ENTRYPOINT [ "gunicorn", "app:app", "-c", "gunicorn.conf.py" ]