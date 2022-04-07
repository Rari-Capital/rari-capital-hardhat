import '@nomiclabs/hardhat-ethers';
import { providers } from 'ethers';
import { task } from 'hardhat/config';
import { TurboAddresses } from '../utils/constants';
import { isUserAuthorizedToCreateSafes } from '../utils/isUserAuthorizedToCreateSafes';
import { createMultiRolesAuthority, createTurboAuthority, createTurboMaster, ITurboMaster } from '../utils/turboContracts';


/*///////////////////////////////////////////////////////////////
                        STATIC CALLS
//////////////////////////////////////////////////////////////*/
task('turbo-is-user-authorized-to-create', "Returns boolean indicating given user clearance to create pools")
    .addParam('user', 'User/contract address')
    .addParam('target', 'Contract to call signature on')
    .addParam('id', 'ChainID')
    .setAction(async (taskArgs, hre) => {

    const isUserAuthorized = await isUserAuthorizedToCreateSafes(hre.ethers.provider, TurboAddresses[taskArgs.id].TURBO_AUTHORITY, taskArgs.user, taskArgs.target)

    console.log({isUserAuthorized})
})

task('turbo-is-capability-public', "Returns boolean indicating if function is public")
    .addParam('authority', 'Address of the authority contract to query')
    .setAction(async (taskArgs, hre) => {

    const turboBoosterContract = await createMultiRolesAuthority(hre, taskArgs.authority)

    const functionSig = ITurboMaster.getSighash('createSafe')

    const authorized = await turboBoosterContract.isCapabilityPublic(
        functionSig
    )

    console.log({authorized})
})

task('turbo-get-authority-owner', 'Will return address of the turboAuthority owner')
    .addParam('authority', 'Address of the authority contract to query')
    .setAction( async (taskArgs, hre) => {
    const turboBoosterContract = await createTurboAuthority(hre.ethers.provider, taskArgs.authority)

    const owner = await turboBoosterContract.owner()

    console.log({owner})
})

task('get-user-roles', 'Will get roles of the given user in the given authority contract')
    .addParam('authority', 'Address of the authority contract to query')
    .addParam('address', 'User to get roles for')
    .setAction( async (taskArgs, hre) => {
    const turboBoosterContract = await createMultiRolesAuthority(hre, taskArgs.authority)

    const roles = await turboBoosterContract.getUserRoles(taskArgs.address)

    console.log({roles})
})

/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
// task('grant-dev-permission')
//     .addParam('user', 'User/contract address')
//     .addParam('target', 'Contract to call signature on')
//     .addParam('function', 'Function signature')
//     .addParam('authority', 'Address of the authority contract to query') 
//     .setAction( async (taskArgs, hre) => {
//     const turboBoosterContract = await createTurboAuthority(hre.ethers.provider, taskArgs.authority)
// })