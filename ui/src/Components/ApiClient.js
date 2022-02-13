import axios from 'axios';
import React from 'react';

export default function ApiClient(card_type, num_cards, attempts) {

    const baseUrl = `http://localhost:8000/api/v1/${card_type}?num_cards=${num_cards}&attempts=${attempts}`;

    const [post, setPost] = React.useState(null);

    React.useEffect(() => {
        axios.get(baseUrl).then((response) => {
          setPost(response.data);
        });
      }, []);
    
      if (!post) return null;
}