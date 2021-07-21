const { assert } = require('chai');

const Color = artifacts.require("Color");

require('chai')
.use(require('chai-as-promised'))
.should()

contract('Color', (accounts) => {

    let color

    before(async() => {
        color = await Color.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = color.address
            assert.notEqual(address, '')
            assert.notEqual(address, '0x0')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name and a symbol', async () => {
            const name = await color.name()
            const symbol = await color.symbol()
            assert.equal(name, 'Color')
            assert.equal(symbol, 'COLOR')
        })
    })

    describe('minting', async () => {
        it('creates a new token successfully', async () => {
            // SUCCESS
            const result = await color.mint('#EC058E')
            const totalSupply = await color.id()
            assert.equal(totalSupply.toString(), 1)
            //console.log(result)
            const event = result.logs[0].arg
            //console.log(event)

            // FAILURE: cannot mint the same color twice
            await color.mint('#EC058E').should.be.rejected

        })
    })

    describe('indexing', async () => {
        it('lists colors', async () => {
            // Mint 3 more tokens
            await color.mint('#5386E4')
            await color.mint('#FFFFFF')
            await color.mint('#000000')
            const totalSupply =  await color.id()
            console.log(totalSupply.toString())
 
            let x
            let result = []
            for(var i=0; i<totalSupply; i++){
                x = await color.colors(i)
                result.push(x)
            }

            // console.log(result)
            // console.log(result.join(','))
            let expected = ['#EC058E','#5386E4', '#FFFFFF', '#000000']
            // console.log(expected)
            // console.log(expected.join(','))

            assert.equal(result.join(','), expected.join(','))

        })
    })

})