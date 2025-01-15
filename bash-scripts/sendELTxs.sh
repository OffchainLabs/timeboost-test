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

# EL transactions prefix
prefix=$(cast keccak "TIMEBOOST_BID")

triggerNewBlockAndWait () {
    secondsToWait=$1
    sleep $secondsToWait
    cast send -r $RPC --private-key $PRIVATE_KEY 0x0000000000000000000000000000000000000000 --value 1
    sleep $secondsToWait
}

getELTxPayload () {
    # Initial sequence number
    sequenceNumber=$1
    walletNonce=$2
    hexedSequenceNumber=$(cast to-hex $sequenceNumber | cut -c 3-)
    paddedSequenceNumber=$(printf 0x%16s $hexedSequenceNumber | tr ' ' 0)

    # Serialize transaction
    transaction=$(cast mktx -r $RPC --private-key $PRIVATE_KEY 0x0000000000000000000000000000000000000001 --value 1 --nonce $walletNonce)
    
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
}

# Getting all payloads
sequenceNumberCount=0
walletNonceCount=$(cast nonce -r $RPC $(cast wallet address $PRIVATE_KEY))
elTx0=$(getELTxPayload $sequenceNumberCount $walletNonceCount)

sequenceNumberCount=$((sequenceNumberCount+1))
walletNonceCount=$((walletNonceCount+1))
elTx1=$(getELTxPayload $sequenceNumberCount $walletNonceCount)

sequenceNumberCount=$((sequenceNumberCount+1))
walletNonceCount=$((walletNonceCount+1))
elTx2=$(getELTxPayload $sequenceNumberCount $walletNonceCount)

sequenceNumberCount=$((sequenceNumberCount+1))
walletNonceCount=$((walletNonceCount+1))
elTx3=$(getELTxPayload $sequenceNumberCount $walletNonceCount)

sequenceNumberCount=$((sequenceNumberCount+1))
walletNonceCount=$((walletNonceCount+1))
elTx4=$(getELTxPayload $sequenceNumberCount $walletNonceCount)

# Sending transactions in a different order
curl -X POST $RPC -H "Content-Type: application/json" --data "$elTx0" &
curl -X POST $RPC -H "Content-Type: application/json" --data "$elTx2" &
curl -X POST $RPC -H "Content-Type: application/json" --data "$elTx4" &
curl -X POST $RPC -H "Content-Type: application/json" --data "$elTx1" &
curl -X POST $RPC -H "Content-Type: application/json" --data "$elTx3" &
