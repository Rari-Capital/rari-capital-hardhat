
// Types
import { Contract, ContractFactory, Signer } from "ethers";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

/// Artifacts
import FuseDirectory from '../../../abis/artifacts/contracts/FusePoolDirectory.sol/FusePoolDirectory.json'
import FuseSafeLiquidator from '../../../abis/artifacts/contracts/FuseSafeLiquidator.sol/FuseSafeLiquidator.json'
import FuseFeeDistributor from '../../../abis/artifacts/contracts/FuseFeeDistributor.sol/FuseFeeDistributor.json'
import FuseLens from '../../../abis/artifacts/contracts/FusePoolLens.sol/FusePoolLens.json'
import FuseSecondaryLens from '../../../abis/artifacts/contracts/FusePoolLensSecondary.sol/FusePoolLensSecondary.json'

// Colors
import colors from 'colors';

export class FuseDeployment {
    public declare readonly deployer: Signer;
    public declare hre: HardhatRuntimeEnvironment;
    public FuseDirectoryAddress?: string;
    public SafeLiquidatorAddress?: string;
    public FeeDistributorAddress?: string;
    public LensAddress?: string;
    public LensSecondaryAddress?: string;

    constructor(deployer: SignerWithAddress, hre: any) {
      this.deployer = deployer;
      this.hre = hre
    }

    async deployFuseDirectory() {
        const FusePoolDirectoryContractFactory = new ContractFactory(
            FuseDirectory.abi,
            FuseDirectory.bytecode,
            this.hre.ethers.provider.getSigner()
        )

        const FusePoolDirectory = await FusePoolDirectoryContractFactory.deploy();
        this.FuseDirectoryAddress = FusePoolDirectory.address;
        return this.FuseDirectoryAddress;
    }

    async deploySafeLiquidator() {
        const SafeLiquidatorContractFactory = new ContractFactory(
            FuseSafeLiquidator.abi,
            FuseSafeLiquidator.bytecode,
            this.hre.ethers.provider.getSigner()
        )

        const SafeLiquidator = await SafeLiquidatorContractFactory.deploy();
        this.SafeLiquidatorAddress = SafeLiquidator.address;
        return this.SafeLiquidatorAddress
    }

    async deployFeeDistributor() {
        const FeeDistributorContractFactory = new ContractFactory(
            FuseFeeDistributor.abi,
            FuseFeeDistributor.bytecode,
            this.hre.ethers.provider.getSigner()
        )

        const FeeDistributor = await FeeDistributorContractFactory.deploy()
        this.FeeDistributorAddress = FeeDistributor.address
        return this.FeeDistributorAddress
    }

    async deployLens() {
        const LensFactory = new ContractFactory(
            FuseLens.abi,
            FuseLens.bytecode,
            this.hre.ethers.provider.getSigner()
        )

        const SecondaryLensFactory = new ContractFactory(
            FuseSecondaryLens.abi,
            FuseSecondaryLens.bytecode,
            this.hre.ethers.provider.getSigner()
        )   
        
        const Lens = await LensFactory.deploy()
        const LensSecondary = await SecondaryLensFactory.deploy()

        this.LensAddress = Lens.address;
        this.LensSecondaryAddress = LensSecondary.address

        await this.initiateLens(Lens, LensSecondary)
        return([this.LensAddress, this.LensSecondaryAddress])
    }

    async initiateLens(
        Lens: Contract, 
        LensSecondary: Contract
    ) {
        if (this.FuseDirectoryAddress) {
            // 5. Initiate Lens
            await Lens.initialize(this.FuseDirectoryAddress);
            await LensSecondary.initialize(this.FuseDirectoryAddress);
        }
    }

    async deploy(setup?: boolean) {
        const stringToShow = setup ? "(1/5) Initiating Fuse deployment." : "Initiating deployment."
         console.info(colors.yellow(stringToShow))

        const directory = await this.deployFuseDirectory();
        const liquidator = await this.deploySafeLiquidator();
        const distributor = await this.deployFeeDistributor();
        const lens = await this.deployLens();

        console.table([
            {contract: "Directory: ", address: directory},
            {contract: "Safe liquidator: ", address: liquidator},
            {contract: "Fee distributor: ", address: distributor},
            {contract: "Primary lens: ", address: lens[0]},
            {contract: "Secondary lens: ", address: lens[1]},
        ])
       
        console.info(colors.green("-- Fuse deployed successfully."))

         
    }
}