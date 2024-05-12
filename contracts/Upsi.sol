// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Upsi is Ownable, AccessControl {

  bytes32 public constant EVENT_EMITTER_ROLE = keccak256("EVENT_EMITTER_ROLE");

  event InfectionEvent(
    string infection,
    address[] infectee,
    address tester,
    string testTime,
    string signature
  );

  constructor() Ownable(msg.sender) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function grantEventEmitterRole(address _address) public onlyOwner {
    grantRole(EVENT_EMITTER_ROLE, _address);
  }

  function revokeEventEmitterRole(address _address) public onlyOwner {
    revokeRole(EVENT_EMITTER_ROLE, _address);
  }

  function emitInfectionEvent(
    string calldata _infection,
    address[] calldata _infectee,
    address _tester,
    string calldata _testTimeUtc,
    string calldata _signature
  ) public {
    require(hasRole(EVENT_EMITTER_ROLE, msg.sender), "Permission denied! Not authorized to emit infection event");
    emit InfectionEvent(_infection, _infectee, _tester, _testTimeUtc, _signature);
  }
}