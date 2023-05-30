//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";

error FundMe__NotOwner();

contract FundMe {
    using PriceConverter for uint256;
    address public owner;
    uint public minimumUSD = 50 * 1e18;
    address[] public funders;
    mapping(address => uint) public addressToAmountFunded;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= minimumUSD,
            "Didn't send enough!"
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint funderIndex = 0;
            funderIndex < funders.length;
            funderIndex = funderIndex + 1
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);
        (bool successCall, ) = payable(owner).call{
            value: address(this).balance
        }("");
        require(successCall, "reverting transaction.");
    }

    modifier onlyOwner() {
        //require(msg.sender == owner, "only owner can call this function");
        if (msg.sender != owner) {
            revert FundMe__NotOwner();
        }
        _;
    }
}
