import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MasterPriceOracle, MasterPriceOracleInterface } from "../MasterPriceOracle";
declare type MasterPriceOracleConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MasterPriceOracle__factory extends ContractFactory {
    constructor(...args: MasterPriceOracleConstructorParams);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<MasterPriceOracle>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): MasterPriceOracle;
    connect(signer: Signer): MasterPriceOracle__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b50610da8806100206000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c8063addd509911610066578063addd509914610306578063aea910781461032c578063c44014d214610364578063f851a4401461038a578063fc57d4df146103925761009e565b8063278aa146146100a3578063656b0fd1146101e257806380dce169146101fe5780638f283970146102225780639c9192c614610248575b600080fd5b6101e0600480360360a08110156100b957600080fd5b810190602081018135600160201b8111156100d357600080fd5b8201836020820111156100e557600080fd5b803590602001918460208302840111600160201b8311171561010657600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b81111561015557600080fd5b82018360208201111561016757600080fd5b803590602001918460208302840111600160201b8311171561018857600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550506001600160a01b038335811694506020840135169260400135151591506103b89050565b005b6101ea610595565b604080519115158252519081900360200190f35b6102066105a6565b604080516001600160a01b039092168252519081900360200190f35b6101e06004803603602081101561023857600080fd5b50356001600160a01b03166105b5565b6101e06004803603604081101561025e57600080fd5b810190602081018135600160201b81111561027857600080fd5b82018360208201111561028a57600080fd5b803590602001918460208302840111600160201b831117156102ab57600080fd5b919390929091602081019035600160201b8111156102c857600080fd5b8201836020820111156102da57600080fd5b803590602001918460208302840111600160201b831117156102fb57600080fd5b509092509050610672565b6102066004803603602081101561031c57600080fd5b50356001600160a01b031661084f565b6103526004803603602081101561034257600080fd5b50356001600160a01b031661086a565b60408051918252519081900360200190f35b6101e06004803603602081101561037a57600080fd5b50356001600160a01b03166109dd565b610206610a9a565b610352600480360360208110156103a857600080fd5b50356001600160a01b0316610aa9565b600054610100900460ff16806103d157506103d1610c4b565b806103df575060005460ff16155b61041a5760405162461bcd60e51b815260040180806020018281038252602e815260200180610d0c602e913960400191505060405180910390fd5b600054610100900460ff16158015610445576000805460ff1961ff0019909116610100171660011790555b84518651146104855760405162461bcd60e51b8152600401808060200182810382526025815260200180610ce76025913960400191505060405180910390fd5b60005b865181101561053a57600087828151811061049f57fe5b6020026020010151905060008783815181106104b757fe5b6020908102919091018101516001600160a01b03808516600081815260018552604080822080549486166001600160a01b0319909516851790558051928352948201528084019190915291519092507f10e7c87bebf274db4de1b5f9fc731d6f83096e550bd871b681314578404d31269181900360600190a15050600101610488565b50600280546001600160a01b038087166001600160a01b03199283161790925560038054600160a01b86150260ff60a01b19948816919093161792909216179055801561058d576000805461ff00191690555b505050505050565b600354600160a01b900460ff161590565b6002546001600160a01b031681565b6003546001600160a01b0316331461060f576040805162461bcd60e51b815260206004820152601860248201527729b2b73232b91034b9903737ba103a34329030b236b4b71760411b604482015290519081900360640190fd5b600380546001600160a01b038381166001600160a01b0319831681179093556040805191909216808252602082019390935281517ff9ffabca9c8276e99321725bcb43fb076a6c66a54b7f21c4e8146d8519b417dc929181900390910190a15050565b6003546001600160a01b031633146106cc576040805162461bcd60e51b815260206004820152601860248201527729b2b73232b91034b9903737ba103a34329030b236b4b71760411b604482015290519081900360640190fd5b82158015906106da57508281145b6107155760405162461bcd60e51b8152600401808060200182810382526038815260200180610caf6038913960400191505060405180910390fd5b60005b8381101561084857600085858381811061072e57fe5b602090810292909201356001600160a01b03908116600081815260019094526040909320546003549394501691600160a01b900460ff161590506107b2576001600160a01b038116156107b25760405162461bcd60e51b815260040180806020018281038252604c815260200180610c63604c913960600191505060405180910390fd5b60008585858181106107c057fe5b6001600160a01b0386811660008181526001602090815260409182902080546001600160a01b03191695820297909701358416948517909655805191825291871694810194909452838101829052519093507f10e7c87bebf274db4de1b5f9fc731d6f83096e550bd871b681314578404d3126928190036060019150a1505050600101610718565b5050505050565b6001602052600090815260409020546001600160a01b031681565b600073c02aaa39b223fe8d0a0e5c4f27ead9083c756cc26001600160a01b03831614156108a05750670de0b6b3a76400006109d8565b6001600160a01b0380831660009081526001602052604090205416801561094357806001600160a01b031663aea91078846040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561090e57600080fd5b505afa158015610922573d6000803e3d6000fd5b505050506040513d602081101561093857600080fd5b505191506109d89050565b6002546001600160a01b0316156109a157600254604080516315d5220f60e31b81526001600160a01b0386811660048301529151919092169163aea91078916024808301926020929190829003018186803b15801561090e57600080fd5b60405162461bcd60e51b8152600401808060200182810382526039815260200180610d3a6039913960400191505060405180910390fd5b919050565b6003546001600160a01b03163314610a37576040805162461bcd60e51b815260206004820152601860248201527729b2b73232b91034b9903737ba103a34329030b236b4b71760411b604482015290519081900360640190fd5b600280546001600160a01b038381166001600160a01b0319831681179093556040805191909216808252602082019390935281517f0df2d61fdd201e9633368dca495e2c469e36c48039263448dd8a2a954c19ef1a929181900390910190a15050565b6003546001600160a01b031681565b600080826001600160a01b0316636f307dc36040518163ffffffff1660e01b815260040160206040518083038186803b158015610ae557600080fd5b505afa158015610af9573d6000803e3d6000fd5b505050506040513d6020811015610b0f57600080fd5b5051905073c02aaa39b223fe8d0a0e5c4f27ead9083c756cc26001600160a01b0382161415610b4957670de0b6b3a76400009150506109d8565b6001600160a01b03808216600090815260016020526040902054168015610bed57806001600160a01b031663fc57d4df856040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015610bb757600080fd5b505afa158015610bcb573d6000803e3d6000fd5b505050506040513d6020811015610be157600080fd5b505192506109d8915050565b6002546001600160a01b0316156109a1576002546040805163fc57d4df60e01b81526001600160a01b0387811660048301529151919092169163fc57d4df916024808301926020929190829003018186803b158015610bb757600080fd5b6000610c5630610c5c565b15905090565b3b15159056fe41646d696e2063616e6e6f74206f7665727772697465206578697374696e672061737369676e6d656e7473206f66206f7261636c657320746f20756e6465726c79696e6720746f6b656e732e4c656e67746873206f6620626f746820617272617973206d75737420626520657175616c20616e642067726561746572207468616e20302e4c656e67746873206f6620626f746820617272617973206d75737420626520657175616c2e496e697469616c697a61626c653a20636f6e747261637420697320616c726561647920696e697469616c697a65645072696365206f7261636c65206e6f7420666f756e6420666f72207468697320756e6465726c79696e6720746f6b656e20616464726573732ea2646970667358221220271acacb4ec1d62f27194e0349f2cce45d5e275e4ddbb963abca50aebe6209df64736f6c634300060c0033";
    static readonly abi: ({
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): MasterPriceOracleInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MasterPriceOracle;
}
export {};
