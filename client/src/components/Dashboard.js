import { useWeb3 } from "@3rdweb/hooks";
import { Box, Button, Flex, Table, Tbody, Td, Th, Thead, Tr, useColorMode } from "@chakra-ui/react";
import { Center, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useBundleDropModule, useTokenModule, useVoteModule } from "../context";
import { ProposalStateMapper } from "../dataMapper";
import ProposalForm from "./ProposalForm";
import ProposalItem from "./ProposalItem";

// A fancy function to shorten someones wallet address, no need to show the whole thing. 
const shortenAddress = (str) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

const Dashboard = () => {
  const bundleDropModule = useBundleDropModule();
  const tokenModule = useTokenModule()
  const voteModule = useVoteModule()
  const [memberAddresses, setMemberAddresses] = useState([]);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  const [proposals, setProposals] = useState(false);
  const [filteredProposals, setFilteredProposals] = useState(false);
  const [activeFilters, setActiveFilters] = useState([1]); // default items to vote

  useEffect(() => {
    setFilteredProposals(activeFilters.length > 0 ? proposals?.filter?.((p) => activeFilters.indexOf(p.state) > -1) : proposals);
  }, [proposals, activeFilters, setFilteredProposals]);

  const { address } = useWeb3();
  const { colorMode } = useColorMode();

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of our token.
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    // Grab all the balances.
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("👜 Amounts", amounts)
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("failed to get token amounts", err);
      });
  }, []);

  useEffect(() => {
    // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
    // with tokenId 0.
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresess) => {
        console.log("🚀 Members addresses", addresess)
        setMemberAddresses(addresess);
      })
      .catch((err) => {
        console.error("failed to get member list", err);
      });
  }, []);

  // Retrieve all our existing proposals from the contract.
  useEffect(() => {
    // A simple call to voteModule.getAll() to grab the proposals.
    voteModule
      .getAll()
      .then((proposals) => {
        // Set state!
        setProposals(proposals);
        console.log("🌈 Proposals:", proposals)
      })
      .catch((err) => {
        console.error("failed to get proposals", err);
      });

  }, []);

  const toggle = (key) => {
    setActiveFilters(activeFilters.indexOf(key) > -1 ? activeFilters.filter((f) => f !== key) : [...activeFilters, key])
  }

  if (!address) {
    return null
  }
  return <Container maxW='6xl'>
    <Stack spacing='4'>
      <Center><Heading fontSize='3rem'>🎧 DAO BRB MUSIC</Heading></Center>
      <Center><Text>Congratulations on being a member</Text></Center>
      <ProposalForm />
    </Stack>
    <Stack direction='row' mt='6' spacing='2' bg={ `#008fee${colorMode === 'light' ? '01' : '10'}` } borderRadius='15px' p='4'>
      <Box >
        <Center><Heading fontSize='1.2rem'>Member List</Heading></Center>
        <Table>
          <Thead>
            <Tr>
              <Th>Address</Th>
              <Th>Token Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            { memberList.map((member) => {
              return (
                <Tr key={ member.address }>
                  <Td><Text fontSize='.8rem'>{ shortenAddress(member.address) }</Text></Td>
                  <Td><Text fontSize='.8rem'>{ member.tokenAmount }</Text></Td>
                </Tr>
              );
            }) }
          </Tbody>
        </Table>
        <Box position='sticky' top='20px' p='3' mt='40px'>
          <Flex flexWrap='wrap'>
            { Object.keys(ProposalStateMapper).map((key) => {
              const intKey = parseInt(key);

              return <Button
                flex={ ['40%', '30%', '20%'] }
                size='xs'
                m='2'
                key={ key }
                bg={ activeFilters.indexOf(intKey) > -1 ? `proposalStatus.${key}` : '' }
                onClick={ () => toggle(intKey) }>
                { ProposalStateMapper[key] }
              </Button>
            }) }
          </Flex>
        </Box>
      </Box>
      <div>
        <Center><Heading fontSize='1.2rem'>Active Proposals</Heading></Center>
        { filteredProposals?.map?.((proposal) => <ProposalItem key={ proposal.proposalId } proposal={ proposal } />) }
      </div >
    </Stack >
  </Container >
}
// 
export default Dashboard;