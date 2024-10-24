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

5. Submit bids to win an auction

```
yarn bidOnAuction
```

6. Send transactions to the express lane

```
yarn sendELTransactions <roundNumber>
```

7. To withdraw the deposited funds (optional)

```
yarn withdrawFunds
```
