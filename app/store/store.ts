import { create } from "zustand";
import { ethers } from "ethers";
import { persist } from "zustand/middleware";

export interface IReadData {
    dataFetched: boolean;
    blockNumber: number;
    croBalance: string;
    usdcBalance: string;
}

export interface IState {
    context: string;
    setContext: (context: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    readData: IReadData;
    setReadData: (readData: IReadData) => void;
    lastTransactionHash: string;
    setLastTransactionHash: (lastTransactionHash: string) => void;
}

const useStore = create<IState>()(
    persist(
        (set) => ({
            context: "welcome",
            setContext: (context: string) => set({ context }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            readData: {
                dataFetched: false,
                blockNumber: 0,
                croBalance: "0",
                usdcBalance: "0",
            },
            setReadData: (readData: IReadData) => set({ readData }),
            lastTransactionHash: "",
            setLastTransactionHash: (lastTransactionHash: string) =>
                set({ lastTransactionHash }),
        }),
        {
            name: "app-storage-wefwe", // name of the item in the storage (must be unique)
        },
    ),
);

export default useStore;
