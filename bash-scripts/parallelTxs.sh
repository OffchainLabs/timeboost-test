#!/bin/bash

run_command() {
    round=$1
    seq=$2
    nonce=$3
    status_file="status_${seq}_${nonce}.txt"

    ./sendELTxCustom.sh "$round" "$seq" "$nonce" >"$status_file" 2>&1 &
    pid=$!
    echo "Started process for round=$round seq=$seq nonce=$nonce with PID=$pid. Status will be logged to $status_file."
}

round=$1
seq_start=$2
seq_end=$3
nonce_start=$4

for i in $(seq 0 $((seq_end - seq_start))); do
    seq=$((seq_start + i))
    nonce=$((nonce_start + i))
    run_command "$round" "$seq" "$nonce"
done

wait
echo "All commands have been executed. Check the status files for details."