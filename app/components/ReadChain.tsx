"use client";
import { ethers } from "ethers";
import { VStack, Text } from "@chakra-ui/react";
import useStore from "@/app/store/store";
import { useEffect, useState } from "react";
import { currentWallet } from "../wallets";
import { Loading } from "./Loading";
import { isSupportedChainId } from "../chains";
import { useJsonRpcProvider } from "../hooks/useJsonRpcProvider";
import { useContractAddress } from "../hooks/useContractAddress";

import crc20Abi from "../../contracts/abis/Crc20.json";

const { useIsConnected, useAccount, useChainId } = currentWallet;

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
    const chainId = useChainId();
    const [isLoaded, setIsLoaded] = useState(false);
    const jsonRpcProvider = useJsonRpcProvider();
    const usdcAddress = useContractAddress("USDC");

    useEffect(() => {
        let canceled = false;

        async function readData() {
            if (!isConnected || !isSupportedChainId(chainId)) return;

            // const usdcContract = Crc20__factory.connect(
            //     usdcAddress,
            //     jsonRpcProvider,
            // );

            const usdcContract = new ethers.Contract(
                usdcAddress,
                crc20Abi,
                jsonRpcProvider,
            );

            try {
                const [blockNumber, croBalanceBN, usdcBalanceBN] =
                    await Promise.all([
                        jsonRpcProvider.getBlockNumber(),
                        jsonRpcProvider.getBalance(account as string),
                        usdcContract.balanceOf(account as string),
                    ]);

                const croBalance = ethers.formatEther(
                    croBalanceBN.toString(),
                );

                const usdcBalance = ethers.formatUnits(
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
    }, [
        jsonRpcProvider,
        usdcAddress,
        isLoaded,
        isConnected,
        account,
        readDataAction,
        chainId,
    ]);

    if (!isLoaded) return <Loading />;

    return (
        <VStack spacing={3} alignItems="flex-start" fontSize="xl" color="black">
            <Text>Block number: {readData.blockNumber}</Text>
            <Text>CRO balance: {readData.croBalance}</Text>
            <Text>USDC balance: {readData.usdcBalance}</Text>
        </VStack>
    );
}
