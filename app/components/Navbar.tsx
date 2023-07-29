"use client";
import React from "react";
import {
    Box,
    Button,
    Flex,
    useDisclosure,
    HStack,
    Image,
} from "@chakra-ui/react";
import { getNetwork } from "@/app/chains";
import { currentWallet } from "@/app/wallets";
import { Address } from "./Address";
import { WalletModal } from "./WalletModal";

const { disconnect, useChainId, useIsConnected, useAccount, useEnsName } =
    currentWallet;

export function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isConnected = useIsConnected();
    const chainId = useChainId();
    const account = useAccount();
    const ensName = useEnsName(getNetwork(chainId));

    return (
        <>
            <WalletModal isOpen={isOpen} onClose={onClose} />
            <Flex
                bg="gray.300"
                px={8}
                py={4}
                alignItems="center"
                justifyContent="space-between"
            >
                <HStack gap={6}>
                    <Box>
                        <Image
                            width={10}
                            height={10}
                            src="/cronos.svg"
                            alt="Logo"
                        />
                    </Box>
                    {isConnected && (
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
                    )}
                </HStack>
                <Button
                    onClick={onOpen}
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                        bg: "blue.500",
                    }}
                >
                    {isConnected &&
                        (ensName || <Address address={account as string} />)}
                    {!isConnected && "Login"}
                </Button>
            </Flex>
        </>
    );
}
