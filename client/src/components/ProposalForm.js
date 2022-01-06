import { Box, Button, Input, Stack, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { useVoteModuleActions } from "../context";
import { WarningIcon } from '@chakra-ui/icons'

const ProposalForm = () => {
  const [link, setLink] = useState('');
  const { addProposalVote } = useVoteModuleActions();

  return <Stack direction='row' alignItems='center'>
    <Tooltip label='Copy / Paste a Youtube or Spotify link here! If your proposal wins the vote, you will win 1000 tokens! Each proposal can be voted within 24 hours(STOP VOTE after 24h).'>
      <WarningIcon />
    </Tooltip>
    <Input type='text' placeholder="Youtube / Spotify Link" value={ link } onChange={ (e) => setLink(e.target.value) } />
    <Button onClick={ () => {
      addProposalVote(link);
      setLink('');
    } }>Propose</Button>
  </Stack>
}

export default ProposalForm;