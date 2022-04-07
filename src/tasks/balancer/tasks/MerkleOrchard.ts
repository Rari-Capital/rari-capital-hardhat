import '@nomiclabs/hardhat-ethers';
import { BigNumber, constants, Contract, utils } from 'ethers';
import { task } from 'hardhat/config';

// ABIS
import MerkleOrchard from '../abis/MerkleOrchard.json'

/*///////////////////////////////////////////////////////////////
                        METHOD CALLS
//////////////////////////////////////////////////////////////*/
task('orchard-publish-distribution', "Will publish a distribution to the MerkleOrchard.")
    .addParam('root', 'Merkle root')
    .addParam('amount', 'Total amount of tokens being distributed')
    .setAction(async (taskArgs, hre) => {

    const MerckleOrchardContract = new Contract(
        "0xdAE7e32ADc5d490a43cCba1f0c736033F2b4eFca",
        MerkleOrchard,
        hre.ethers.provider.getSigner()
    )

    const receipt = await MerckleOrchardContract.createDistribution(
        "0xba100000625a3754423978a60c9317c58a424e3D",
        taskArgs.root,
        utils.parseEther(taskArgs.amount),
        2
    )

    console.log(receipt)
})

task('orchard-claim', 'Will claim rewards from the merkle orchard')
    .setAction(async (taskArgs, hre) => {

    const signer = await hre.ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')

    const MerkleOrchardContract = new Contract(
        "0xdAE7e32ADc5d490a43cCba1f0c736033F2b4eFca",
        MerkleOrchard,
        signer
    )

    const receipt = await MerkleOrchardContract.claimDistributions(
        "0x29aE0035083aEe852DebF2d97896496978A665Fe",
        [[
            BigNumber.from(2),
            utils.parseEther("12000"),
            "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            constants.Zero,
            ['0x0b59650f642d1b39fc7eba7cc6e6fe9f07e326b49c86978b0fbd2e8c388d1dee']
        ]],
        ['0xba100000625a3754423978a60c9317c58a424e3D']
    )

    console.log(receipt)
})