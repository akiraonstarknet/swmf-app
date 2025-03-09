import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cn, isMainnet, MESSAGE, shortAddress } from '@/lib/utils'
import { http, createConfig, WagmiProvider, useAccount, useConnect, useDisconnect, useSendTransaction, useWaitForTransactionReceipt, usePublicClient} from 'wagmi'
import { arbitrum, arbitrumSepolia, base, baseSepolia, mainnet, optimism, optimismSepolia, sepolia } from 'wagmi/chains'
import { ConnectKitButton, ConnectKitProvider, getDefaultConfig } from "connectkit";
import * as ethers from 'ethers';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getChainId } from 'viem/actions';

const WALLET_CONNECT_DEFAULT_PROJECT_ID = "242405a2808ac6e90831cb540f36617f"; // akira@unls.com wallet connect account

export const config = createConfig(getDefaultConfig({
    chains: isMainnet() ? [mainnet,base,arbitrum,optimism] : [sepolia,baseSepolia,arbitrumSepolia,optimismSepolia],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [baseSepolia.id]:http(),
    },
    walletConnectProjectId: WALLET_CONNECT_DEFAULT_PROJECT_ID,
    appName: "SWMF",
    appDescription: "Bridge funds to Starknet dApps in a single click",
    appUrl: "https://swmf.fun", // your app's url
    appIcon: "https://swmf.fun/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
}))

export const supportEVMChains = isMainnet() ? [{
    name: "Ethereum",
}] : [{
    name: "Sepolia"
}];

export interface SignerComponentProps {
    onSuccess: (txHash: string, userAddress: string) => void;
}

const queryClient = new QueryClient()
export const EVMSigner = (props: SignerComponentProps & { protocolChainSelected: number }) => {
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>
            <EVMAction {...props}/>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    );
};
  
export function EVMAction(props: SignerComponentProps & { protocolChainSelected: number }) {
    const disconnect = useDisconnect();
    const publicClient = usePublicClient();
    const {chainId}=useAccount()
    const { data: hash, sendTransactionAsync } = useSendTransaction()

    const { data: txData, status: txStatus, isError, isLoading } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (txData && hash && txStatus == 'success') {
            props.onSuccess(hash, txData.from)
        }
    }, [txData, hash])

    async function sign() {
        console.log('ethers', ethers, ethers.hexlify(ethers.toUtf8Bytes(MESSAGE)))
        sendTransactionAsync({
            // chainId: sepolia.id,
            to: "0x0000000000000000000000000000000000000000",
            data: ethers.hexlify(ethers.toUtf8Bytes(MESSAGE)) as `0x${string}`,
            value: ethers.parseEther("0"),
        }).then((tx) => {
            console.log('tx', tx)
        }).catch((e) => {
            toast.error('Error',{
                position:'bottom-right'
            })
            console.error('error', e)
        });
    }

    return <ConnectKitButton.Custom>
            {({ isConnected, isConnecting, show, hide, address, ensName, chain, truncatedAddress }) => {
            return (
                <div>
                    {address &&(chainId!==props.protocolChainSelected) &&<div className='mb-4 text-red-600'>
                        Incorrect Chain Detected! Please switch to the correct chain in your wallet to continue
                    </div>}
                    <div className='flex w-full gap-2 items-center justify-center'>
                        <button
                            className={cn(
                                "bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors mb-1",
                                isConnected ? "bg-purple-600/20 hover:bg-purple-700/30" : "",
                            )}
                            onClick={() => {
                                address ? disconnect.disconnectAsync() : (show ? show(): null)
                            }}
                        >
                        {address ? `${ensName || truncatedAddress}` : "Connect Wallet"}
                        </button>
                        {address && <button 
                            className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 ${hash ? 'disabled:bg-green-700/40 disabled:cursor-not-allowed disabled:text-white/40' : ''} text-white font-bold py-3 px-8 rounded-lg transition-colors mb-1`}
                            onClick={sign}
                            disabled={isLoading || txStatus == 'success' || chainId!==props.protocolChainSelected}
                        >
                            Send Message 
                            {isLoading && <div role="status">
                                <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>}
                        </button>}
                    </div>
                    <div className='flex gap-4 items-center justify-center mb-8'>
                        {hash && <p>Tx Hash:{" "}
                            <a href={`${publicClient?.chain.blockExplorers?.default.url}/tx/${hash}`} target='_blank' className='underline'>{shortAddress(hash)}</a>
                            {"  | "} Status: {txStatus}
                        </p>}
                    </div>
                </div>
            );
        }}
        </ConnectKitButton.Custom>
}