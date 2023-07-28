"use client";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import useStore from "@/app/store/store";
import {
    Box,
    Button,
    Flex,
    Stack,
    VStack,
    Image,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    useToast,
} from "@chakra-ui/react";
import { getNetwork, getAddChainParameters } from "@/app/chains";
import { currentWallet, getWalletConfig, walletConfigs } from "@/app/wallets";
import { MetaMask } from "@web3-wallet/metamask";
import { DeFiWallet } from "@web3-wallet/defiwallet";
import { TrustWallet } from "@web3-wallet/trust-wallet";
import { WalletConnect } from "@web3-wallet/walletconnect";
import type { WalletName } from "@web3-wallet/react";

const {
    useWalletName,
    autoConnect,
    disconnect,

    useChainId,
    useIsConnecting,
    useIsConnected,

    useAccount,
    useBalance,
    useEnsName,

    connectAsCurrentWallet,
} = currentWallet;

const shortenAddress = (address: string): string => {
    if (!address) {
        console.log("Please provide a valid address");
        return address;
    }

    // Check if the provided string is a valid Ethereum address
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        console.log("Provided string is not a valid Ethereum address");
        return address;
    }

    // Ensure address starts with '0x'
    if (!address.startsWith("0x")) {
        address = "0x" + address;
    }

    // Return the shortened address
    return (
        address.substring(0, 5) +
        "..." +
        address.substring(address.length - 4, address.length)
    );
};

export function Navbar() {
    const context = useStore((state) => state.context);
    const loading = useStore((state) => state.loading);
    const [error, setError] = useState<null | string>(null);
    const [mounted, setMounted] = React.useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const walletName = useWalletName();
    const isConnecting = useIsConnecting();
    const isConnected = useIsConnected();
    const chainId = useChainId();
    const account = useAccount();
    const ensName = useEnsName(getNetwork(chainId));
    const balance = useBalance();

    useEffect(() => {
        autoConnect();
    }, []);

    React.useEffect(() => setMounted(true), []);

    const changeWallet = useCallback(
        (newWalletName: WalletName) => {
            connectAsCurrentWallet(newWalletName, getAddChainParameters(25));
            onClose();
        },
        [onClose],
    );

    const LoginButtonComponent = () => {
        let text = "Log in";
        if (isConnected && account) {
            text = shortenAddress(account);
        }
        return (
            <Button
                onClick={() => {
                    onOpen();
                }}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                    bg: "blue.500",
                }}
            >
                {text}
            </Button>
        );
    };

    const LogoutButtonComponent = () => {
        if (isConnected) {
            return (
                <Button
                    onClick={() => {
                        disconnect();
                    }}
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                        bg: "blue.500",
                    }}
                >
                    Log out
                </Button>
            );
        } else {
            return null;
        }
    };

    const ModalComponent = () => {
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Wallet options</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing="10px">
                            <Button
                                onClick={() => {
                                    changeWallet(MetaMask.walletName);
                                }}
                                bg={"blue.100"}
                                color={"black"}
                                _hover={{
                                    bg: "blue.300",
                                }}
                                width="250px"
                                leftIcon={
                                    <Image
                                        boxSize="20px"
                                        src="metamask.png"
                                        alt="metamask"
                                    />
                                }
                            >
                                MetaMask / Rabby
                            </Button>
                            <Button
                                onClick={() => {
                                    changeWallet(DeFiWallet.walletName);
                                }}
                                bg={"blue.100"}
                                color={"black"}
                                _hover={{
                                    bg: "blue.300",
                                }}
                                width="250px"
                                leftIcon={
                                    <Image
                                        boxSize="20px"
                                        src="cryptocom_defiwallet.png"
                                        alt="crypto.com defi wallet"
                                    />
                                }
                            >
                                Crypto.com DeFi Wallet
                            </Button>
                            <Button
                                onClick={() => {
                                    changeWallet(TrustWallet.walletName);
                                }}
                                bg={"blue.100"}
                                color={"black"}
                                _hover={{
                                    bg: "blue.300",
                                }}
                                width="250px"
                                leftIcon={
                                    <Image
                                        boxSize="20px"
                                        src="trustwallet.png"
                                        alt="trust wallet"
                                    />
                                }
                            >
                                Trust Wallet
                            </Button>
                            <Button
                                onClick={() => {
                                    changeWallet(WalletConnect.walletName);
                                }}
                                bg={"blue.100"}
                                color={"black"}
                                _hover={{
                                    bg: "blue.300",
                                }}
                                width="250px"
                                leftIcon={
                                    <Image
                                        boxSize="20px"
                                        src="walletconnect.png"
                                        alt="wallet connect"
                                    />
                                }
                            >
                                Wallet Connect
                            </Button>
                        </VStack>
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        );
    };

    // Before component is mounted, return empty nav bar
    if (!mounted)
        return (
            <div>
                <Box bg="gray.300" px={4}>
                    <Flex
                        h={16}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Box>Logo</Box>
                    </Flex>
                </Box>
            </div>
        );

    return (
        <div>
            <Box bg="gray.300" px={4}>
                <Flex
                    h={16}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Box>Logo</Box>

                    <Flex alignItems={"center"}>
                        <Stack direction={"row"} spacing={5}>
                            <LogoutButtonComponent />
                            <LoginButtonComponent />
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
            <ModalComponent />
        </div>
    );
}
