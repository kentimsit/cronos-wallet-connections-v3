"use client";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link, LinkProps, Text } from "@chakra-ui/react";

type TransactionLinkProps = Omit<LinkProps, "href"> & {
    txHash: string;
};

export function TransactionLink({
    txHash,
    ...linkProps
}: TransactionLinkProps) {
    const link = `https://cronoscan.com/tx/${txHash}`;

    return (
        <Link
            href={link}
            gap={1}
            isExternal
            display="flex"
            alignItems="center"
            {...linkProps}
        >
            <Text>Last transaction: {txHash}</Text>
            <ExternalLinkIcon />
        </Link>
    );
}
