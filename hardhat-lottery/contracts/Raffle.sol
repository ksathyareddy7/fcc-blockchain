//SPDX-License-Identifier: MIT
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

//enter lottery paying some amount
// Pick a random winner
// Winner to be selected every X minutes -> completely automated
// Chainlink Oracles -> Randomness, Automated Execution(Chainlink Keeper)

error Raffle__NotEnoughETHEntered();

contract Raffle {
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    // EVENTS
    event RaffleEnter(address indexed player);

    constructor(uint256 _entranceFee) {
        i_entranceFee = _entranceFee;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    function getEntranceFee() public view returns (uint) {
        return i_entranceFee;
    }

    function getPlayer(uint index) public view returns (address) {
        return s_players[index];
    }
}
