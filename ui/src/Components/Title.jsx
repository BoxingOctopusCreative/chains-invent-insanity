import React, { Component } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';

export default class Title extends Component {
  render() {
    return (
      <HelmetProvider>
        <Helmet bodyAttributes={{style: 'background-color : #000000'}}>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="Cards Against Humanity Generator" />
          <title>Chains Invent Insanity</title>
          <link rel="canonical" href="https://chainsinventinsanity.com" />
          <link rel="icon" href="https://chains-invent-insanity-assets.sfo3.digitaloceanspaces.com/images/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
            integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
            crossorigin="anonymous"
          />
        </Helmet>
      </HelmetProvider>
    );
  }
};
