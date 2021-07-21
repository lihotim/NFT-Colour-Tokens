import React, { Component } from 'react';
import Web3 from 'web3'
import Color from '../abis/Color.json'
import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {

    const web3 = window.web3

    //load accounts, fetch account's ETH balance
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // fetch the '5777' value
    const networdId = await web3.eth.net.getId()

    // Load Color smart contract
    const colorData = Color.networks[networdId]
    if(colorData){
      const color = new web3.eth.Contract(Color.abi, colorData.address)
      this.setState({ color })

      // Fetch the totalSupply (i.e. 'id' in the smart contract)
      const totalSupply = await color.methods.id().call()
      this.setState({ totalSupply })
      //console.log(totalSupply.toString())

      // Load all colors
      for(var i=0; i<totalSupply; i++){
        let a = await color.methods.colors(i).call()
        this.setState({ colors: [...this.state.colors, a] })
      }
      //console.log(this.state.colors)

    }else{
      window.alert('Color contract not deployed to detected network.')
    }

    this.setState({loading:false})
  }

  mint = (color) => {
    this.state.color.methods.mint(color).send({from: this.state.account})
    .then(function(receipt){
      this.setState({ colors: [...this.state.colors, color] })
    })

    // .once('receipt', (receipt) => {
    //   this.setState({ colors: [...this.state.colors, color] })
    // })


  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      account: '',
      color: {}, 
      totalSupply: 0,
      colors: [],
    }

  }

  render() {
    return (
      <div>

        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>

            <div>
                <ul className="navbar-nav px-3">
                    <li className="nav-item flex-nowrap d-none d-sm-none d-sm-block">
                        <small className="text-white">
                            Your account: {this.state.account}
                        </small>
                    </li>
                </ul>
            </div>
        </nav>


        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {/* Form goes here */}
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const x = this.color.value
                  this.mint(x)
                }}>
                  <input 
                    type="text"
                    className="form-control mb-1"
                    placeholder="e.g. #FFFFFF"
                    ref={(input) => {this.color = input}}
                  />
                  <input 
                    type="submit" 
                    className="btn btn-block btn-primary"
                    value="Mint my token!"
                  />
                </form>
              </div>
            </main>
          </div>
          
          <hr/>
          <div className="row text-center">
              {/* Display goes here */}
              {this.state.colors.map((color, key) => {
                return(
                  <div key={key} className="col-md-3 mb-3">
                    <div className="token" style={{background: color}}></div>
                    <div>{color}</div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
