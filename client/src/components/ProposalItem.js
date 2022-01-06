import { useWeb3 } from "@3rdweb/hooks";
import { Box, Button, Flex, } from "@chakra-ui/react";
import { Center, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useTokenModule, useVoteModule } from "../context";
import { ProposalStateMapper } from "../dataMapper";
const separator = '__|__';

const ProposalItem = (props) => {
  const { proposal } = props;
  const [isVoting, setIsVoting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const tokenModule = useTokenModule()
  const voteModule = useVoteModule()

  const { address } = useWeb3();
  useEffect(() => {
    // Check if the user has already voted on the first proposal.
    voteModule
      .hasVoted(proposal.proposalId, address)
      .then((hasVoted) => {
        setHasVoted(hasVoted);
      })
      .catch((err) => {
        console.error("failed to check if wallet has voted", err);
      });
  }, [proposal, address]);

  const voteProposal = async (type) => {
    const vote = {
      proposalId: proposal.proposalId,
      vote: type
    }

    try {
      const delegation = await tokenModule.getDelegationOf(address);
      if (delegation === ethers.constants.AddressZero) {
        await tokenModule.delegateTo(address);
      }
      try {
        // then we check if the proposal is open for voting (state === 1 means it is open)
        if (proposal.state === 1) {
          // if it is open for voting, we'll vote on it
          console.log("successfully voted", vote.proposalId, vote.vote);
          await voteModule.vote(vote.proposalId, vote.vote);
          setHasVoted(true);
        }
      } catch (err) {
        console.error("failed to vote", err);
      }
    } catch (err) {
      console.error("failed to delegate tokens");
    } finally {
      // in *either* case we need to set the isVoting state to false to enable the button again
      setIsVoting(false);
    }
  }

  const execute = async () => {
    try {
      if (proposal.state === 4) {
        setIsExecuting(true)
        await voteModule.execute(proposal.proposalId);
        console.log('executed')
      }
    } catch (err) {
      console.error("failed to execute votes", err);
    }
    setIsExecuting(false)
  }
  console.log({ proposal })
  const [description, link] = proposal.description.split(separator)

  return <Stack spacing='5' boxShadow='inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' border='1px solid #182738' borderRadius='15px' p='15px' m='4'>
    <Stack direction={ 'row' } spacing='1'>
      <Box bg={ `proposalStatus.${proposal.state}` } px='1' borderRadius='5px'>{ ProposalStateMapper[proposal.state] }</Box>
      { hasVoted && <Box bg={ `proposalStatus.1` } px='1' borderRadius='5px'>voted</Box> }
    </Stack>
    <Text>Proposer: { (proposal.proposer) }</Text>
    <Center> <Text fontWeight='500'>{ description }</Text></Center>
    { link && <EmbedLink link={ link } /> }
    <Flex justify='space-around'>
      { hasVoted ? <Text>Already Voted</Text> :
        proposal.votes.map((vote) => (<Button key={ vote.type } isLoading={ isVoting } onClick={ () => voteProposal(vote.type) } >
          { vote.label }
        </Button>)
        ) }
      { proposal.state === 4 && <Button isLoading={ isExecuting } onClick={ () => execute() } >
        execute
      </Button> }
    </Flex>
  </Stack>
}
const getYoutubeId = (url) => {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);

  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return null;
  }
}

const EmbedLink = ({ link }) => {
  const youtubeId = getYoutubeId(link);
  const [show, setShow] = useState(false);

  return youtubeId ? <iframe src={ `https://www.youtube.com/embed/${youtubeId}` } width="100%" height="380" frameBorder="0" allowtransparency="true" allow="encrypted-media" /> :
    <>
      <Button onClick={ () => setShow(true) }>Go to song</Button>
      { show && <iframe src={ link } width="100%" height="380" frameBorder="0" allowtransparency="true" allow="encrypted-media" /> }
    </>
}

export default ProposalItem