import { useMemo } from "react";
import { getChainConfig } from "../chains";
import { currentWallet } from "../wallets";
import { ethers } from "ethers";

export const useJsonRpcProvider = (): ethers.JsonRpcProvider => {
    const walletChainId = currentWallet.useChainId();
    const { chainName, ensAddress, rpcUrls, chainId } =
        getChainConfig(walletChainId);
    const rpcUrl = rpcUrls[0];

    return useMemo(() => {
        return new ethers.JsonRpcProvider(rpcUrl, {
            name: chainName,
            chainId,
            ensAddress,
        });
    }, [chainName, chainId, rpcUrl, ensAddress]);
};
