//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    mapping(string => uint) public nameToFavoriteNumber;

    struct Person {
        uint favoriteNumber;
        string name;
    }

    Person[] public people;

    uint public favoriteNumber;

    function store(uint _num) public virtual {
        favoriteNumber = _num;
    }

    function addPerson(string memory _name, uint _n) public {
        Person memory p = Person({favoriteNumber: _n, name: _name});
        people.push(p);
        nameToFavoriteNumber[_name] = _n;
    }

    function retrieve() public view returns (uint) {
        return favoriteNumber;
    }
}
