const truffleAssert = require('truffle-assertions');
const BVA           = artifacts.require('BVA');
const BVAFounders   = artifacts.require('BVAFounders');

contract('BVA', accounts => {
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
		let bvaFounders;

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

		it('Testing BVAFounders BVA unlockTime', () => {
			let bva;
			return web3.eth.getBlock('latest')
			.then(block => {
				if (block.timestamp <= 1557238800) {
					return truffleAssert.fails(
						bvaFounders.unlockTokens.sendTransaction(accounts[2]),
						truffleAssert.ErrorType.REVERT,
						'Unlock time unmet'
					)
				} else {
					return bvaFounders.unlockTokens.sendTransaction(accounts[2])
					.then(res => {
						assert.equal(
							res.receipt.status,
							true,
							'Receipt status should be true'
						)

						return BVA.deployed()
					})
					.then(instance => {
						bva = instance
						return instance.balanceOf.call(accounts[2])
					})
					.then(amount => {
						assert.equal(
							amount.toString(),
							web3.utils.toWei('1260000.5', 'ether'),
							`${accounts[2]} BVA Balance should be 1,260,000.5 BVA`
						)
						return bva.balanceOf.call(bvaFounders.address)
					})
					.then(amount => {
						assert.equal(
							amount.toString(),
							web3.utils.toWei('0', 'ether'),
							'BVAFounders Contract BVA Balance should be 0 BVA'
						)
					})
				}
			})
		})

		it('Testing send ETH into BVAFounds', () => {
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
})
