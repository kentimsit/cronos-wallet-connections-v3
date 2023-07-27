"use client";
import React from "react";
import useStore from "@/app/store/store";
import { Box, Image, Text, VStack } from "@chakra-ui/react";

import { getNetwork } from "@/app/chains";
import { currentWallet} from "@/app/wallets";
import { ReadChain } from "./ReadChain";
import { WriteChain } from "./WriteChain";

const {
    useWalletName,

    connect,
    autoConnect,
    disconnect,

    useIsConnecting,
    useIsConnected,

    useAccounts,
    useChainId,

    useBalances,
    useEnsNames,

    switchCurrentWallet,
} = currentWallet;

export function Welcome (){
    const context = useStore((state) => state.context);
    const loading = useStore((state) => state.loading);
    const [mounted, setMounted] = React.useState(false);
    const walletName = useWalletName();
    const isConnected = useIsConnected();
    const chainId = useChainId();
    const accounts = useAccounts();
    const ensNames = useEnsNames(getNetwork(chainId));
    const balances = useBalances();

    React.useEffect(() => setMounted(true), []);
    if (!mounted) return <></>;

    const LoadingComponent = () => {
        if (loading) {
            return (
                <Box boxSize="100px">
                    <Image src="loading.gif" alt="Loading" />
                </Box>
            );
        } else {
            return null;
        }
    };

    const WalletComponent = () => {
        if (isConnected && accounts && balances) {
            return (
                <VStack spacing={3} align="left">
                    <Text fontSize="xl" color="black" align="left" >
                        Wallet connected: {walletName}
                    </Text>
                    <Text fontSize="xl" color="black" align="left" >
                        Chain ID: {chainId}
                    </Text>
                    <Text fontSize="xl" color="black" align="left" >
                        Wallet address: {accounts[0]}
                    </Text>
                </VStack>
            );
        } else {
            return(
                <VStack spacing={3} align="left">
                <Text fontSize="xl" color="black" align="left" >
                    No wallet information yet.
                </Text>
                <Text fontSize="xl" color="black" align="left" >
                    Please log in.
                </Text>
            </VStack>
            )
        }
    };

    return (
        <div>
            <Box  m={5}>
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
            <Box  m={5}>
                <WriteChain />
            </Box>
        </div>
    );
};
