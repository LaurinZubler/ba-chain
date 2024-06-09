const {expect} = require("chai");
const {expectRevert} = require('@openzeppelin/test-helpers');
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe('Upsi', function () {
  
  async function deployUpsiContractFixture() {
    const [owner, eventEmitter, unauthorized, newOwner, ...others] = await ethers.getSigners();

    const infectionEvent = {
      infection: "SMILING_SYNDROME",
      infectee: ["0x829471a67676a3d5c1dbbdd8dd40879d240ab235dd51c3bc9d2820197bbf97b0e0c1031206f25101482b6eabb71be74c"],
      tester: "e48fae3c23174f2716476d59ed0c016793407c7f3291180601ba33fc45eb8528",
      testTime: 1717961702,
      signature: "0x8dad99f34b763d19463b896be19394cdabab8ebd39d899d123f874518d4315cbb514e119b863fd07c47a4cd85b1b50950587d26b1e1f8a238f6de2b18641448093135aef66be37c9ccd3de54c0b336da703217c285e254bbd8be132aba83ac2a"
    }

    const upsiContract = await ethers.deployContract("Upsi");
    await upsiContract.waitForDeployment();

    const eventEmitterRole = await upsiContract.EVENT_EMITTER_ROLE();
    const defaultAdminRole = await upsiContract.DEFAULT_ADMIN_ROLE();

    return { upsiContract, owner, eventEmitter, unauthorized, newOwner, infectionEvent, eventEmitterRole, defaultAdminRole};
  }


//------------------------------------------------------------------------------------------------
// Deployment
//------------------------------------------------------------------------------------------------

  describe("deployment", function () {
    it("constructor", async function () {
      const { upsiContract, owner, defaultAdminRole } = await loadFixture(deployUpsiContractFixture);
      expect(await upsiContract.owner()).to.equal(owner.address);
      expect(await upsiContract.hasRole(defaultAdminRole, owner.address)).to.be.true;
    });
  });


//------------------------------------------------------------------------------------------------
// transferOwnership()
//------------------------------------------------------------------------------------------------


  describe("transferOwnership()", function () {
    it('unauthorized', async function () {
      const { upsiContract, unauthorized } = await loadFixture(deployUpsiContractFixture);

      await expectRevert(
        upsiContract.connect(unauthorized).transferOwnership(unauthorized.address),
        "OwnableUnauthorizedAccount"
      );
    });

    it('success', async function () {
      const { upsiContract, owner, newOwner, defaultAdminRole } = await loadFixture(deployUpsiContractFixture);

      expect(await upsiContract.owner()).to.equal(owner.address);
      expect(await upsiContract.hasRole(defaultAdminRole, owner.address)).to.be.true;

      expect(await upsiContract.owner()).to.not.equal(newOwner.address);
      expect(await upsiContract.hasRole(defaultAdminRole, newOwner.address)).to.be.false;

      await upsiContract.transferOwnership(newOwner.address);

      expect(await upsiContract.owner()).to.not.equal(owner.address);
      expect(await upsiContract.hasRole(defaultAdminRole, owner.address)).to.be.false;

      expect(await upsiContract.owner()).to.equal(newOwner.address);
      expect(await upsiContract.hasRole(defaultAdminRole, newOwner.address)).to.be.true;
    });
  });

//------------------------------------------------------------------------------------------------
// grantEventEmitterRole()
//------------------------------------------------------------------------------------------------

  describe("grantEventEmitterRole()", function () {
    it('unauthorized', async function () {
      const { upsiContract, eventEmitter, unauthorized } = await loadFixture(deployUpsiContractFixture);

      await expectRevert(
        upsiContract.connect(unauthorized).grantEventEmitterRole(eventEmitter.address),
        "OwnableUnauthorizedAccount"
      );
    });

    it('success', async function () {
      const { upsiContract, eventEmitter, eventEmitterRole } = await loadFixture(deployUpsiContractFixture);

      expect(await upsiContract.hasRole(eventEmitterRole, eventEmitter.address)).to.be.false;
      
      await upsiContract.grantEventEmitterRole(eventEmitter.address);
      expect(await upsiContract.hasRole(eventEmitterRole, eventEmitter.address)).to.be.true;
    });

    it('grant twice', async function () {
      const { upsiContract, eventEmitter, eventEmitterRole } = await loadFixture(deployUpsiContractFixture);

      expect(await upsiContract.hasRole(eventEmitterRole, eventEmitter.address)).to.be.false;
      
      await upsiContract.grantEventEmitterRole(eventEmitter.address);
      await upsiContract.grantEventEmitterRole(eventEmitter.address);
      expect(await upsiContract.hasRole(eventEmitterRole, eventEmitter.address)).to.be.true;
    });
  });


//------------------------------------------------------------------------------------------------
// revokeEventEmitterRole()
//------------------------------------------------------------------------------------------------

  describe("revokeEventEmitterRole()", function () {
    it('unauthorized', async function () {
      const { upsiContract, eventEmitter, unauthorized} = await loadFixture(deployUpsiContractFixture);

      await expectRevert(
        upsiContract.connect(unauthorized).grantEventEmitterRole(eventEmitter.address),
        "OwnableUnauthorizedAccount"
      );
    });

    it('success', async function () {
      const { upsiContract, eventEmitter, eventEmitterRole } = await loadFixture(deployUpsiContractFixture);

      expect(await upsiContract.hasRole(eventEmitterRole, eventEmitter.address)).to.be.false;
      
      await upsiContract.grantEventEmitterRole(eventEmitter.address);
      expect(await upsiContract.hasRole(eventEmitterRole, eventEmitter.address)).to.be.true;
      
      await upsiContract.revokeEventEmitterRole(eventEmitter.address);
      expect(await upsiContract.hasRole(eventEmitterRole, eventEmitter.address)).to.be.false;
    });

    it('revoke not existing role', async function () {
      const { upsiContract, eventEmitter, eventEmitterRole, unauthorized } = await loadFixture(deployUpsiContractFixture);

      expect(await upsiContract.hasRole(eventEmitterRole, eventEmitter.address)).to.be.false;
      
      await upsiContract.revokeEventEmitterRole(unauthorized.address);
      expect(await upsiContract.hasRole(eventEmitterRole, unauthorized.address)).to.be.false;
    });
  });


//------------------------------------------------------------------------------------------------
// emitInfectionEvent()
//------------------------------------------------------------------------------------------------

  describe("emitInfectionEvent()", function () {
    it("missing EventEmitter role", async function () {
      const { upsiContract, unauthorized, infectionEvent } = await loadFixture(deployUpsiContractFixture);

      await expectRevert(
        upsiContract.connect(unauthorized).emitInfectionEvent(
          infectionEvent.infection,
          infectionEvent.infectee,
          infectionEvent.tester,
          infectionEvent.testTime,
          infectionEvent.signature
        ),
        "Permission denied! Not authorized to emit infection event"
      );
    });

    it("success", async function () {
      const { upsiContract, eventEmitter, infectionEvent } = await loadFixture(deployUpsiContractFixture);

      await upsiContract.grantEventEmitterRole(eventEmitter.address);

      await expect(upsiContract.connect(eventEmitter).emitInfectionEvent(
          infectionEvent.infection,
          infectionEvent.infectee,
          infectionEvent.tester,
          infectionEvent.testTime,
          infectionEvent.signature
        ))
        .to.emit(upsiContract, 'InfectionEvent')
        .withArgs(
          infectionEvent.infection,
          infectionEvent.infectee,
          infectionEvent.tester,
          infectionEvent.testTime,
          infectionEvent.signature
        );
    });
  });
});