FROM python:3.9-alpine
LABEL author="Ryan Draga <ryan.draga@boxingoctop.us>"
LABEL version="1.0"
ENV PYTHONDONTWRITEBYTECODE 1
ADD . /app
WORKDIR /app
EXPOSE 8000
RUN pip install -r requirements.txt --no-cache-dir --disable-pip-version-check