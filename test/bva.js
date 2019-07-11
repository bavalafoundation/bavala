const truffleAssert  = require('truffle-assertions');
const BVA            = artifacts.require('BVA');
const BVAFounders    = artifacts.require('BVAFounders');
const BVATeamMembers = artifacts.require('BVATeamMembers');

function advanceTime(time) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc : '2.0',
            method  : 'evm_increaseTime',
            params  : [time],
            id      : new Date().getTime()
        }, (err, result) => {
            if (err) {
                return reject(err)
            }
            return resolve(result)
        })
    })
}

contract('BVA', accounts => {
    let bvaFounders, bvaMembers;

    describe('Checking Total Supply and Transfer', () => {
        it('Total supply should have 28,000,000 BVA', () => {
            return BVA.deployed()
            .then(instance => instance.totalSupply.call())
            .then(amount   => {
                assert.equal(
                    amount.toString(),
                    web3.utils.toWei('28000000', 'ether'),
                    'Total supply is not 28,000,000 BVA'
                    )
            })
        })

        it('BVA Contract should have 28,000,000 BVA', () => {
            return BVA.deployed()
            .then(instance => instance.balanceOf.call(instance.address))
            .then(amount   => {
                assert.equal(
                    amount.toString(),
                    web3.utils.toWei('28000000', 'ether'),
                    'Incorrect initial balance'
                    )
            })
        })
    })

    describe('Testing BVA transfer', () => {
        it(`Transfer 10 BVA from Contract to ${accounts[0]}`, () => {
            return BVA.deployed()
            .then(instance => {
                return instance.sendBVA.sendTransaction(
                    accounts[0],
                    web3.utils.toWei('10', 'ether')
                    )
            })
            .then(res => {
                assert.equal(
                    res.receipt.status,
                    1,
                    'Receipt status should be 1'
                    )
            })
        })

        it(`Transfer 2.5 BVA from ${accounts[0]} to ${accounts[1]}`, () => {
            return BVA.deployed()
            .then(instance => {
                return instance.transfer.sendTransaction(
                    accounts[1],
                    web3.utils.toWei('2.5', 'ether')
                    )
            })
            .then(res => {
                assert.equal(
                    res.receipt.status,
                    1,
                    'Receipt status should be 1'
                    )
            })
        })

        it(`Transfer 0.5 BVA from ${accounts[1]} to ${accounts[2]}`, () => {
            return BVA.deployed()
            .then(instance => {
                return instance.transfer.sendTransaction(
                    accounts[2],
                    web3.utils.toWei('0.5', 'ether'),
                    {
                        from : accounts[1]
                    }
                    )
            })
            .then(res => {
                assert.equal(
                    res.receipt.status,
                    1,
                    'Receipt status should be 1'
                    )
            })
        })
    })

    describe('Checking BVA balances', () => {
        it(`BVA Contract balance should be 27,999,990 BVA`, () => {
            return BVA.deployed()
            .then(instance => instance.balanceOf.call(instance.address))
            .then(amount   => {
                assert.equal(
                    amount.toString(),
                    web3.utils.toWei('27999990', 'ether'),
                    `Contract balance should have 27,999,990 BVA`
                    )
            })
        })

        it(`${accounts[0]} BVA balance should be 7.5 BVA`, () => {
            return BVA.deployed()
            .then(instance => instance.balanceOf.call(accounts[0]))
            .then(amount   => {
                assert.equal(
                    amount.toString(),
                    web3.utils.toWei('7.5', 'ether'),
                    `${accounts[0]} balance should have 7.5 BVA`
                    )
            })
        })

        it(`${accounts[1]} BVA balance should be 2 BVA`, () => {
            return BVA.deployed()
            .then(instance => instance.balanceOf.call(accounts[1]))
            .then(amount   => {
                assert.equal(
                    amount.toString(),
                    web3.utils.toWei('2', 'ether'),
                    `${accounts[1]} balance should have 2 BVA`
                    )
            })
        })

        it(`${accounts[2]} BVA balance should be 0.5 BVA`, () => {
            return BVA.deployed()
            .then(instance => instance.balanceOf.call(accounts[2]))
            .then(amount   => {
                assert.equal(
                    amount.toString(),
                    web3.utils.toWei('0.5', 'ether'),
                    `${accounts[2]} balance should have 0.5 BVA`
                    )
            })
        })
    })

    describe('Testing BVAFounders Contract', () => {
        it('Testing deploy BVAFounders Contract', () => {
            return BVA.deployed()
            .then(instance => {
                return BVAFounders.new(instance.address)
            })
            .then(instance => {
                bvaFounders = instance;
            })
        })

        it('Issueing 1,260,000 BVA to BVAFounders Contract', () => {
            let bva;
            return BVA.deployed()
            .then(instance => {
                bva = instance;
                return bva.sendBVA.sendTransaction(
                    bvaFounders.address,
                    web3.utils.toWei('1260000', 'ether')
                )
            })
            .then(res => {
                assert.equal(
                    res.receipt.status,
                    1,
                    'Receipt status should be 1'
                )
            })
        })

        it('BVAFounders BVA balance should have 1,260,000 BVA', () => {
            let bva;
            return BVA.deployed()
            .then(instance => {
                bva = instance;
                return bva.balanceOf.call(bvaFounders.address)
            })
            .then(amount   => {
                assert.equal(
                    amount.toString(),
                    web3.utils.toWei('1260000', 'ether'),
                    `BVAFounders should have 1,260,000 BVA`
                )
            })
        })

        it('Testing send ETH into BVAFounders', () => {
            let bal;
            return web3.eth.sendTransaction({
                value : web3.utils.toWei('0.01', 'ether'),
                from  : accounts[0],
                to    : bvaFounders.address
            })
            .then(tx => web3.eth.getTransactionReceipt(tx.transactionHash))
            .then(receipt => {
                assert.equal(
                    receipt.status,
                    true,
                    'Unable to send ETH'
                )
                return web3.eth.getBalance(bvaFounders.address)
            })
            .then(amount => {
                assert.equal(
                    amount.toString(),
                    web3.utils.toWei('0.01', 'ether'),
                    'Balance should be 0.01 ETH'
                )
                return web3.eth.getBalance(accounts[0])
            })
            .then(amount => {
                return bvaFounders.withdrawEther.sendTransaction(
                    web3.utils.toWei('0.01', 'ether')
                )
            })
            .then(resp => {
                assert.equal(
                    resp.receipt.status,
                    true,
                    'Receipt status should be true'
                )
            })
        })
    })

    describe('Testing BVATeamMembers Contract', () => {
        it('Testing deploy BVATeamMembers Contract', () => {
            return BVA.deployed()
            .then(instance => {
                return BVATeamMembers.new(instance.address)
            })
            .then(instance => {
                bvaMembers = instance;
            })
        })

        it('Issueing 1,260,000 BVA to BVATeamMembers Contract', () => {
            let bva;
            return BVA.deployed()
            .then(instance => {
                bva = instance;
                return bva.sendBVA.sendTransaction(
                    bvaMembers.address,
                    web3.utils.toWei('1260000', 'ether')
                )
            })
            .then(res => {
                assert.equal(
                    res.receipt.status,
                    1,
                    'Receipt status should be 1'
                )
            })
        })

        it('BVATeamMembers BVA balance should have 1,260,000 BVA', () => {
            let bva;
            return BVA.deployed()
            .then(instance => {
                bva = instance;
                return bva.balanceOf.call(bvaMembers.address)
            })
            .then(amount   => {
                assert.equal(
                    amount.toString(),
                    web3.utils.toWei('1260000', 'ether'),
                    `BVATeamMembers should have 1,260,000 BVA`
                )
            })
        })

        it('Testing send ETH into BVATeamMembers', () => {
            let bal;
            return web3.eth.sendTransaction({
                value : web3.utils.toWei('0.01', 'ether'),
                from  : accounts[0],
                to    : bvaMembers.address
            })
            .then(tx => web3.eth.getTransactionReceipt(tx.transactionHash))
            .then(receipt => {
                assert.equal(
                    receipt.status,
                    true,
                    'Unable to send ETH'
                )
                return web3.eth.getBalance(bvaMembers.address)
            })
            .then(amount => {
                assert.equal(
                    amount.toString(),
                    web3.utils.toWei('0.01', 'ether'),
                    'Balance should be 0.01 ETH'
                )
                return web3.eth.getBalance(accounts[0])
            })
            .then(amount => {
                return bvaMembers.withdrawEther.sendTransaction(
                    web3.utils.toWei('0.01', 'ether')
                )
            })
            .then(resp => {
                assert.equal(
                    resp.receipt.status,
                    true,
                    'Receipt status should be true'
                )
            })
        })
    })

    describe('Testing Time Contract', () => {
        it('BVATeamMembers 1st withdrawal before 2020-12-01', () => {
            return truffleAssert.passes(
                bvaMembers.unlockTokens.sendTransaction(accounts[2]),
                'Unlock time 1 should pass'
            )
        })

        it('BVATeamMembers 2nd withdrawal before 2020-12-01', () => {
            return truffleAssert.fails(
                bvaMembers.unlockTokens.sendTransaction(accounts[2]),
                truffleAssert.ErrorType.REVERT,
                'checkpoint 1 balance error'
            )
        })

        it('BVAFounders withdrawal before 2020-12-01', () => {
            return truffleAssert.fails(
                bvaFounders.unlockTokens.sendTransaction(accounts[2]),
                truffleAssert.ErrorType.REVERT,
                'locked'
            )
        })

        it('BVAFounders withdrawal between 2020-12-01 and 2020-12-31', () => {
            return advanceTime(86400)
            .then(() => {
                return truffleAssert.passes(
                    bvaFounders.unlockTokens.sendTransaction(accounts[2]),
                    'Unlock time 1 should pass'
                )
            })
        })

        it('BVAFounders withdrawal between 2021-01-01 and 2021-11-30', () => {
            return advanceTime(86400 * 31)
            .then(() => {
                return truffleAssert.fails(
                    bvaFounders.unlockTokens.sendTransaction(accounts[2]),
                    truffleAssert.ErrorType.REVERT,
                    'checkpoint 1 balance error'
                )
            })
        })

        it('BVATeamMembers 1st withdrawal between 2021-01-01 and 2021-11-30', () => {
            return truffleAssert.passes(
                bvaMembers.unlockTokens.sendTransaction(accounts[2]),
                'Unlock time 2 should pass'
            )
        })

        it('BVATeamMembers 2nd withdrawal between 2021-01-01 and 2021-11-30', () => {
            return truffleAssert.fails(
                bvaMembers.unlockTokens.sendTransaction(accounts[2]),
                truffleAssert.ErrorType.REVERT,
                'checkpoint 2 balance error'
            )
        })

        it('BVAFounders 1st withdrawal between 2022-01-01 and 2022-11-30', () => {
            return advanceTime(31536000)
            .then(() => {
                return truffleAssert.passes(
                    bvaFounders.unlockTokens.sendTransaction(accounts[2]),
                    'Unlock time 2 should pass'
                )
            })
        })

        it('BVAFounders 2nd withdrawal between 2022-01-01 and 2022-11-30', () => {
            return truffleAssert.fails(
                bvaFounders.unlockTokens.sendTransaction(accounts[2]),
                truffleAssert.ErrorType.REVERT,
                'checkpoint 2 balance error'
            )
        })

        it('BVATeamMembers 1st withdrawal between 2022-01-01 and 2022-11-30', () => {
            return truffleAssert.passes(
                bvaMembers.unlockTokens.sendTransaction(accounts[2]),
                'Unlock time 3 should pass'
            )
        })

        it('BVATeamMembers 2nd withdrawal between 2022-01-01 and 2022-11-30', () => {
            return truffleAssert.fails(
                bvaMembers.unlockTokens.sendTransaction(accounts[2]),
                truffleAssert.ErrorType.REVERT,
                'checkpoint 3 balance error'
            )
        })

        it('BVAFounders 1st withdrawal between 2023-01-01 and 2023-11-30', () => {
            return advanceTime(31536000)
            .then(() => {
                return truffleAssert.passes(
                    bvaFounders.unlockTokens.sendTransaction(accounts[2]),
                    'Unlock time 3 should pass'
                )
            })
        })

        it('BVAFounders 2nd withdrawal between 2023-01-01 and 2023-11-30', () => {
            return truffleAssert.fails(
                bvaFounders.unlockTokens.sendTransaction(accounts[2]),
                truffleAssert.ErrorType.REVERT,
                'checkpoint 3 balance error'
            )
        })

        it('BVATeamMembers withdrawal between 2023-01-01 and 2023-11-30', () => {
            return truffleAssert.passes(
                bvaMembers.unlockTokens.sendTransaction(accounts[2]),
                'Unlock time 4 should pass'
            )
        })

        it('BVAFounders 1st withdrawal between 2024-01-01 and 2024-11-30', () => {
            return advanceTime(31536000)
            .then(() => {
                return truffleAssert.passes(
                    bvaFounders.unlockTokens.sendTransaction(accounts[2]),
                    'Unlock time 4 should pass'
                )
            })
        })

        it('BVAFounders 2nd withdrawal between 2024-01-01 and 2024-11-30', () => {
            return truffleAssert.fails(
                bvaFounders.unlockTokens.sendTransaction(accounts[2]),
                truffleAssert.ErrorType.REVERT,
                'checkpoint 4 balance error'
            )
        })

        it('BVAFounders 1st withdrawal after 2025-01-01', () => {
            return advanceTime(31536000 + 86400)
            .then(() => {
                return truffleAssert.passes(
                    bvaFounders.unlockTokens.sendTransaction(accounts[2]),
                    'Unlock time 5 should pass'
                )
            })
        })

        it('BVAFounders 2nd withdrawal after 2025-01-01', () => {
            return truffleAssert.fails(
                bvaFounders.unlockTokens.sendTransaction(accounts[2]),
                truffleAssert.ErrorType.REVERT,
                'checkpoint 5 balance error'
            )
        })

        it('BVAFounders 1st withdrawal after 2026-01-01', () => {
            return advanceTime(31536000)
            .then(() => {
                return truffleAssert.passes(
                    bvaFounders.unlockTokens.sendTransaction(accounts[2]),
                    'Unlock time 6 should pass'
                )
            })
        })

        it('BVAFounders 2nd withdrawal after 2026-01-01', () => {
            return truffleAssert.passes(
                bvaFounders.unlockTokens.sendTransaction(accounts[2]),
                'Unlock time 6 should pass'
            )
        })
    })
})
