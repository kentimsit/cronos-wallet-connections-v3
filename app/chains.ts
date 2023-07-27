import type { Network } from "@ethersproject/providers";
import type { AddEthereumChainParameter } from "@web3-wallet/react";

const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY;
const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

export const chainConfigs: AddEthereumChainParameter[] = [
    {
        chainId: 1,
        chainName: "Mainnet",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        rpcUrls: [
            INFURA_KEY ? `https://mainnet.infura.io/v3/${INFURA_KEY}` : "",
            ALCHEMY_KEY
                ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`
                : "",
            "https://cloudflare-eth.com",
        ],
        blockExplorerUrls: ["https://etherscan.io"],
    },
    {
        chainId: 25,
        chainName: "Cronos",
        nativeCurrency: {
            name: "CRO",
            symbol: "CRO",
            decimals: 18,
        },
        rpcUrls: ["https://evm.crypto.org"],
        blockExplorerUrls: ["https://cronoscan.com/"],
    },
    {
        chainId: 5,
        chainName: "Görli",
        nativeCurrency: {
            name: "Görli Ether",
            symbol: "ETH",
            decimals: 18,
        },
        rpcUrls: [
            INFURA_KEY ? `https://goerli.infura.io/v3/${INFURA_KEY}` : "",
        ],
    },
    {
        chainId: 3,
        chainName: "Ropsten",
        nativeCurrency: {
            name: "Ropsten Ether",
            symbol: "ETH",
            decimals: 18,
        },
        rpcUrls: [
            INFURA_KEY ? `https://ropsten.infura.io/v3/${INFURA_KEY}` : "",
        ],
        blockExplorerUrls: ["https://ropsten.etherscan.io"],
    },
    {
        chainId: 338,
        chainName: "Cronos Testnet",
        nativeCurrency: {
            name: "TCRO",
            symbol: "TCRO",
            decimals: 18,
        },
        rpcUrls: [`https://evm-t3.cronos.org`],
        blockExplorerUrls: ["https://testnet.cronoscan.com/"],
    },
].map(
    (v) =>
        ({
            ...v,
            rpcUrls: v.rpcUrls.filter((url) => !!url),
        }) as AddEthereumChainParameter,
);

const networks: Network[] = [
    {
        name: "Mainnet",
        chainId: 1,
        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    },
    {
        name: "Goerli",
        chainId: 5,
        ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    },
    {
        name: "Cronos Test",
        chainId: 338,
        ensAddress: "0x16a23bFBcE9c53998c90201629E4cDB40B81B127",
    },
    {
        name: "Cronos",
        chainId: 25,
        ensAddress: "0x7F4C61116729d5b27E5f180062Fdfbf32E9283E5",
    },
];

export const getNetwork = (chainId?: number): Network | undefined => {
    return chainId ? networks.find((v) => v.chainId === chainId) : undefined;
};

export const getChainConfigs = (chainId: number) => {
    return chainConfigs.find(
        (v) => v.chainId === chainId,
    ) as AddEthereumChainParameter;
};

export const rpcMap: { [chainId: number]: string } = chainConfigs.reduce<{
    [chainId: number]: string;
}>((acc, params) => {
    acc[params.chainId] = params.rpcUrls[0];
    return acc;
}, {});

export const getAddChainParameters = (
    chainId: number,
): AddEthereumChainParameter | undefined =>
    chainConfigs.find((v) => v.chainId === chainId);
