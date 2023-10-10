import {
  time,
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('CoopGovernor', function () {
  const deploy = async () => {
    const [s1, s2, s3, s4] = await ethers.getSigners();
    const Governor = await ethers.getContractFactory('CoopGovernor');
    const Token = await ethers.getContractFactory('CoopToken');
    const nonce = await s1.getNonce();

    const futureTokenAddress = ethers.getCreateAddress({
      from: s1.address,
      nonce,
    });

    const coopGovernor = await Governor.deploy(futureTokenAddress);
    const coopToken = await Token.deploy(coopGovernor.target);

    return { s1, s2, s3, s4, coopGovernor, coopToken };
  };

  it('Deployer has to have voting power', async () => {
    const { s1, coopToken } = await loadFixture(deploy);
    const deployerBalance = await coopToken.balanceOf(s1.address);
    expect(deployerBalance).to.greaterThan(0n);
  });

  it('Should be possible to join to smart-coop', async () => {
    const { s2, coopGovernor, coopToken } = await loadFixture(deploy);
    await coopGovernor.connect(s2).join();
    // TODO fix
    const memberBalance = await coopToken.balanceOf(s2.address);
    expect(memberBalance).to.greaterThan(0n);
  });
});
