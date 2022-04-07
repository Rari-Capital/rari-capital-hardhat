import { BigNumber } from "ethers";
import { commify, formatEther} from "ethers/lib/utils";
import { task } from "hardhat/config";
import { createCToken } from "../utils/fuseContracts";

/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('ctoken-balance-of', 'Will get ctoken balance for the given address')
    .addParam('ctoken', 'cToken to query')
    .addParam('address', "Address to get balance of")
    .setAction(async (taskArgs, hre) => {
        
        const cTokenContract = createCToken(
            hre.ethers.provider,
            taskArgs.ctoken
        )
           
        const balance: BigNumber = await cTokenContract.balanceOf(taskArgs.address)

        console.log({balance: commify(formatEther(balance))})
})
