pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // 1.Stakes tokens (Deposit)
    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "amount cannot be 0");
        /*
        msg.sender: Investor
        address(this): address of TokenFarm contract
        transferFrom is a delegated transfer call from DaiToken
        */
        daiToken.transferFrom(msg.sender, address(this), _amount);

        //Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        //Add user to stakers array only if they haven't staked already
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // 2.Unstake tokens (Withdraw)
    function unstakeTokens() public {
        //Fetch staking balance
        uint256 balance = stakingBalance[msg.sender];

        //Require amount >0
        require(balance > 0, "staking balance cannot be 0");

        //Transfer Mock DAI tokens to this contract for staking.
        daiToken.transfer(msg.sender, balance);

        //Reset staking balance
        stakingBalance[msg.sender] = 0;

        //Update staking status
        isStaking[msg.sender] = false;
    }

    // 3. Issuing Tokens can be done by the owner

    function issueTokens() public {
        require(msg.sender == owner, "Caller must be the owner");

        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
}
