import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

export default class Title extends Component {
    render() {
        return (
            <Helmet>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#000000" />
                <meta name="description" content="Cards Against Humanity Generator" />
                <title>Chains Invent Insanity</title>
            </Helmet>
        );
    }
};
