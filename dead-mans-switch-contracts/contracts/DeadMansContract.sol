// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DeadMansContract is Ownable //Need to test functions in diff scenarios
{
    string private _decryptionKey;
    string _url;
    uint256 nextTimestamp;
    uint256 private _hourCadence;

    event heartbeat();

    constructor(string memory decryptionKey, uint256 hourCadence) {
        require(hourCadence < 168); // Owner has to check in atleast once a week
        _decryptionKey = decryptionKey;
        _hourCadence = hourCadence;
        nextTimestamp = block.timestamp + convertHourToUnixEpoch(_hourCadence);
    }

    function isActive() public view onlyOwner returns (bool) {
        if (block.timestamp <= nextTimestamp) {
            return true;
        } else {
            return false;
        }
    }

    function tick() public onlyOwner {
        require(block.timestamp <= nextTimestamp);
        nextTimestamp += convertHourToUnixEpoch(_hourCadence);
        emit heartbeat();
    }

    function getDecryptionKey() public view returns (string memory) { // Owner has failed to check on DMS, reveal key.
        require(block.timestamp >= nextTimestamp, "The switch has not been activated yet");
        return _decryptionKey;
    }


    function getNextTimeStamp() public view returns (uint256) {
        return nextTimestamp;
    }

    function setUrl(string memory url) public onlyOwner {
        _url = url;
    }

    function getUrl() public view returns (string memory) {
        return _url;
    }

    function defuse() public onlyOwner {
        _hourCadence = 0;
        nextTimestamp = 0;
        _decryptionKey = "";
        renounceOwnership();
    } // Turn off DMS

    function _renounceOwnership() public onlyOwner {
        renounceOwnership();
    }

    function convertHourToUnixEpoch(uint256 h) internal pure returns (uint256) {
        return h * 3600;
    }

    function getCadence() public view returns(uint256){
        return _hourCadence;
    }
}
