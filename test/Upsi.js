const {expect} = require("chai");
const {constants, expectRevert} = require('@openzeppelin/test-helpers');
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe('Upsi', function () {
  
  async function deployUpsiContractFixture() {
    const [owner, eventEmitter, unauthorized, tester, ...others] = await ethers.getSigners();

    const infectionEvent = {
      infection: "STI",
      infectee: [constants.ZERO_ADDRESS],
      tester: tester,
      testTime: "YYYY-MM-DDTHH:mm:ss",
      signature: "signature"
    }

    const upsiContract = await ethers.deployContract("Upsi");
    await upsiContract.waitForDeployment();

    const eventEmitterRole = await upsiContract.EVENT_EMITTER_ROLE();

    return { upsiContract, owner, eventEmitter, unauthorized, infectionEvent, eventEmitterRole};
  }


//------------------------------------------------------------------------------------------------
// Deployment
//------------------------------------------------------------------------------------------------

  describe("deployment", function () {
    it("owner", async function () {
      const { upsiContract, owner } = await loadFixture(deployUpsiContractFixture);
      expect(await upsiContract.owner()).to.equal(owner.address);
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