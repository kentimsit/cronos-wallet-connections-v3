"use client";
import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

import { getNetwork } from "@/app/chains";
import { currentWallet } from "@/app/wallets";
import { ReadChain } from "./ReadChain";
import { WriteChain } from "./WriteChain";

const {
    useWalletName,
    connect,
    autoConnect,
    disconnect,

    useIsConnecting,
    useIsConnected,

    useAccount,
    useChainId,
    useBalance,
    useEnsName,
} = currentWallet;

export function Welcome() {
    const [mounted, setMounted] = React.useState(false);
    const walletName = useWalletName();
    const isConnected = useIsConnected();
    const chainId = useChainId();
    const account = useAccount();
    const ensName = useEnsName(getNetwork(chainId));
    const balance = useBalance();

    React.useEffect(() => setMounted(true), []);
    if (!mounted) return <></>;

    const WalletComponent = () => {
        if (isConnected && account && balance) {
            let ensNameText = ensName ? `(${ensName})` : "";
            if (ensNameText === "undefined") ensNameText = "";
            return (
                <VStack spacing={3} align="left">
                    <Text fontSize="xl" color="black" align="left">
                        Wallet connected: {walletName}
                    </Text>
                    <Text fontSize="xl" color="black" align="left">
                        Chain ID: {chainId}
                    </Text>
                    <Text fontSize="xl" color="black" align="left">
                        Wallet address: {account} {ensNameText}
                    </Text>
                </VStack>
            );
        } else {
            return (
                <VStack spacing={3} align="left">
                    <Text fontSize="xl" color="black" align="left">
                        No wallet information yet.
                    </Text>
                    <Text fontSize="xl" color="black" align="left">
                        Please log in.
                    </Text>
                </VStack>
            );
        }
    };

    return (
        <div>
            <Box m={5}>
                <Text fontSize="4xl" color="black">
                    Web3 Wallet Connection Demo
                </Text>
            </Box>
            <Box w="100%" m={5}>
                <WalletComponent />
            </Box>
            <Box w="100%" m={5}>
                <ReadChain />
            </Box>
            <Box m={5}>
                <WriteChain />
            </Box>
        </div>
    );
}
