// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Upsi is Ownable, AccessControl {

  bytes32 public constant EVENT_EMITTER_ROLE = keccak256("EVENT_EMITTER_ROLE");

  event InfectionEvent(
    string infection,
    string[] infectee,
    string tester,
    uint testTime,
    string signature
  );

  constructor() Ownable(msg.sender) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function transferOwnership(address newOwner) public override onlyOwner {
    super.transferOwnership(newOwner);
    _grantRole(DEFAULT_ADMIN_ROLE, newOwner);
    _revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function grantEventEmitterRole(address _address) public onlyOwner {
    grantRole(EVENT_EMITTER_ROLE, _address);
  }

  function revokeEventEmitterRole(address _address) public onlyOwner {
    revokeRole(EVENT_EMITTER_ROLE, _address);
  }

  function emitInfectionEvent(
    string calldata _infection,
    string[] calldata _infectee,
    string calldata _tester,
    uint _testTimeUtc,
    string calldata _signature
  ) public {
    require(hasRole(EVENT_EMITTER_ROLE, msg.sender), "Permission denied! Not authorized to emit infection event");
    emit InfectionEvent(_infection, _infectee, _tester, _testTimeUtc, _signature);
  }
}