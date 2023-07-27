"use client";
import { ethers } from "ethers";
import { Text, Button, Link, VStack, Box } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import useStore from "@/app/store/store";
import { currentWallet } from "../wallets";
import { detectProvider } from "@web3-wallet/detect-provider";

const { useIsConnected, useAccounts, useProvider } = currentWallet;

export function WriteChain() {
    const lastTransactionHash = useStore((state) => state.lastTransactionHash);
    const lastTransactionHashAction = useStore(
        (state) => state.setLastTransactionHash
    );
    const isConnected = useIsConnected();
    const accounts = useAccounts();
    const web3Provider = useProvider();

    const handleTransaction = async () => {
        const hasProvider = await detectProvider();

        if (isConnected && accounts && hasProvider && web3Provider) {
            const signer = web3Provider.getSigner();
            const transaction = await signer.sendTransaction({
                to: accounts[0],
                value: ethers.parseEther("1"),
            });
            lastTransactionHashAction(transaction.hash);
        }
    };

    const TransactionLinkComponent = () => {
        if (lastTransactionHash !== "" || true) {
            const link = "https://cronoscan.com/tx/" + lastTransactionHash;
            return (
                <Link href={link} isExternal>
                    Last transaction: {lastTransactionHash}{" "}
                    <ExternalLinkIcon mx="2px" />
                </Link>
            );
        }
    };

    if (isConnected && accounts) {
        return (
            <Box>
                <Box my={3}>
                    <Button
                        onClick={() => {
                            handleTransaction();
                        }}
                        bg={"blue.400"}
                        color={"white"}
                        _hover={{
                            bg: "blue.500",
                        }}
                        size="md"
                    >
                        Transfer 1 CRO to myself
                    </Button>
                </Box>
                <Box my={3}>
                    <TransactionLinkComponent />
                </Box>
            </Box>
        );
    } else {
        return null;
    }
}
