# Timeboost test script

These scripts are meant to test how Timeboost works, and how to use it, in a local environment.

## Usage

1. Clone repository

```
git clone https://github.com/OffchainLabs/timeboost-test.git
```

2. Install dependencies

```
yarn install
```

3. Set environment variables

```
cp .env.example .env
```

(change the values if needed)

4. Run nitro-testnode with timeboost enabled

5. Test the timeboost flow

```
yarn testTimeboost
```

NOTE: this script submit bids and sends a few transactions to the express lane to test the different timeboost flows

## Extra scripts

There's a bash script available to send transactions to the express lane

```
yarn sendELTransactions <roundNumber>
```

To withdraw the deposited funds

```
yarn withdrawFunds
```
