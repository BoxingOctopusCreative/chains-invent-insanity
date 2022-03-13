import React from 'react';
import Parser from 'html-react-parser';

const BoxingOctopusUrl = '<a href="https://boxingoctop.us" target="_blank" rel="noreferrer">Boxing Octopus Creative</a>'
const FlaskUrl         = '<a href="https://flask.palletsprojects.com" target="_blank" rel="noreferrer">Flask</a>'
const ReactUrl         = '<a href="https://reactjs.org" target="_blank" rel="noreferrer">React</a>'
const GithubUrl        = '<a href="https://github.com/BoxingOctopus/chains-invent-insanity" target="_blank" rel="noreferrer">GitHub</a>'

export const Footer = () => (
    <div className="fixed-bottom">
        <footer className="page-footer font-small pt4">
            <div className="text-center py-3">
                Another fine {Parser(BoxingOctopusUrl)} Project | Built with {Parser(FlaskUrl)} and {Parser(ReactUrl)} | Clone this project on {Parser(GithubUrl)}
            </div>
        </footer>
    </div>
);
