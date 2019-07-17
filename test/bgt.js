const truffleAssert  = require('truffle-assertions');
const BGT = artifacts.require('BGT');

contract('BGT', accounts => {
    let token;

    describe('Test minting', () => {
        it('Add account 1 as minter', () => {
            return BGT.deployed()
            .then(instance => {
                token = instance
                return truffleAssert.passes(
                    token.addMinter.sendTransaction(accounts[1]),
                    'account 0 should be able to add minter'
                )
            })
        })

        it('Add account 2 as minter', () => {
            return truffleAssert.passes(
                token.addMinter.sendTransaction(accounts[2], {
                    from : accounts[1]
                }),
                'account 0 should be able to add minter'
            )
        })

        it('account 1 is minter', () => {
            return token.isMinter(accounts[1])
            .then(yes => {
                assert.equal(yes, true, 'account 1 should be a minter')
            })
        })

        it('Mint 1,000,000 BGT using account 1', () => {
            return truffleAssert.passes(
                token.mint.sendTransaction(
                    accounts[1],
                    web3.utils.toWei('1000000', 'ether'),
                    { from : accounts[1] }
                ),
                'Account 1 should be able to mint'
            )
        })

        it('Check Account 1 balance', () => {
            return token.balanceOf(accounts[1])
            .then(bal => {
                assert.equal(
                    bal.toString(),
                    web3.utils.toWei('1000000', 'ether')
                )
            })
        })

        it('Whitelist account 2', () => {
            return truffleAssert.passes(
                token.addWhitelisted.sendTransaction(accounts[2]),
                'Account 0 should be able to add whitelister'
            )
        })

        it('Removing Account 1 as minter', () => {
            return truffleAssert.passes(
                token.removeMinter.sendTransaction(accounts[1], { from : accounts[2] }),
                'Should be able to remove'
            )
        })

        it('Removing Account 2 as minter', () => {
            return truffleAssert.passes(
                token.removeMinter.sendTransaction(accounts[2]),
                'Account 0 should be able to remove'
            )
        })

        it('Make sure Account 1 is not a minter', () => {
            return token.isMinter(accounts[1])
            .then(no => {
                assert.equal(no, false, 'Should not be a minter.')
            })
        })

        it('Make sure Account 1 cannot mint', () => {
            return truffleAssert.fails(
                token.mint.sendTransaction(
                    accounts[1],
                    web3.utils.toWei('1', 'ether'),
                    { from : accounts[1] }
                ),
                truffleAssert.ErrorType.REVERT,
                'caller does not have the Minter role'
            )
        })
    })

    describe('Test basic ERC20', () => {
        it('Transfer to account 1', () => {
            return truffleAssert.passes(
                token.transfer.sendTransaction(
                    accounts[0],
                    web3.utils.toWei('1000', 'ether'),
                    { from : accounts[1] }
                ),
                'Should be able to transfer to account 1'
            )
        })

        it('Check account 1 balance', () => {
            return token.balanceOf(accounts[1])
            .then(bal => {
                assert.equal(
                    bal.toString(),
                    web3.utils.toWei('999000', 'ether'),
                    'Balance should be 999,000 BGT'
                )
            })
        })

        it('Check account 0 balance', () => {
            return token.balanceOf(accounts[0])
            .then(bal => {
                assert.equal(
                    bal.toString(),
                    web3.utils.toWei('1000', 'ether'),
                    'Balance should be 1,000 BGT'
                )
            })
        })
    })

    describe('Test burn', () => {
        it('Burn more balance from Account 0', () => {
            return truffleAssert.fails(
                token.burn.sendTransaction(web3.utils.toWei('5000', 'ether')),
                truffleAssert.ErrorType.REVERT,
                'subtraction overflow'
            )
        })

        it('Burn 500 BGT from Account 0', () => {
            return truffleAssert.passes(
                token.burn.sendTransaction(web3.utils.toWei('500', 'ether')),
                'Should have enough balance to burn'
            )
        })

        it('Check total supply', () => {
            return token.totalSupply()
            .then(total => {
                assert.equal(
                    total.toString(),
                    web3.utils.toWei('999500', 'ether'),
                    'Should have 999,500 BGT'
                )
            })
        })
    })
})
