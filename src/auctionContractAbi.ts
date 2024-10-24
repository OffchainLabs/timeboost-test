export const auctionContractAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bool',
        name: 'isMultiBidAuction',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'round',
        type: 'uint64',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'firstPriceBidder',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'firstPriceExpressLaneController',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'firstPriceAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'roundStartTimestamp',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'roundEndTimestamp',
        type: 'uint64',
      },
    ],
    name: 'AuctionResolved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'oldBeneficiary',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newBeneficiary',
        type: 'address',
      },
    ],
    name: 'SetBeneficiary',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'round',
        type: 'uint64',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'previousExpressLaneController',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newExpressLaneController',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'transferor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'startTimestamp',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'endTimestamp',
        type: 'uint64',
      },
    ],
    name: 'SetExpressLaneController',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newPrice',
        type: 'uint256',
      },
    ],
    name: 'SetMinReservePrice',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldReservePrice',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newReservePrice',
        type: 'uint256',
      },
    ],
    name: 'SetReservePrice',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'currentRound',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'offsetTimestamp',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'roundDurationSeconds',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'auctionClosingSeconds',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'reserveSubmissionSeconds',
        type: 'uint64',
      },
    ],
    name: 'SetRoundTimingInfo',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'expressLaneController',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'transferor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'fixedUntilRound',
        type: 'uint64',
      },
    ],
    name: 'SetTransferor',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'withdrawalAmount',
        type: 'uint256',
      },
    ],
    name: 'WithdrawalFinalized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'withdrawalAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'roundWithdrawable',
        type: 'uint256',
      },
    ],
    name: 'WithdrawalInitiated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'AUCTIONEER_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'AUCTIONEER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'BENEFICIARY_SETTER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'BID_DOMAIN',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MIN_RESERVE_SETTER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'RESERVE_SETTER_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'RESERVE_SETTER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ROUND_TIMING_SETTER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'beneficiary',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'beneficiaryBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'biddingToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentRound',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'finalizeWithdrawal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'flushBeneficiaryBalance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: '_round',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_expressLaneController',
        type: 'address',
      },
    ],
    name: 'getBidBytes',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getRoleMember',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleMemberCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: '_auctioneer',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_biddingToken',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_beneficiary',
            type: 'address',
          },
          {
            components: [
              {
                internalType: 'uint64',
                name: 'offsetTimestamp',
                type: 'uint64',
              },
              {
                internalType: 'uint64',
                name: 'roundDurationSeconds',
                type: 'uint64',
              },
              {
                internalType: 'uint64',
                name: 'auctionClosingSeconds',
                type: 'uint64',
              },
              {
                internalType: 'uint64',
                name: 'reserveSubmissionSeconds',
                type: 'uint64',
              },
            ],
            internalType: 'struct RoundTimingInfo',
            name: '_roundTimingInfo',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: '_minReservePrice',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: '_auctioneerAdmin',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_minReservePriceSetter',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_reservePriceSetter',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_reservePriceSetterAdmin',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_beneficiarySetter',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_roundTimingSetter',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_masterAdmin',
            type: 'address',
          },
        ],
        internalType: 'struct InitArgs',
        name: 'args',
        type: 'tuple',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'initiateWithdrawal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isAuctionRoundClosed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isReserveBlackout',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minReservePrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'reservePrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'expressLaneController',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct Bid',
        name: 'firstPriceBid',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'expressLaneController',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct Bid',
        name: 'secondPriceBid',
        type: 'tuple',
      },
    ],
    name: 'resolveMultiBidAuction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'expressLaneController',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct Bid',
        name: 'firstPriceBid',
        type: 'tuple',
      },
    ],
    name: 'resolveSingleBidAuction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'resolvedRounds',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'expressLaneController',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'round',
            type: 'uint64',
          },
        ],
        internalType: 'struct ELCRound',
        name: '',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'expressLaneController',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'round',
            type: 'uint64',
          },
        ],
        internalType: 'struct ELCRound',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'round',
        type: 'uint64',
      },
    ],
    name: 'roundTimestamps',
    outputs: [
      {
        internalType: 'uint64',
        name: 'start',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'end',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'roundTimingInfo',
    outputs: [
      {
        internalType: 'uint64',
        name: 'offsetTimestamp',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'roundDurationSeconds',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'auctionClosingSeconds',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'reserveSubmissionSeconds',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newBeneficiary',
        type: 'address',
      },
    ],
    name: 'setBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newMinReservePrice',
        type: 'uint256',
      },
    ],
    name: 'setMinReservePrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newReservePrice',
        type: 'uint256',
      },
    ],
    name: 'setReservePrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'offsetTimestamp',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'roundDurationSeconds',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'auctionClosingSeconds',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'reserveSubmissionSeconds',
            type: 'uint64',
          },
        ],
        internalType: 'struct RoundTimingInfo',
        name: 'newRoundTimingInfo',
        type: 'tuple',
      },
    ],
    name: 'setRoundTimingInfo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'addr',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'fixedUntilRound',
            type: 'uint64',
          },
        ],
        internalType: 'struct Transferor',
        name: 'transferor',
        type: 'tuple',
      },
    ],
    name: 'setTransferor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'round',
        type: 'uint64',
      },
      {
        internalType: 'address',
        name: 'newExpressLaneController',
        type: 'address',
      },
    ],
    name: 'transferExpressLaneController',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'expressLaneController',
        type: 'address',
      },
    ],
    name: 'transferorOf',
    outputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: 'fixedUntil',
        type: 'uint64',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'withdrawableBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;