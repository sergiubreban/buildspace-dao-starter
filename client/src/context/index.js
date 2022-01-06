import { createContext, useContext, useEffect, useState } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";
import { useWeb3 } from "@3rdweb/hooks";

const sdk = new ThirdwebSDK("rinkeby");
const bundleDropModule = sdk.getBundleDropModule(
  "0x29deC2C0a8B0926Bd9ecD18AA0611C175059CAc5"
);
const tokenModule = sdk.getTokenModule(
  "0xe497E57da8Ad041DC758501278807A322f96a55C"
);
const voteModule = sdk.getVoteModule(
  "0xad6879D5264910996398162E967d7961c953a736",
);

export const DAOContext = createContext({
  sdk,
  bundleDropModule,
  tokenModule,
  voteModule
});

export const DAOProvider = (props) => {

  return <DAOContext.Provider value={ {
    sdk,
    bundleDropModule,
    tokenModule,
    voteModule
  } }>{ props.children }</DAOContext.Provider>
}

export const useSdk = () => {
  return useContext(DAOContext).sdk
}
export const useBundleDropModule = () => {
  return useContext(DAOContext).bundleDropModule
}
export const useTokenModule = () => {
  return useContext(DAOContext).tokenModule
}
export const useVoteModule = () => {
  return useContext(DAOContext).voteModule
}

export const useVoteModuleActions = () => {
  const { address: walletAddress } = useWeb3();

  const [error, setError] = useState(null);
  const [xState, setXState] = useState('init');

  const addProposalVote = async (link) => {
    setXState('loading')
    try {
      const amount = 1_000;
      const awesomeSeparator = '__|__'
      // Create proposal to transfer ourselves 6,900 tokens for being awesome.
      await voteModule.propose(
        `Should the DAO transfer ${amount} tokens from the treasury to the Proposer for Posting awesome song link?${awesomeSeparator}${link}`,
        [
          {
            // Again, we're sending ourselves 0 ETH. Just sending our own token.
            nativeTokenValue: 0,
            transactionData: tokenModule.contract.interface.encodeFunctionData(
              // We're doing a transfer from the treasury to our wallet.
              "transfer",
              [
                walletAddress,
                ethers.utils.parseUnits(amount.toString(), 18),
              ]
            ),

            toAddress: tokenModule.address,
          },
        ]
      );

      setXState('success')
      console.log(
        "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
      );
    } catch (error) {
      console.error("failed to create second proposal", error);
      setError(error)
      setXState('error')
    }
  }
  const reset = () => {
    setXState('init')
    setError(null)
  }
  return { error, addProposalVote, state: xState, reset }
}