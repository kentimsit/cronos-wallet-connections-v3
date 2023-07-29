"use client";
import { ethers } from "ethers";
import { VStack, Text } from "@chakra-ui/react";
import useStore from "@/app/store/store";
import { useEffect, useState } from "react";
import { currentWallet } from "../wallets";
import { Crc20__factory } from "@/contracts/types";
import { Loading } from "./Loading";

const { useIsConnected, useAccount } = currentWallet;

function parseAndRoundDecimal(decimalString: string) {
    let number = parseFloat(decimalString);
    if (isNaN(number)) {
        return "0.00";
    }
    return number.toFixed(2);
}

export function ReadChain() {
    const readData = useStore((state) => state.readData);
    const readDataAction = useStore((state) => state.setReadData);
    const isConnected = useIsConnected();
    const account = useAccount();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let canceled = false;

        async function readData() {
            if (!isConnected || isLoaded) return;

            const backendBlockchainProvider =
                new ethers.providers.JsonRpcProvider(
                    process.env.NEXT_PUBLIC_BLOCKCHAIN_URL as string,
                );

            const usdcContract = Crc20__factory.connect(
                "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
                backendBlockchainProvider,
            );

            try {
                const [blockNumber, croBalanceBN, usdcBalanceBN] =
                    await Promise.all([
                        backendBlockchainProvider.getBlockNumber(),
                        backendBlockchainProvider.getBalance(account as string),
                        usdcContract.balanceOf(account as string),
                    ]);

                const croBalance = ethers.utils.formatEther(
                    croBalanceBN.toString(),
                );

                const usdcBalance = ethers.utils.formatUnits(
                    usdcBalanceBN.toString(),
                    6,
                );

                if (!canceled) {
                    const newReadData = {
                        blockNumber: blockNumber,
                        croBalance: parseAndRoundDecimal(croBalance),
                        usdcBalance: parseAndRoundDecimal(usdcBalance),
                    };
                    readDataAction(newReadData);
                }
            } finally {
                if (!canceled) setIsLoaded(true);
            }
        }

        readData();

        return () => {
            canceled = true;
        };
    }, [isLoaded, isConnected, account, readDataAction]);

    if (!isLoaded) return <Loading />;

    return (
        <VStack spacing={3} alignItems="flex-start" fontSize="xl" color="black">
            <Text>Block number: {readData.blockNumber}</Text>
            <Text>CRO balance: {readData.croBalance}</Text>
            <Text>USDC balance: {readData.usdcBalance}</Text>
        </VStack>
    );
}
