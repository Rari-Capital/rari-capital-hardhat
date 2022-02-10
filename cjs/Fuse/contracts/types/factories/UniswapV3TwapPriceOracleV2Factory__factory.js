"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapV3TwapPriceOracleV2Factory__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_logic",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "WETH",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
    {
        inputs: [],
        name: "logic",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "oracles",
        outputs: [
            {
                internalType: "contract UniswapV3TwapPriceOracleV2",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
        constant: true,
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "uniswapV3Factory",
                type: "address",
            },
            {
                internalType: "uint24",
                name: "feeTier",
                type: "uint24",
            },
            {
                internalType: "address",
                name: "baseToken",
                type: "address",
            },
        ],
        name: "deploy",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const _bytecode = "0x60a060405234801561001057600080fd5b506040516104f13803806104f18339818101604052602081101561003357600080fd5b50516001600160a01b03811661007a5760405162461bcd60e51b81526004018080602001828103825260458152602001806104ac6045913960600191505060405180910390fd5b606081901b6001600160601b0319166080526001600160a01b03166103fb6100b1600039806101b552806102f852506103fb6000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80630e26154e1461005157806368c4a1ee146100a8578063ad5c4648146100de578063d7dfa0dd146100e6575b600080fd5b61008c6004803603606081101561006757600080fd5b506001600160a01b03813581169162ffffff60208201351691604090910135166100ee565b604080516001600160a01b039092168252519081900360200190f35b61008c600480360360608110156100be57600080fd5b506001600160a01b038135811691602081013591604090910135166102b3565b61008c6102de565b61008c6102f6565b60006001600160a01b0382166101165773c02aaa39b223fe8d0a0e5c4f27ead9083c756cc291505b6001600160a01b0380851660009081526020818152604080832062ffffff88168452825280832086851684529091529020541680156101565790506102ac565b60408051606087811b6bffffffffffffffffffffffff1990811660208085019190915260e889901b6001600160e81b03191660348501529187901b1660378301528251808303602b018152604b909201909252805191012060006101da7f00000000000000000000000000000000000000000000000000000000000000008361031a565b9050806001600160a01b031663d9d3d00a8888886040518463ffffffff1660e01b815260040180846001600160a01b031681526020018362ffffff168152602001826001600160a01b031681526020019350505050600060405180830381600087803b15801561024957600080fd5b505af115801561025d573d6000803e3d6000fd5b505050506001600160a01b0387811660009081526020818152604080832062ffffff8b16845282528083208985168452909152902080546001600160a01b031916918316919091179055925050505b9392505050565b600060208181529381526040808220855292815282812090935282529020546001600160a01b031681565b73c02aaa39b223fe8d0a0e5c4f27ead9083c756cc281565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000604051733d602d80600a3d3981f3363d3d373d3d3d363d7360601b81528360601b60148201526e5af43d82803e903d91602b57fd5bf360881b6028820152826037826000f59150506001600160a01b0381166103bf576040805162461bcd60e51b815260206004820152601760248201527f455243313136373a2063726561746532206661696c6564000000000000000000604482015290519081900360640190fd5b9291505056fea26469706673582212207031ba8c86a5a5639c83372d821649c2f323477dbfdc6826ca73624c0574849e64736f6c634300060c0033556e697377617056335477617050726963654f7261636c65563220696d706c656d656e746174696f6e2f6c6f67696320636f6e7472616374206e6f7420646566696e65642e";
const isSuperArgs = (xs) => xs.length > 1;
class UniswapV3TwapPriceOracleV2Factory__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    deploy(_logic, overrides) {
        return super.deploy(_logic, overrides || {});
    }
    getDeployTransaction(_logic, overrides) {
        return super.getDeployTransaction(_logic, overrides || {});
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
exports.UniswapV3TwapPriceOracleV2Factory__factory = UniswapV3TwapPriceOracleV2Factory__factory;
UniswapV3TwapPriceOracleV2Factory__factory.bytecode = _bytecode;
UniswapV3TwapPriceOracleV2Factory__factory.abi = _abi;
