"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keep3rPriceOracle__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [
            {
                internalType: "bool",
                name: "sushiSwap",
                type: "bool",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "MAX_TWAP_TIME",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MIN_TWAP_TIME",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "WETH_ADDRESS",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "rootOracle",
        outputs: [
            {
                internalType: "contract Keep3rV1Oracle",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "uniswapV2Factory",
        outputs: [
            {
                internalType: "contract IUniswapV2Factory",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract CToken",
                name: "cToken",
                type: "address",
            },
        ],
        name: "getUnderlyingPrice",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "underlying",
                type: "address",
            },
        ],
        name: "price",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
const _bytecode = "0x60c060405234801561001057600080fd5b506040516110603803806110608339818101604052602081101561003357600080fd5b5051600081610056577373353801921417f465377c8d898c6f4c0270282c61006c565b73f67ab1c914dee06ba0f264031885ea7b276a7cda5b9050806001600160a01b03166080816001600160a01b031660601b81525050806001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b1580156100c457600080fd5b505afa1580156100d8573d6000803e3d6000fd5b505050506040513d60208110156100ee57600080fd5b5051606081811b6001600160601b03191660a052608051901c92506001600160a01b03169050610f0c6101546000398061014452806103a15250806101815280610585528061066f528061077b52806108ae52806109985280610aa45250610f0c6000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063aea910781161005b578063aea91078146100c8578063af8a9ba5146100ee578063e3cb23a5146100f6578063fc57d4df146100fe5761007d565b8063040141e51461008257806309cd510e146100a657806359d0f713146100c0575b600080fd5b61008a610124565b604080516001600160a01b039092168252519081900360200190f35b6100ae61013c565b60408051918252519081900360200190f35b61008a610142565b6100ae600480360360208110156100de57600080fd5b50356001600160a01b0316610166565b6100ae610179565b61008a61017f565b6100ae6004803603602081101561011457600080fd5b50356001600160a01b03166101a3565b73c02aaa39b223fe8d0a0e5c4f27ead9083c756cc281565b610e1081565b7f000000000000000000000000000000000000000000000000000000000000000081565b60006101718261032c565b90505b919050565b61038481565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000816001600160a01b031663ac784ddc6040518163ffffffff1660e01b815260040160206040518083038186803b1580156101de57600080fd5b505afa1580156101f2573d6000803e3d6000fd5b505050506040513d602081101561020857600080fd5b50511561021e5750670de0b6b3a7640000610174565b6000826001600160a01b0316636f307dc36040518163ffffffff1660e01b815260040160206040518083038186803b15801561025957600080fd5b505afa15801561026d573d6000803e3d6000fd5b505050506040513d602081101561028357600080fd5b50516040805163313ce56760e01b815290519192506000916001600160a01b0384169163313ce567916004808301926020929190829003018186803b1580156102cb57600080fd5b505afa1580156102df573d6000803e3d6000fd5b505050506040513d60208110156102f557600080fd5b505160ff16600a0a90506103248161031e670de0b6b3a76400006103188661032c565b906104dc565b9061053e565b949350505050565b60006001600160a01b03821673c02aaa39b223fe8d0a0e5c4f27ead9083c756cc214156103625750670de0b6b3a7640000610174565b6040805163e6a4390560e01b81526001600160a01b03848116600483015273c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2602483015291516000927f0000000000000000000000000000000000000000000000000000000000000000169163e6a43905916044808301926020929190829003018186803b1580156103e757600080fd5b505afa1580156103fb573d6000803e3d6000fd5b505050506040513d602081101561041157600080fd5b50516040805163313ce56760e01b815290519192506000916001600160a01b0386169163313ce567916004808301926020929190829003018186803b15801561045957600080fd5b505afa15801561046d573d6000803e3d6000fd5b505050506040513d602081101561048357600080fd5b505160ff16600a0a905061032467010000000000000061031e836103188373c02aaa39b223fe8d0a0e5c4f27ead9083c756cc26001600160a01b038b16106104d3576104ce88610580565b61031e565b61031e886108a9565b6000826104eb57506000610538565b828202828482816104f857fe5b04146105355760405162461bcd60e51b8152600401808060200182810382526021815260200180610eb66021913960400191505060405180910390fd5b90505b92915050565b600061053583836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250610bb7565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166381bfb885846040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b1580156105f057600080fd5b505afa158015610604573d6000803e3d6000fd5b505050506040513d602081101561061a57600080fd5b505190508061066a576040805162461bcd60e51b81526020600482015260176024820152763737903632b733ba3416989037b139b2b93b30ba34b7b760491b604482015290519081900360640190fd5b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316630245996686600186036040518363ffffffff1660e01b815260040180836001600160a01b031681526020018281526020019250505060606040518083038186803b1580156106e557600080fd5b505afa1580156106f9573d6000803e3d6000fd5b505050506040513d606081101561070f57600080fd5b508051604090910151909250905061038319420182111561082a5760018311610779576040805162461bcd60e51b81526020600482015260176024820152763737903632b733ba3416991037b139b2b93b30ba34b7b760491b604482015290519081900360640190fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316630245996686600286036040518363ffffffff1660e01b815260040180836001600160a01b031681526020018281526020019250505060606040518083038186803b1580156107f157600080fd5b505afa158015610805573d6000803e3d6000fd5b505050506040513d606081101561081b57600080fd5b50805160409091015190925090505b4282900361038481108015906108425750610e108111155b610883576040805162461bcd60e51b815260206004820152600d60248201526c62616420545741502074696d6560981b604482015290519081900360640190fd5b600061088e87610c59565b90508342038382038161089d57fe5b04979650505050505050565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166381bfb885846040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561091957600080fd5b505afa15801561092d573d6000803e3d6000fd5b505050506040513d602081101561094357600080fd5b5051905080610993576040805162461bcd60e51b81526020600482015260176024820152763737903632b733ba3416989037b139b2b93b30ba34b7b760491b604482015290519081900360640190fd5b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316630245996686600186036040518363ffffffff1660e01b815260040180836001600160a01b031681526020018281526020019250505060606040518083038186803b158015610a0e57600080fd5b505afa158015610a22573d6000803e3d6000fd5b505050506040513d6060811015610a3857600080fd5b5080516020909101519092509050610383194201821115610b535760018311610aa2576040805162461bcd60e51b81526020600482015260176024820152763737903632b733ba3416991037b139b2b93b30ba34b7b760491b604482015290519081900360640190fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316630245996686600286036040518363ffffffff1660e01b815260040180836001600160a01b031681526020018281526020019250505060606040518083038186803b158015610b1a57600080fd5b505afa158015610b2e573d6000803e3d6000fd5b505050506040513d6060811015610b4457600080fd5b50805160209091015190925090505b428290036103848110801590610b6b5750610e108111155b610bac576040805162461bcd60e51b815260206004820152600d60248201526c62616420545741502074696d6560981b604482015290519081900360640190fd5b600061088e87610d91565b60008183610c435760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610c08578181015183820152602001610bf0565b50505050905090810190601f168015610c355780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b506000838581610c4f57fe5b0495945050505050565b600080429050826001600160a01b0316635a3d54936040518163ffffffff1660e01b815260040160206040518083038186803b158015610c9857600080fd5b505afa158015610cac573d6000803e3d6000fd5b505050506040513d6020811015610cc257600080fd5b505160408051630240bc6b60e21b81529051919350600091829182916001600160a01b03881691630902f1ac916004808301926060929190829003018186803b158015610d0e57600080fd5b505afa158015610d22573d6000803e3d6000fd5b505050506040513d6060811015610d3857600080fd5b50805160208201516040909201516001600160701b03918216955091169250905063ffffffff80821690851614610d885780840363ffffffff811683607086901b81610d8057fe5b040286019550505b50505050919050565b600080429050826001600160a01b0316635909c0d56040518163ffffffff1660e01b815260040160206040518083038186803b158015610dd057600080fd5b505afa158015610de4573d6000803e3d6000fd5b505050506040513d6020811015610dfa57600080fd5b505160408051630240bc6b60e21b81529051919350600091829182916001600160a01b03881691630902f1ac916004808301926060929190829003018186803b158015610e4657600080fd5b505afa158015610e5a573d6000803e3d6000fd5b505050506040513d6060811015610e7057600080fd5b50805160208201516040909201516001600160701b03918216955091169250905063ffffffff81164214610d885780840363ffffffff811684607085901b81610d8057fefe536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f77a2646970667358221220792fbe5a96c26d9b5024fd50a2500120c373deb53572fc95e501e4430ba0c65764736f6c634300060c0033";
const isSuperArgs = (xs) => xs.length > 1;
class Keep3rPriceOracle__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    deploy(sushiSwap, overrides) {
        return super.deploy(sushiSwap, overrides || {});
    }
    getDeployTransaction(sushiSwap, overrides) {
        return super.getDeployTransaction(sushiSwap, overrides || {});
    }
    attach(address) {
        return super.attach(address);
    }
    connect(signer) {
        return super.connect(signer);
    }
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.Keep3rPriceOracle__factory = Keep3rPriceOracle__factory;
Keep3rPriceOracle__factory.bytecode = _bytecode;
Keep3rPriceOracle__factory.abi = _abi;
