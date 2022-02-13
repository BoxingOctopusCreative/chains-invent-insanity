import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

export default class Title extends Component {
    render() {
        return (
            <Helmet bodyAttributes={{style: 'background-color : #000000'}}>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#000000" />
                <meta name="description" content="Cards Against Humanity Generator" />
                <link rel="icon" href="https://chains-invent-insanity-assets.sfo3.digitaloceanspaces.com/images/favicon.ico" />
                <title>Chains Invent Insanity</title>
            </Helmet>
        );
    }
};
