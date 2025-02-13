#!/bin/bash

# Load variables from .env file
set -o allexport
source $(dirname "$0")/../.env
set +o allexport

if [ "$#" -ne 3 ]; then
    echo "Usage: ./submitBids.sh <private_key> <range_start> <range_end>"
    exit 1
fi

private_key=$1
range_start=$2
range_end=$3

for ((i=range_start; i<=range_end; i++)); do
    bid_amount=$(( (i % 10) + 1 )) 
    ./bidder-client \
    --wallet.private-key=$private_key \
    --arbitrum-node-endpoint=$RPC \
    --bid-validator-endpoint=$TB_BID_VALIDATOR_ENDPOINT \
    --auction-contract-address=$TB_AUCTION_CONTRACT_ADDRESS \
    --bid-gwei=$bid_amount &
done

wait
echo "All bids have been submitted successfully."