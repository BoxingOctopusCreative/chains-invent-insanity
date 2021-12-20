import React from 'react';

const card_bg = 'https://ci2-assets.nyc3.digitaloceanspaces.com/CAH-blank-white.png';

export const Cards = (props) => (
    <div className="cah_cards">
        <div className="cah_card">
            <p>
                {props.children}
            </p>
            <img className="cahlogo" src={ card_bg } alt="Card"/>
        </div>
    </div>
)