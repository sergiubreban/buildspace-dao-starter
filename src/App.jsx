import { useWeb3 } from "@3rdweb/hooks";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import { UnsupportedChainIdError } from "@web3-react/core";
import { useBundleDropModule, useSdk } from "./context";


const App = () => {
  const bundleDropModule = useBundleDropModule();
  const sdk = useSdk();
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address, error)
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const signer = provider?.getSigner?.();

  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    // If they don't have an connected wallet, exit!
    if (!address) {
      return;
    }

    // Check if the user has the NFT by using bundleDropModule.balanceOf
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);


  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
    bundleDropModule
      .claim("0", 1)
      .then(() => {
        // Set claim state.
        setHasClaimedNFT(true);
        // Show user their fancy new NFT!
        console.log(
          `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
        );
      })
      .catch((err) => {
        console.error("failed to claim", err);
      })
      .finally(() => {
        // Stop loading state.
        setIsClaiming(false);
      });
  }

  return error instanceof UnsupportedChainIdError ? <NetworkError /> :
    !address ? (<div className="landing">
      <h1>Welcome to MusicDAO</h1>
      <button onClick={ () => connectWallet("injected") } className="btn-hero">
        Connect your wallet
      </button>
    </div>) :
      hasClaimedNFT ? <Dashboard /> : (
        <div className="landing">
          <h1>Welcome to Music DAO</h1>
          <div className="mint-nft">
            <h1>Mint your free 🍪DAO Membership NFT</h1>
            <button
              disabled={ isClaiming }
              onClick={ () => mintNft() }
            >
              { isClaiming ? "Minting..." : "Mint your nft (FREE)" }
            </button>
          </div>
        </div>
      );
};

const NetworkError = () => {
  return (
    <div className="unsupported-network">
      <h2>Please connect to Rinkeby</h2>
      <p>
        This dapp only works on the Rinkeby network, please switch networks
        in your connected wallet.
      </p>
    </div>
  );
}
export default App;
