import { BigNumber } from "ethers";
import { commify, formatEther} from "ethers/lib/utils";
import { task } from "hardhat/config";
import { createCToken } from "../utils/fuseContracts";

task('ctoken-balance-of')
    .addParam('ctoken', 'cToken to query')
    .addParam('account', "Account to get balance of.")
    .setAction(async (taskArgs, hre) => {
        
        const cTokenContract = createCToken(
            hre.ethers.provider,
            taskArgs.ctoken
        )
           
        const balance: BigNumber = await cTokenContract.balanceOf(taskArgs.account)

        console.log({balance: commify(formatEther(balance))})
})
