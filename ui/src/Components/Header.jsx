import React from 'react';

export const Header = () => (
  <header className="page-header">
    <div className="jumbotron jumbotron-fluid">
      <div className="h1">
        Welcome to <img src="https://chains-invent-insanity-assets.sfo3.digitaloceanspaces.com/images/Logo%20White.png" alt="Chains Invent Insanity" />
      </div>
      <p className="text-left">
        Chains Invent Insanity is a <a href="https://cardsagainsthumanity.com" target="_blank" rel="noreferrer">
        Cards Against Humanity</a> answer card generator.<br />
        As the name suggests, it generates cards based on 
        a <a href="https://www.wikiwand.com/en/Markov_chain" target="_blank" rel="noreferrer">Markov Chain </a>
        compiled from a wordlist.<br />
        This wordlist is comprised of every single (official) answer card ever written for every edition of the game.
      </p>
    </div>
  </header>
);