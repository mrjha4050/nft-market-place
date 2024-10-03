// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenizeAsset {
    string public assetName;
    address public owner;

    constructor(string memory _assetName) {
        assetName = _assetName;
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
