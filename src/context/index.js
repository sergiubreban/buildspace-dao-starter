import { createContext, useContext, useEffect, useState } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";

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

export const DAOContent = createContext({
  sdk,
  bundleDropModule,
  tokenModule,
  voteModule
});

export const DAOProvider = (props) => {

  return <DAOContent.Provider value={ {
    sdk,
    bundleDropModule,
    tokenModule,
    voteModule
  } }>{ props.children }</DAOContent.Provider>
}

export const useSdk = () => {
  return useContext(DAOContent).sdk
}
export const useBundleDropModule = () => {
  return useContext(DAOContent).bundleDropModule
}
export const useTokenModule = () => {
  return useContext(DAOContent).tokenModule
}
export const useVoteModule = () => {
  return useContext(DAOContent).voteModule
}

export const useVoteModuleActions = (walletAddress) => {
  const [error, setError] = useState(null);
  const [xState, setXState] = useState('init');

  const vote = async () => {
    setXState('loading')
    try {
      const amount = 1_000;
      // Create proposal to transfer ourselves 6,900 tokens for being awesome.
      await voteModule.propose(
        "Should the DAO transfer " +
        amount + " tokens from the treasury to " +
        walletAddress + " for Posting this music?",
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
  return { error, vote, state: xState, reset }
}