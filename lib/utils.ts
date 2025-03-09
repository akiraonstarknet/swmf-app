import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { constants, num } from "starknet";
import {
  ArgentMobileConnector,
  isInArgentMobileAppBrowser,
} from "starknetkit/argentMobile";
import {
  BraavosMobileConnector,
  isInBraavosMobileAppBrowser,
} from "starknetkit/braavosMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { StarknetkitConnector } from "starknetkit";
import { InjectedConnector } from "starknetkit/injected";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isMainnet() {
  return process.env.NEXT_PUBLIC_NETWORK === "mainnet"
}

export const MESSAGE = "Starknet to be the first L2 to settle on both Bitcoin and Ethereum. Working towards truely realising the bitcoin vision: Decentralised low cost global payments system."

export const SUPPORTED_CHAINS = isMainnet() ? [
  // { id: "starknet", name: "Starknet", plugin: "starknet" },
  { id: "ethereum", name: "Ethereum", plugin: "evm",chainId:1 },
  { id: "base", name: "Base", plugin: "evm",chainId:8453 },
  { id: "optimism", name: "Optimism", plugin: "evm",chainId:10 },
  // { id: "solana", name: "Solana", plugin: "solana" },
  { id: "arbitrum", name: "Arbitrum", plugin: "evm",chainId:42161 },
]: [
  // { id: "starknet", name: "Starknet", plugin: "starknet" },
  { id: "ethereum", name: "Ethereum", plugin: "evm",chainId:11155111 },
  { id: "base", name: "Base", plugin: "evm",chainId:84532 },
  { id: "optimism", name: "Optimism", plugin: "evm",chainId:11155420 },
  // { id: "solana", name: "Solana", plugin: "solana" },
  { id: "arbitrum", name: "Arbitrum", plugin: "evm",chainId:421614 },
]

export function shortAddress(
  _address: string | undefined,
  startChars = 4,
  endChars = 4,
) {
  if (!_address) return "";
  const x = num.toHex(num.getDecimalString(_address));
  return truncate(x, startChars, endChars);
}

export function truncate(str: string, startChars: number, endChars: number) {
  if (str.length <= startChars + endChars) {
    return str;
  }

  return `${str.slice(0, startChars)}...${str.slice(
    str.length - endChars,
    str.length,
  )}`;
}

export function getConnectors(isMobile: boolean) {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  const mobileConnector = ArgentMobileConnector.init({
    options: {
      dappName: "SWMF",
      url: hostname,
      chainId: constants.NetworkName.SN_MAIN,
    },
    inAppBrowserOptions: {},
  }) as StarknetkitConnector;

  const argentXConnector = new InjectedConnector({
    options: {
      id: "argentX",
      name: "Argent X",
    },
  }) as unknown as StarknetkitConnector;

  const braavosConnector = new InjectedConnector({
    options: {
      id: "braavos",
      name: "Braavos",
    },
  }) as unknown as StarknetkitConnector;

  const keplrConnector = new InjectedConnector({
    options: {
      id: "keplr",
      name: "Keplr",
    },
  }) as unknown as StarknetkitConnector;

  const braavosMobile = BraavosMobileConnector.init({
    inAppBrowserOptions: {},
  }) as StarknetkitConnector;

  const webWalletConnector = new WebWalletConnector({
    url: "https://web.argent.xyz",
  }) as StarknetkitConnector;

  const _isMainnet = isMainnet();

  if (_isMainnet) {
    if (isInArgentMobileAppBrowser()) {
      return [mobileConnector];
    } else if (isInBraavosMobileAppBrowser()) {
      return [braavosMobile];
    } else if (isMobile) {
      return [mobileConnector, braavosMobile, webWalletConnector];
    }
    return [
      argentXConnector,
      braavosConnector,
      keplrConnector,
      mobileConnector,
      webWalletConnector,
    ];
  }
  return [argentXConnector, braavosConnector, keplrConnector];
}