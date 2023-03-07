import React from 'react';

export const Cards = (props) => (
  <div className="cah_cards">
    <div className="cah_card">
      <p>
        {props.children}
      </p>
    </div>
  </div>
)
