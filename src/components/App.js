import React, { Component } from "react";
import { ethers } from 'ethers';
import KryptoBird from '../abis/KryptoBird.json'
import {MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn} from 'mdb-react-ui-kit';
import './App.css';

//const KryptoBird=await $.getJSON('../abis/KryptoBird.json');
class App extends Component {

  async componentDidMount() {
    await this.loadWeb3ProviderAndBlockchainData();
};

async loadWeb3ProviderAndBlockchainData() {
 
  // Loads MetaMask as the provider
 // const KryptoBird=await $.getJSON('../abis/KryptoBird.json');
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

// Check if provider loaded
  if(provider) {
  } else {
      window.alert('No Ethereum Wallet detected');
  };

  // Get accounts and networkId
  const accounts = await provider.send('eth_accounts', []);
  const networkId = await provider.send('net_version', []);

// Update State with info
  this.setState({
      account: accounts,
      networks: networkId
  });

  // Loads Contract information from the Blockchain
  const networkData = await KryptoBird.networks[networkId];

  if(networkData) {

      const contractAbi = KryptoBird.abi;
      const contractAddress = networkData.address;

// Ethers use a segregated approach to reading / writing to Contracts
// To read from, use contractRead
// To write to (like to Mint, etc, use contractSign

      const contractRead = new ethers.Contract(contractAddress, contractAbi, provider);
      const contractSign = new ethers.Contract(contractAddress, contractAbi, signer);
      
      this.setState({
          contractRead: contractRead,
          contractSign: contractSign
      });

  } else {
      window.alert('Smart Contract is not Deployed')
  };

// When calling functions using ethers.js, you can call them directly
// The below example calls totalSupply, directly under the contractRead object

  let getTotalSupply = await this.state.contractRead.totalSupply();
  getTotalSupply = ethers.utils.formatUnits(getTotalSupply, 0);

  this.setState({
      totalSupply: getTotalSupply
  });

  for(let i = 0; i < getTotalSupply; i++) {

      const KryptoBird = await this.state.contractRead.kryptoBirdz(i - 0);

      this.setState({
          kryptoBirdz:[...this.state.kryptoBirdz, KryptoBird]
      });
  }
};
  
  
  async mint(kryptoBird) {
   // const KryptoBird=await $.getJSON('../abis/KryptoBird.json');
    // The same goes for functions that write to the Contract (Minting)
    // Call the function directly under the contractSign object
   
          try {
              const txResponse = await this.state.contractSign.mint(kryptoBird);
              const txReceipt = await txResponse.wait();
              
              console.log('Data: ', txReceipt.events);
   
              this.setState({
                  kryptoBirdz:[...this.state.kryptoBirdz, KryptoBird]
              });
   
              console.log(this.state.kryptoBirdz);
   
          } catch (error) {
              console.log(error.message);
          };
      };
    
  constructor(props) {
       super(props);
       this.state = {
           account: '',
           networks:'',
           contract:null,
           contractRead:null,
           contractSign:null,
           totalSupply:0,
           kryptoBirdz:[]
       }
  }

          // BUILDING THE MINTING FORM
          // 1. Create a text input with a place holder 
          //'add file location'
          // 2. Create another input button with the type submit

  render() {
      return (
          <div className='container-filled'>
              {console.log(this.state.kryptoBirdz)}
              <nav className='navbar navbar-dark fixed-top 
              bg-dark flex-md-nowrap p-0 shadow'>
              <div className='navbar-brand col-sm-3 col-md-3 
              mr-0' style={{color:'white'}}>
                    Krypto Birdz NFTs (Non Fungible Tokens)
              </div>
              <ul className='navbar-nav px-3'>
              <li className='nav-item text-nowrap
              d-none d-sm-none d-sm-block
              '>
              <small className='text-white'>
                  {this.state.account}
              </small>
              </li>
              </ul>
              </nav>

              <div className='container-fluid mt-1'>
                  <div className='row'>
                      <main role='main' 
                      className='col-lg-12 d-flex text-center'>
                          <div className='content mr-auto ml-auto'
                          style={{opacity:'0.8'}}>
                              <h1 style={{color:'black'}}>
                                  KryptoBirdz - NFT Marketplace</h1>
                          <form onSubmit={(event)=>{
                              event.preventDefault()
                              const kryptoBird = this.kryptoBird.value
                              this.mint(kryptoBird)
                          }}>
                              <input
                              type='text'
                              placeholder='Add a file location'
                              className='form-control mb-1'
                              ref={(input)=>this.kryptoBird = input}
                              />
                              <input style={{margin:'6px'}}
                              type='submit'
                              className='btn btn-primary btn-black'
                              value='MINT'
                              />
                              </form>
                          </div>
                      </main>
                  </div>
                      <hr></hr>
                      <div className='row textCenter'>
                          {this.state.kryptoBirdz.map((kryptoBird, key)=>{
                              return(
                                  <div >
                                      <div>
                                          <MDBCard className='token img' style={{maxWidth:'22rem'}}>
                                          <MDBCardImage src={kryptoBird}  position='top' height='250rem' style={{marginRight:'4px'}} />
                                          <MDBCardBody>
                                          <MDBCardTitle> KryptoBirdz </MDBCardTitle> 
                                          <MDBCardText> The KryptoBirdz are 20 uniquely generated KBirdz from the cyberpunk cloud galaxy Mystopia! There is only one of each bird and each bird can be owned by a single person on the Ethereum blockchain. </MDBCardText>
                                          <MDBBtn href={kryptoBird}>Download</MDBBtn>
                                          </MDBCardBody>
                                          </MDBCard>
                                           </div>
                                  </div>
                              )
                          })} 
                      </div>
              </div>
          </div>
      )
  }
}

export default App;