import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';

// Colors
import colors from 'colors';

// Hardhat helpers
import { FuseDeployment } from '../utils/fuse/deployments/deployer';
import { deployEmptyPool } from '../utils/fuse/deployments/deploy-empty-pool';
import { deployMarket } from '../utils/fuse/deployments/deploy-market';
import { configureEnv } from '../../../utils';
import { deployRdToPool } from '../utils/fuse/deployments/deploy-rewards-distributor-to-pool';
import { EMPTY_ADDRESS, TRIBE } from '../../../tasks/turbo/utils/constants';
import { deployFlywheelToPool } from '../../flywheel/utils/deploy-flywheel';

task('setup-fuse', 'Sets up the environment expected for dApp tests', async (taskArgs, hre) => {
        // 1. Deploy fuse.
        const [deployer] = await hre.ethers.getSigners();
        const fuseDeployer = new FuseDeployment(deployer, hre)

        await fuseDeployer.deploy(true);

        // Configure
        const {fuse, address} = await configureEnv(hre, '31337')

        
        // 2. Deploy empty pool.
        let emptyPool
        try {
            console.log(colors.yellow("\n(2/8) Deploying empty pool."))
            emptyPool = await deployEmptyPool(fuse, hre, address);
            console.log(colors.green("-- Empty pool deployed successfully!"))
        } catch (e) {
                console.error(e);
                console.log(colors.red("Please reset node and start again."))
        }
        

        // 3. Deploy pool 2.
        let poolAddress
        try {
            console.log(colors.yellow("\n(3/8) Deploying configuredPool"))
            poolAddress = await deployEmptyPool(fuse, hre, address);
            console.log(colors.green("-- Deployed pool successfully!"))
        } catch (e) {
                console.error(e);
                console.log(colors.red("Please reset node and start again."))
                return
        }
        
        // 4. Deploy dai market to pool2.
        try {
            console.log(colors.yellow("\n(4/8) Deploying DAI market to configuredPool"))
            await deployMarket(
                    fuse,
                    poolAddress, 
                    address,
                    "0x6b175474e89094c44da98b954eedeac495271d0f",
                    5,
                    0.1,
                    0.05
                );

                // 2. Filter events to get cToken address.
                const comptrollerContract = new hre.ethers.Contract(
                        poolAddress,
                        JSON.parse(
                                fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi
                        ),
                        fuse.provider
                )   
                
                let events: any = await comptrollerContract.queryFilter(
                        comptrollerContract.filters.MarketListed() ,
                        (await fuse.provider.getBlockNumber()) - 10,
                        "latest"
                );
                console.table([
                        {
                                market: "DAI", 
                                address: events.slice(-1)[0].args[0]
                        },
                ])


                // Done!
                console.log(
                        colors.green(
                                "-- Deployed market sucessfully!"
                        )
                )
        } catch (e) {
                console.error(e)
                console.log(colors.red("Please reset node and start again."))
                return
        }

        // 5. Deploy eth market to pool2.
        try {
                console.log(colors.yellow("\n(5/8) Deploying ETH market to configuredPool"))
                await deployMarket(
                        fuse,
                        poolAddress, 
                        address,
                        "0",
                        5,
                        0.1,
                        0.05
                );

                // 2. Filter events to get cToken address.
                const comptrollerContract = new hre.ethers.Contract(
                        poolAddress,
                        JSON.parse(
                                fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi
                        ),
                        fuse.provider
                )   
                
                let events: any = await comptrollerContract.queryFilter(
                        comptrollerContract.filters.MarketListed() ,
                        (await fuse.provider.getBlockNumber()) - 10,
                        "latest"
                );

                console.table([
                        {
                                market: "Eth", 
                                address: events.slice(-1)[0].args[0]
                        },
                ])

                // Done!
                console.log(
                        colors.green(
                                "-- Deployed market sucessfully!"
                        )
                )
        } catch (e) {
                console.error(e)
                console.log(colors.red("Please reset node and start again."))
                return
        }

        // 6. Deploy Rewards Distributor
        try {
                console.log(colors.yellow("\n(6/8) Deploying DAI rewards for the ETH makrket"))
                const deployedDistributor = await deployRdToPool(
                        fuse,
                        hre.ethers.provider.getSigner(),
                        "0x6b175474e89094c44da98b954eedeac495271d0f",
                        poolAddress,
                        address,
                        undefined
                )
                console.table(
                        {contract: "Rewards distributor" , address: deployedDistributor}
                    )
        } catch (e) {
                console.error(e)
        }

        try {
                console.log(colors.yellow("\n(7/8) Deploying a TRIBE Flywheel to the pool"))
                const deployedFlywheel = await deployFlywheelToPool(
                        hre.ethers.provider.getSigner(),
                        TRIBE,
                        EMPTY_ADDRESS,
                        EMPTY_ADDRESS,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        EMPTY_ADDRESS,
                        true,
                        poolAddress
                )

                console.table(
                        {contract: "Flywheel" , address: deployedFlywheel}
                    )
                
                
        } catch (e) {
                console.error(e)
        }

        try {
                console.log(colors.yellow("\n(8/8) Deploying a FEI Flywheel to the pool"))
                const deployedFlywheel = await deployFlywheelToPool(
                        hre.ethers.provider.getSigner(),
                        "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
                        EMPTY_ADDRESS,
                        EMPTY_ADDRESS,
                        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                        EMPTY_ADDRESS,
                        true,
                        poolAddress
                )

                console.table(
                        {contract: "Flywheel" , address: deployedFlywheel}
                    )
        } catch (e) {
                console.error(e)
        }
        
        console.log(colors.green("\n============ Test environment configured successfully! These are your pools: ============"))
        console.table([
                {comptroller: "emptyPool", address: emptyPool},
                {comptroller: "configuredPool", address: poolAddress}
        ])


        console.log(colors.cyan("============ To test/fund/configure rewards distributors and flywheels use their respective tasks. ============"))

        try {
                await hre.ethers.provider.send("evm_setIntervalMining", [5000]);
                console.log(colors.cyan.bold("\nMining blocks every 5 seconds"))
            } catch (e) {
                console.log(e)
            }
})