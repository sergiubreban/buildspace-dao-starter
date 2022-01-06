import { useState } from "react";

const ProposalForm = () => {
  const [link, setLink] = useState('');

  return <div>
    <input type='text' placeholder="Youtube / Spotify Link" value={ link } onChange={ (e) => setLink(e.target.value) } />
    <button>Propose</button>
    </div>
}

export default ProposalForm;