#!/bin/bash

# Load variables from .env file
set -o allexport
source $(dirname "$0")/../.env
set +o allexport

# Round passed as argument
round=$1
if [ -z $round ]
then
    echo "Pass the round number as the first parameter: ./sendELTxs.sh <roundNumber>"
    exit 1
fi
hexedRound=$(cast to-hex $round | cut -c 3-)
paddedRound=$(printf 0x%16s $hexedRound | tr ' ' 0)

# Get chain id
chainId=$(cast chain-id -r $RPC)
hexedChainId=$(cast to-hex $chainId | cut -c 3-)
paddedChainId=$(printf 0x%64s $hexedChainId | tr ' ' 0)

# Serialize transaction
transaction=$(cast mktx -r $RPC --private-key $PRIVATE_KEY 0x0000000000000000000000000000000000000001 --value 1)

sendELTx () {
    # Initial sequence number
    sequenceNumber=$1
    hexedSequenceNumber=$(cast to-hex $sequenceNumber | cut -c 3-)
    paddedSequenceNumber=$(printf 0x%16s $hexedSequenceNumber | tr ' ' 0)
    
    # Creating signature
    prefix=$(cast keccak "TIMEBOOST_BID")
    dataToSign=$(cast concat-hex $prefix $paddedChainId $paddedSequenceNumber $TB_AUCTION_CONTRACT_ADDRESS $paddedRound $transaction)
    signature=$(cast wallet sign --private-key $PRIVATE_KEY $dataToSign)

    echo $dataToSign

    # Create payload
    payload=$(cat <<EOF
        {
            "jsonrpc": "2.0",
            "id": "express-lane-tx",
            "method": "timeboost_sendExpressLaneTransaction",
            "params": [{
                "chainId": "0x$hexedChainId",
                "round": "0x$hexedRound",
                "auctionContractAddress": "$TB_AUCTION_CONTRACT_ADDRESS",
                "sequence": "0x$hexedSequenceNumber",
                "transaction": "$transaction",
                "options": {},
                "signature": "$signature"
            }]
        }
EOF
    )
    echo $payload

    # Send request
    curl -X POST $RPC -H "Content-Type: application/json" --data "$payload"
}

sendELTx 3
sendELTx 4
