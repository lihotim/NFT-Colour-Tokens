// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Color is ERC721 {
    
    string[] public colors;
    uint public id;
    mapping(string => bool) public colorExist;

    constructor() ERC721("Color", "COLOR") {
        
    }

    function mint(string memory _color) public {
        // require a unique color
        require(colorExist[_color] == false, "This colour has already been created!");
        
        // color - add it to the array
        colors.push(_color);
        
        // call the mint function in ERC721
        id++;            // Note: the id will be counted from 1,2,3..., not 0,1,2... 
        _mint(msg.sender, id);
        
        // color - track it, see if it has already been created
        colorExist[_color] = true;
        
    }

}