"use client";

import React, { useState,useEffect } from "react";
import { config, EVMSigner } from "./signers/evm-signer";
import {
  cn,
  getConnectors,
  isMainnet,
  MESSAGE,
  shortAddress,
  SUPPORTED_CHAINS,
} from "@/lib/utils";
import { connect, disconnect, StarknetWindowObject } from "starknetkit";
import { WebWalletConnector } from "starknetkit/webwallet";
import { InjectedConnector } from "starknetkit/injected";
import NFTAbi from "@/public/nft.abi.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  byteArray,
  Contract,
  num,
  RpcProvider,
  TransactionExecutionStatus,
} from "starknet";
import { toast } from "react-toastify";
import { TwitterShareButton } from "react-share";
import Image from "next/image";
import nftImage from "../public/nft.jpeg";
import { Icons } from "./Icons";
import { motion } from "framer-motion"
import ShareButton from "./ShareButton";

// todo add support for SN chain switch
// todo confirm copy
// todo verify actually send msg
// todo add error handling

const MOBILE_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export function HeroSection() {
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [chainId, setchainId] = useState(isMainnet() ? 1 : 11155111)
  const [activeStep, setActiveStep] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [snAddress, setSnAddress] = useState<string | undefined>("");
  const [snWindowObject, setSnWindowObject] = useState<
    StarknetWindowObject | null | undefined
  >(null);
  const [minting, setMinting] = useState(false);
  const [mintCompleted, setMintCompleted] = useState(false);
  const [sourceTransaction, setSourceTransaction] = useState<
    string | undefined
  >("abc");
  const [sourceUserAddress, setSourceUserAddress] = useState<
    string | undefined
  >("0x1");

  const messageToSign = MESSAGE;

  const activeClass = "text-blue-600 dark:text-blue-500";

  const isMobile = useIsMobile();
  const connectSNWallet = async () => {
    const { wallet, connectorData } = await connect({
      connectors: getConnectors(isMobile)
    });

    if (wallet && connectorData) {
      setSnAddress(connectorData.account);
      setSnWindowObject(wallet);
    }
  };

  const provider = new RpcProvider({
    nodeUrl: `https://free-rpc.nethermind.io/${
      isMainnet() ? "mainnet" : "sepolia"
    }-juno/`,
  });

  async function waitForTransaction(hash: string) {
    while (true) {
      try {
        const receipt = await provider.getTransactionReceipt(hash);
        if (receipt.isSuccess()) {
          setMintCompleted(true);
          setMinting(false);
          setShowShareModal(true);
          toast.success("NFT minted successfully", {
            position: "top-right",
          });
          break;
        } else if (
          receipt.statusReceipt == "rejected" ||
          receipt.statusReceipt == "error" ||
          receipt.statusReceipt == "reverted"
        ) {
          setMinting(false);
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn("error status", e);
      }
    }
  }

  const mintNFT = async () => {
    if (snWindowObject && sourceTransaction && sourceUserAddress) {
      setMinting(true);

      const nftAddr = process.env.NEXT_PUBLIC_NFT_ADDRESS!;
      const contract = new Contract(NFTAbi, nftAddr, provider);
      const call = contract.populate("mint", {
        tx_hash: sourceTransaction,
        chain_id: 0,
        user_address: num.getDecimalString(sourceUserAddress),
      });
      const calldata: string[] = call.calldata as string[];
      snWindowObject
        .request({
          type: "wallet_addInvokeTransaction",
          params: {
            calls: [
              {
                contract_address: nftAddr,
                entry_point: "mint",
                calldata,
              },
            ],
          },
        })
        .then((tx: { transaction_hash: string }) => {
          console.log("tx", tx);
          waitForTransaction(tx.transaction_hash);
        })
        .catch((e: any) => {
          toast.error("Error", {
            position: "top-right",
          });
          console.error("error", e);
          setMinting(false);
        });
    } else {
      alert("Please connect Starknet wallet first");
    }
  };

  function onSuccessStep1(txHash: string, userAddress: string) {
    setActiveStep(2);
    setSourceTransaction(txHash);
    setSourceUserAddress(userAddress);
  }

  async function myDisconnect() {
    await disconnect();

    setSnAddress(undefined);
    setSnWindowObject(null);
  }

  return (
    <div className="flex flex-col items-center text-center mt-8 mb-12 max-w-4xl mx-auto mt-[150px]">
      {/* Main Heading */}
      {/* <h1 className="text-2xl md:text-2xl font-bold mb-4">
        The First L2 to Settle on Both Bitcoin & Ethereum
      </h1> */}
      <motion.h1
          className="text-2xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
        >
           The First L2 to Settle on both Bitcoin & Ethereum
        </motion.h1>

      {/* Subtitle */}
      <p className="text-md md:text-xl text-gray-300 mb-6">
        Securely scaling Bitcoin and Ethereum to realize Bitcoin's full vision.
      </p>

      {/* CTA */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        {/* Overlay for Background Opacity */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" />
        )}

        <DialogContent className=" p-10 sm:max-w-xl bg-gradient-to-b from-gray-900 to-black text-white rounded-2xl shadow-2xl z-[9999] transition-all border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-semibold">
              🎉 Congrats for minting your NFT on Starknet! 🚀
            </DialogTitle>
            <DialogDescription>
              <div className="flex w-full items-center justify-center my-4">
                <Image
                  src={nftImage}
                  alt="NFT Image"
                  className="h-[120px] w-[120px] rounded-lg shadow-lg"
                />
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* Share Button */}
          <div className="mt-2 flex items-center justify-center">
            <ShareButton/>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mint Steps */}
      <Dialog open={showMintModal} onOpenChange={setShowMintModal}>
        {/* Overlay for Background Opacity */}
        {showMintModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" />
        )}

        <DialogContent className=" p-10 sm:max-w-xl bg-gradient-to-b from-gray-900 to-black text-white rounded-2xl shadow-2xl z-[9999] transition-all border border-gray-800">
          <div className="w-full flex flex-col">
          <p className="text-sm md:text-md mb-6">
          Send the following message on your preferred chain and mint the SWMF NFT on Starknet to commemorate this historic moment for Starknet!
          </p>

          {/* Steps */}
          <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base mb-[20px]">
            <li
              className={`flex md:w-full items-center ${
                activeStep == 1 ? activeClass : ""
              } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
            >
              <span className="min-w-[135px] flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                <span className="me-2">1.</span>
                Send Message
              </span>
            </li>
            <li
              className={`flex items-center min-w-[100px] ${
                activeStep == 2 ? activeClass : ""
              }`}
            >
              <span className="me-2">2.</span>
              Mint NFT
            </li>
          </ol>

          {/* Chain Selection Dropdown */}
          {activeStep == 1 && (
            <div className="mb-6 flex items-center justify-center">
              <select
                value={selectedChain}
                onChange={(e) => {
                  setSelectedChain(e.target.value)
                  const selectedChainData = SUPPORTED_CHAINS.find(
                    (chain) => chain.id === e.target.value
                  );               
                  if (selectedChainData) {
                    setchainId(selectedChainData?.chainId)
                  }
                }}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 w-full max-w-xs"
              >
                {SUPPORTED_CHAINS.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Connect Wallet Button */}
          {activeStep == 1 && (
            <div>
              <EVMSigner protocolChainSelected={chainId} onSuccess={onSuccessStep1} />
            </div>
          )}
          {activeStep == 2 && (
            <div>
              <p className="mb-2 text-[13px] text-[#808080]">Your NFT will be minted on Starknet. If you don't have one, you can either install or signup using your email on Argent{"'"}s Web wallet.</p>
              <div className="flex w-full gap-2 items-center justify-center">
                <button
                  className={cn(
                    "bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors mb-1",
                    snAddress ? "bg-purple-600/20 hover:bg-purple-700/30" : ""
                  )}
                  onClick={() => {
                    snAddress ? myDisconnect() : connectSNWallet();
                  }}
                >
                  {snAddress
                    ? `Starknet: ${shortAddress(snAddress)}`
                    : "Connect Starknet Wallet"}
                </button>
                {snAddress && (
                  <button
                    className={`flex gap-4 items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors mb-1 ${
                      minting || mintCompleted
                        ? "disabled:bg-green-700/40 disabled:cursor-not-allowed disabled:text-white/40"
                        : ""
                    }`}
                    onClick={mintNFT}
                    disabled={minting || mintCompleted}
                  >
                    {mintCompleted ? "Mint Successfull" : "Mint NFT"}
                    {minting && (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-black"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </button>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-8">
                  Source Tx: {shortAddress(sourceTransaction)} | Source User: {shortAddress(sourceUserAddress)}
                </p>
              </div>
            </div>
          )}

          {/* Message to Sign */}
          {activeStep == 1 && <div className="bg-gray-800 p-4 text-left" style={{borderRadius: '20px'}}>
            <h3 className="text-gray-400 mb-2 text-sm">Message to sign:</h3>
            <p className="text-white text-[14px] font-mono">{messageToSign}</p>
          </div>}
        </div>
        </DialogContent>
      </Dialog>

      <button 
        className="px-10 py-2 bg-white text-black"
        onClick={() => setShowMintModal(true)}
      >Mint NFT</button>
    </div>
  );
}
