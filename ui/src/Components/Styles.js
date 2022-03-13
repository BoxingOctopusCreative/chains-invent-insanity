import styled from "styled-components";

export const Styles = styled.div`
  html {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  .body {
    color: white;
  }

  .jumbotron {
    background-color: lightgray;
    color: black;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 20px;
    padding-left: 50px;
    border-radius: 10px;
  }

  .jumbotron a {
    text-decoration: none;
    color: #555;
  }

  h1 {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: bold;
  }

  h3 {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: bold;
  }

  p {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: bold;
  }
  
  hr {
    border-color: #ffffff;
  }
  
  .text-muted {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  .form-label {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .form-control {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  button {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: bold;
  }

  .vertical-center {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
  }

  .modal-title {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: bold;
  }

  .modal-body p {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: bold;
  }

  .navbar-brand-logo {
    width: 50px;
    height: auto;
  }

  .nav-link {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: bold;
    font-size: 36px;
    color: white !important;
    text-decoration: none;
    margin-left: 16px;
  }

  .section-title {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: bold;
    padding-top: 25px;
  }

  .page-footer {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: bold;
    background-color: black;
    color: gray;
  }

  .page-footer a {
    text-decoration: none;
    color: white;
  }

  .img-fluid {
    height: 70px;
    padding: 10px;
  }

  .cah_card {
    position: relative;
    float: left;
    width: 225px;
    height: 315px;
    padding: 1em;
    margin: .5em;
    background: white;
    border: .1em black solid;
    border-radius: 1em;
    background-image: url("https://chains-invent-insanity-assets.sfo3.digitaloceanspaces.com/images/Answer%20Card.svg");
    background-size: cover;
    background-repeat: no-repeat;
  }

  .cah_card p {
    color: black;
    font-weight: bold;
    font-size: 16px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.6em;
    margin-top: 0;
  }
  
  .cah_card_inverted {
    position: relative;
    float: left;
    width: 225px;
    height: 315px;
    padding: 1em;
    margin: .5em;
    background: black;
    border: .1em white solid;
    border-radius: 1em;
    background-image: url("https://chains-invent-insanity-assets.sfo3.digitaloceanspaces.com/images/Question%20Card.svg");
    background-size: cover;
    background-repeat: no-repeat;
  }

  .cah_card_inverted p {
    color: white;
    font-weight: bold;
    font-size: 16px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.6em;
    margin-top: 0;
  }
  
  .cah_card .cahlogo {
    position: absolute;
    bottom: 0.05em;
    left: 0em;
  }
`;