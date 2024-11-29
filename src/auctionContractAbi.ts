export const auctionContractAbi = [
  {
    type: 'function',
    name: 'AUCTIONEER_ADMIN_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'AUCTIONEER_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'BENEFICIARY_SETTER_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'DEFAULT_ADMIN_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MIN_RESERVE_SETTER_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'RESERVE_SETTER_ADMIN_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'RESERVE_SETTER_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ROUND_TIMING_SETTER_ROLE',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOfAtRound',
    inputs: [
      { name: 'account', type: 'address', internalType: 'address' },
      { name: 'round', type: 'uint64', internalType: 'uint64' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'beneficiary',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'beneficiaryBalance',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'biddingToken',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract IERC20' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'currentRound',
    inputs: [],
    outputs: [{ name: '', type: 'uint64', internalType: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'deposit',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'domainSeparator',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'finalizeWithdrawal',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'flushBeneficiaryBalance',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getBidHash',
    inputs: [
      { name: 'round', type: 'uint64', internalType: 'uint64' },
      {
        name: 'expressLaneController',
        type: 'address',
        internalType: 'address',
      },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRoleAdmin',
    inputs: [{ name: 'role', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRoleMember',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'index', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRoleMemberCount',
    inputs: [{ name: 'role', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'grantRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'account', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'hasRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'account', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      {
        name: 'args',
        type: 'tuple',
        internalType: 'struct InitArgs',
        components: [
          {
            name: '_auctioneer',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_biddingToken',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_beneficiary',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_roundTimingInfo',
            type: 'tuple',
            internalType: 'struct RoundTimingInfo',
            components: [
              {
                name: 'offsetTimestamp',
                type: 'int64',
                internalType: 'int64',
              },
              {
                name: 'roundDurationSeconds',
                type: 'uint64',
                internalType: 'uint64',
              },
              {
                name: 'auctionClosingSeconds',
                type: 'uint64',
                internalType: 'uint64',
              },
              {
                name: 'reserveSubmissionSeconds',
                type: 'uint64',
                internalType: 'uint64',
              },
            ],
          },
          {
            name: '_minReservePrice',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: '_auctioneerAdmin',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_minReservePriceSetter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_reservePriceSetter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_reservePriceSetterAdmin',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_beneficiarySetter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_roundTimingSetter',
            type: 'address',
            internalType: 'address',
          },
          {
            name: '_masterAdmin',
            type: 'address',
            internalType: 'address',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'initiateWithdrawal',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isAuctionRoundClosed',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isReserveBlackout',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'minReservePrice',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'renounceRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'account', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'reservePrice',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'resolveMultiBidAuction',
    inputs: [
      {
        name: 'firstPriceBid',
        type: 'tuple',
        internalType: 'struct Bid',
        components: [
          {
            name: 'expressLaneController',
            type: 'address',
            internalType: 'address',
          },
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: 'secondPriceBid',
        type: 'tuple',
        internalType: 'struct Bid',
        components: [
          {
            name: 'expressLaneController',
            type: 'address',
            internalType: 'address',
          },
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'resolveSingleBidAuction',
    inputs: [
      {
        name: 'firstPriceBid',
        type: 'tuple',
        internalType: 'struct Bid',
        components: [
          {
            name: 'expressLaneController',
            type: 'address',
            internalType: 'address',
          },
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'resolvedRounds',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct ELCRound',
        components: [
          {
            name: 'expressLaneController',
            type: 'address',
            internalType: 'address',
          },
          { name: 'round', type: 'uint64', internalType: 'uint64' },
        ],
      },
      {
        name: '',
        type: 'tuple',
        internalType: 'struct ELCRound',
        components: [
          {
            name: 'expressLaneController',
            type: 'address',
            internalType: 'address',
          },
          { name: 'round', type: 'uint64', internalType: 'uint64' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'revokeRole',
    inputs: [
      { name: 'role', type: 'bytes32', internalType: 'bytes32' },
      { name: 'account', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'roundTimestamps',
    inputs: [{ name: 'round', type: 'uint64', internalType: 'uint64' }],
    outputs: [
      { name: '', type: 'uint64', internalType: 'uint64' },
      { name: '', type: 'uint64', internalType: 'uint64' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'roundTimingInfo',
    inputs: [],
    outputs: [
      { name: 'offsetTimestamp', type: 'int64', internalType: 'int64' },
      {
        name: 'roundDurationSeconds',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: 'auctionClosingSeconds',
        type: 'uint64',
        internalType: 'uint64',
      },
      {
        name: 'reserveSubmissionSeconds',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setBeneficiary',
    inputs: [
      {
        name: 'newBeneficiary',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setMinReservePrice',
    inputs: [
      {
        name: 'newMinReservePrice',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setReservePrice',
    inputs: [
      {
        name: 'newReservePrice',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setRoundTimingInfo',
    inputs: [
      {
        name: 'newRoundTimingInfo',
        type: 'tuple',
        internalType: 'struct RoundTimingInfo',
        components: [
          {
            name: 'offsetTimestamp',
            type: 'int64',
            internalType: 'int64',
          },
          {
            name: 'roundDurationSeconds',
            type: 'uint64',
            internalType: 'uint64',
          },
          {
            name: 'auctionClosingSeconds',
            type: 'uint64',
            internalType: 'uint64',
          },
          {
            name: 'reserveSubmissionSeconds',
            type: 'uint64',
            internalType: 'uint64',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setTransferor',
    inputs: [
      {
        name: 'transferor',
        type: 'tuple',
        internalType: 'struct Transferor',
        components: [
          { name: 'addr', type: 'address', internalType: 'address' },
          {
            name: 'fixedUntilRound',
            type: 'uint64',
            internalType: 'uint64',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [{ name: 'interfaceId', type: 'bytes4', internalType: 'bytes4' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transferExpressLaneController',
    inputs: [
      { name: 'round', type: 'uint64', internalType: 'uint64' },
      {
        name: 'newExpressLaneController',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferorOf',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [
      { name: 'addr', type: 'address', internalType: 'address' },
      {
        name: 'fixedUntilRound',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'withdrawableBalance',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'withdrawableBalanceAtRound',
    inputs: [
      { name: 'account', type: 'address', internalType: 'address' },
      { name: 'round', type: 'uint64', internalType: 'uint64' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'AuctionResolved',
    inputs: [
      {
        name: 'isMultiBidAuction',
        type: 'bool',
        indexed: true,
        internalType: 'bool',
      },
      {
        name: 'round',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
      {
        name: 'firstPriceBidder',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'firstPriceExpressLaneController',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'firstPriceAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'price',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'roundStartTimestamp',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
      {
        name: 'roundEndTimestamp',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Deposit',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RoleAdminChanged',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'previousAdminRole',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'newAdminRole',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RoleGranted',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RoleRevoked',
    inputs: [
      {
        name: 'role',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetBeneficiary',
    inputs: [
      {
        name: 'oldBeneficiary',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'newBeneficiary',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetExpressLaneController',
    inputs: [
      {
        name: 'round',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
      {
        name: 'previousExpressLaneController',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newExpressLaneController',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'transferor',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'startTimestamp',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
      {
        name: 'endTimestamp',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetMinReservePrice',
    inputs: [
      {
        name: 'oldPrice',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'newPrice',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetReservePrice',
    inputs: [
      {
        name: 'oldReservePrice',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'newReservePrice',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetRoundTimingInfo',
    inputs: [
      {
        name: 'currentRound',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
      {
        name: 'offsetTimestamp',
        type: 'int64',
        indexed: false,
        internalType: 'int64',
      },
      {
        name: 'roundDurationSeconds',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
      {
        name: 'auctionClosingSeconds',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
      {
        name: 'reserveSubmissionSeconds',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetTransferor',
    inputs: [
      {
        name: 'expressLaneController',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'transferor',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'fixedUntilRound',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawalFinalized',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'withdrawalAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawalInitiated',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'withdrawalAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'roundWithdrawable',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  { type: 'error', name: 'AuctionNotClosed', inputs: [] },
  { type: 'error', name: 'BidsWrongOrder', inputs: [] },
  {
    type: 'error',
    name: 'FixedTransferor',
    inputs: [
      {
        name: 'fixedUntilRound',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
  },
  {
    type: 'error',
    name: 'InsufficientBalance',
    inputs: [
      {
        name: 'amountRequested',
        type: 'uint256',
        internalType: 'uint256',
      },
      { name: 'balance', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'InsufficientBalanceAcc',
    inputs: [
      { name: 'account', type: 'address', internalType: 'address' },
      {
        name: 'amountRequested',
        type: 'uint256',
        internalType: 'uint256',
      },
      { name: 'balance', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidNewRound',
    inputs: [
      { name: 'currentRound', type: 'uint64', internalType: 'uint64' },
      { name: 'newRound', type: 'uint64', internalType: 'uint64' },
    ],
  },
  {
    type: 'error',
    name: 'InvalidNewStart',
    inputs: [
      { name: 'currentStart', type: 'uint64', internalType: 'uint64' },
      { name: 'newStart', type: 'uint64', internalType: 'uint64' },
    ],
  },
  { type: 'error', name: 'NegativeOffset', inputs: [] },
  {
    type: 'error',
    name: 'NegativeRoundStart',
    inputs: [{ name: 'roundStart', type: 'int64', internalType: 'int64' }],
  },
  {
    type: 'error',
    name: 'NotExpressLaneController',
    inputs: [
      { name: 'round', type: 'uint64', internalType: 'uint64' },
      { name: 'controller', type: 'address', internalType: 'address' },
      { name: 'sender', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'NotTransferor',
    inputs: [
      { name: 'round', type: 'uint64', internalType: 'uint64' },
      {
        name: 'expectedTransferor',
        type: 'address',
        internalType: 'address',
      },
      { name: 'msgSender', type: 'address', internalType: 'address' },
    ],
  },
  { type: 'error', name: 'NothingToWithdraw', inputs: [] },
  { type: 'error', name: 'ReserveBlackout', inputs: [] },
  {
    type: 'error',
    name: 'ReservePriceNotMet',
    inputs: [
      { name: 'bidAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'reservePrice', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'ReservePriceTooLow',
    inputs: [
      {
        name: 'reservePrice',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'minReservePrice',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RoundAlreadyResolved',
    inputs: [{ name: 'round', type: 'uint64', internalType: 'uint64' }],
  },
  { type: 'error', name: 'RoundDurationTooShort', inputs: [] },
  {
    type: 'error',
    name: 'RoundNotResolved',
    inputs: [{ name: 'round', type: 'uint64', internalType: 'uint64' }],
  },
  {
    type: 'error',
    name: 'RoundTooLong',
    inputs: [
      {
        name: 'roundDurationSeconds',
        type: 'uint64',
        internalType: 'uint64',
      },
    ],
  },
  {
    type: 'error',
    name: 'RoundTooOld',
    inputs: [
      { name: 'round', type: 'uint64', internalType: 'uint64' },
      { name: 'currentRound', type: 'uint64', internalType: 'uint64' },
    ],
  },
  { type: 'error', name: 'SameBidder', inputs: [] },
  { type: 'error', name: 'TieBidsWrongOrder', inputs: [] },
  { type: 'error', name: 'WithdrawalInProgress', inputs: [] },
  { type: 'error', name: 'WithdrawalMaxRound', inputs: [] },
  { type: 'error', name: 'ZeroAmount', inputs: [] },
  { type: 'error', name: 'ZeroAuctionClosingSeconds', inputs: [] },
  { type: 'error', name: 'ZeroBiddingToken', inputs: [] },
] as const;
