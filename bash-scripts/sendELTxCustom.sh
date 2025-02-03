#!/bin/bash

# Load variables from .env file
set -o allexport
source $(dirname "$0")/../.env
set +o allexport

# Round passed as argument
round=$1
sequenceNumber=$2
nonce=$3  
if [ -z $round ] || [ -z $sequenceNumber ]
then
    echo "Pass the round number as the first parameter and sequence number as the second: ./sendELTxs.sh <roundNumber> <sequenceNumber> [nonce]"
    exit 1
fi
hexedRound=$(cast to-hex $round | cut -c 3-)
paddedRound=$(printf 0x%16s $hexedRound | tr ' ' 0)

# Get chain id
chainId=$(cast chain-id -r $RPC)
hexedChainId=$(cast to-hex $chainId | cut -c 3-)
paddedChainId=$(printf 0x%64s $hexedChainId | tr ' ' 0)

# EL transactions prefix
prefix=$(cast keccak "TIMEBOOST_BID")

hexedSequenceNumber=$(cast to-hex $sequenceNumber | cut -c 3-)
paddedSequenceNumber=$(printf 0x%16s $hexedSequenceNumber | tr ' ' 0)

echo $nonce

# Serialize transaction
if [ -n "$nonce" ]; then
    echo $nonce
    transaction=$(cast mktx -r $RPC --private-key $PRIVATE_KEY 0x0000000000000000000000000000000000000001 --value 1 --nonce $nonce)
else
    transaction=$(cast mktx -r $RPC --private-key $PRIVATE_KEY 0x0000000000000000000000000000000000000001 --value 1)
fi


# Creating signature
dataToSign=$(cast concat-hex $prefix $paddedChainId $TB_AUCTION_CONTRACT_ADDRESS $paddedRound $paddedSequenceNumber $transaction)
signature=$(cast wallet sign --private-key $PRIVATE_KEY $dataToSign)

# Create payload
payload=$(cat <<EOF
    {
        "jsonrpc": "2.0",
        "id": "express-lane-tx-$sequenceNumber",
        "method": "timeboost_sendExpressLaneTransaction",
        "params": [{
            "chainId": "0x$hexedChainId",
            "round": "0x$hexedRound",
            "auctionContractAddress": "$TB_AUCTION_CONTRACT_ADDRESS",
            "sequenceNumber": "0x$hexedSequenceNumber",
            "transaction": "$transaction",
            "options": {},
            "signature": "$signature"
        }]
    }
EOF
)
echo $payload

curl -X POST $RPC -H "Content-Type: application/json" --data "$payload"
