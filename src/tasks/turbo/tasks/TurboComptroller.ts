import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { commify, formatUnits, parseUnits } from 'ethers/lib/utils';
import { createOracle, createTurboComptroller } from '../utils/turboContracts';
import { TurboAddresses } from '../utils/constants';
import { getEthUsdPriceBN } from '../../fuse/utils/cjs/utils/getUSDPriceBN';
import { constants } from 'ethers';

/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('turbo-markets', "Will get all markets in the TurboPool")
    .addParam('id', 'chainID')
    .setAction( async (taskArgs, hre) => {

    const turboComptrollerContract = await createTurboComptroller(hre, taskArgs.id)

    const markets = await turboComptrollerContract.callStatic.getAllMarkets()

    console.log({markets})
})

task('turbo-tribe-cf', "Will get TRIBE Collateral Factor in the turbo pool")
    .addParam('id', 'chainID')
    .setAction( async (taskArgs, hre) => {
    const turboComptrollerContract = await createTurboComptroller(hre, taskArgs.id)

    const market = await turboComptrollerContract.callStatic.markets("0x1Fd6712E66263436877271B87d6eF20Ec6aE5f43")

    console.log(market)

    console.log("Collateral Factor: ", formatUnits(market.collateralFactorMantissa))
})

task('turbo-tribe-supply-cap', "Will get TRIBE's supply cap in the turbo pool")
    .addParam('id', 'chainID')
    .setAction( async (taskArgs, hre) => {
    const turboComptrollerContract = await createTurboComptroller(hre, taskArgs.id)

    const market = await turboComptrollerContract.callStatic.supplyCaps("0x67E6C5c58eDE477bC790e8c050c2eb10fE3a835f")

    console.log("Supply Cap: ", commify(formatUnits(market)))
})

task('turbo-oracle', "Will oracle for the turbo pool")
    .addParam('id', 'chainID')
    .setAction(async (taskArgs, hre) => {
    const turboComptrollerContract = await createTurboComptroller(hre, taskArgs.id)

    const oracle = await turboComptrollerContract.callStatic.oracle()
    console.log(oracle)
})

task('turbo-get-price-for-asset', "Will get price in USD for the given asset")
    .addParam('id', 'chainID')
    .addParam('oracle', 'Oracles address')
    .addParam('asset', 'Address of asset to get price for')
    .setAction(async (taskArgs, hre) => {
        const oracleContract = await createOracle(hre.ethers.provider, TurboAddresses[taskArgs.id].ORACLE)

        console.log(oracleContract)
        const price = await oracleContract.callStatic.price(taskArgs.asset)
        const ethPrice = await getEthUsdPriceBN()

        console.log(formatUnits(price.mul(ethPrice).div(constants.WeiPerEther)))
    })