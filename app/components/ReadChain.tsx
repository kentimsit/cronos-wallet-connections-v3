"use client";
import { ethers } from "ethers";
import { VStack, Text } from "@chakra-ui/react";
import useStore from "@/app/store/store";
import { useEffect } from "react";
import { currentWallet } from "../wallets";
import crc20Abi from '@/contract_abi/crc20_abi.json';


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

    useEffect(() => {
        async function getReadData() {
            if (isConnected && account) {
                const backendBlockchainProvider = new ethers.providers.JsonRpcProvider(
                    process.env.NEXT_PUBLIC_BLOCKCHAIN_URL as string,
                );
                const blockNumber =
                    await backendBlockchainProvider.getBlockNumber();
                const croBalanceBN = await backendBlockchainProvider.getBalance(
                    account,
                );
                const croBalance = ethers.utils.formatEther(croBalanceBN.toString());
                const usdcContract = new ethers.Contract(
                    "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
                    crc20Abi,
                    backendBlockchainProvider,
                );
                const usdcBalanceBN = await usdcContract.balanceOf(account);
                const usdcBalance = ethers.utils.formatUnits(
                    usdcBalanceBN.toString(),
                    6,
                );
                const newReadData = {
                    dataFetched: true,
                    blockNumber: blockNumber,
                    croBalance: parseAndRoundDecimal(croBalance),
                    usdcBalance: parseAndRoundDecimal(usdcBalance),
                };
                readDataAction(newReadData);
            }
        }
        getReadData();
    }, [isConnected, account, readDataAction]);

    if (readData.dataFetched) {
        return (
            <VStack spacing={3} align="left">
                <Text fontSize="xl" color="black" align="left">
                    Block number: {readData.blockNumber}
                </Text>
                <Text fontSize="xl" color="black" align="left">
                    CRO balance: {readData.croBalance}
                </Text>
                <Text fontSize="xl" color="black" align="left">
                    USDC balance: {readData.usdcBalance}
                </Text>
            </VStack>
        );
    } else {
        return null;
    }
}
