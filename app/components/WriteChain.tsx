"use client";
import { ethers } from "ethers";
import { Text, Button, Link, Box, useToast, Image } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import useStore from "@/app/store/store";
import { currentWallet } from "../wallets";
import { useState } from "react";
import crc20Abi from "@/contract_abi/crc20_abi.json";

const { useIsConnected, useAccount, useProvider } = currentWallet;

export function WriteChain() {
    const lastTransactionHash = useStore((state) => state.lastTransactionHash);
    const lastTransactionHashAction = useStore(
        (state) => state.setLastTransactionHash,
    );
    const isConnected = useIsConnected();
    const account = useAccount();
    const web3Provider = useProvider();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const LoadingComponent = () => {
        if (isLoading) {
            return (
                <Box boxSize="100px">
                    <Image src="loading.gif" alt="Loading" />
                </Box>
            );
        } else {
            return null;
        }
    };

    const handleCroTransaction = async () => {
        if (isConnected && account && web3Provider) {
            const signer = web3Provider.getSigner();
            try {
                setIsLoading(true);

                const txResponse = await signer.sendTransaction({
                    to: account,
                    value: ethers.utils.parseEther("1"),
                });

                const receipt = await txResponse.wait();

                toast({
                    position: "top",
                    status: "success",
                    description: "You just sent 1 CRO to yourself",
                });

                lastTransactionHashAction(receipt.transactionHash);
            } catch (e: unknown) {
                toast({
                    position: "top",
                    status: "error",
                    description: (e as Error).message ?? "Transaction failed",
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleTokenTransaction = async () => {
        if (isConnected && account && web3Provider) {
            const signer = web3Provider.getSigner();
            try {
                setIsLoading(true);

                const usdcContractWithSigner = new ethers.Contract(
                    "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
                    crc20Abi,
                    signer,
                );
                const txResponse = await usdcContractWithSigner.transfer(
                    account,
                    ethers.utils.parseUnits("1", 6),
                );

                const receipt = await txResponse.wait();

                toast({
                    position: "top",
                    status: "success",
                    description: "You just sent 1 USDC to yourself",
                });

                lastTransactionHashAction(receipt.transactionHash);
            } catch (e: unknown) {
                toast({
                    position: "top",
                    status: "error",
                    description: (e as Error).message ?? "Transaction failed",
                });
            } finally {
                setIsLoading(false);
            }
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

    if (isConnected) {
        return (
            <Box>
                <Box my={3}>
                    <Button
                        isLoading={isLoading}
                        onClick={handleCroTransaction}
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
                    <Button
                        isLoading={isLoading}
                        onClick={handleTokenTransaction}
                        bg={"blue.400"}
                        color={"white"}
                        _hover={{
                            bg: "blue.500",
                        }}
                        size="md"
                    >
                        Transfer 1 USDC to myself
                    </Button>
                </Box>
                <Box my={3}>
                    <TransactionLinkComponent />
                </Box>
                <Box my={3}>
                    <LoadingComponent />
                </Box>
            </Box>
        );
    } else {
        return null;
    }
}
