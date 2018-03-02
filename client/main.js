import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import MockABI from './lib/ERC721TokenMock.json';

import './main.html';

Template.address.onCreated(function helloOnCreated() {
  // counter starts at 0
  // this.counter = new ReactiveVar(0);
});

Template.address.helpers({
  // counter() {
  //   return Template.instance().counter.get();
  // },
});

Template.address.events({
  'click #sendToken'(event, instance) {
    let receiver_addr = $('#addr-input').val();
    let erc721_contract = web3.eth.contract( MockABI).at('0x1c4BBD432056d150db7eD3415ed29De0EEd8A143');
 //    	function(err, result){
 //    		if(err){
 //    			console.error(err);
 //    		}
 //    	}
	// );

	// console.log(erc721_contract);
	// erc721_contract.totalSupply((err, supply) =>
	// 	{
	// 		if(err){
	// 			console.log(err);
	// 		}else{
	// 			console.log(supply);
	// 		}
	// 	}
	// );

	erc721_contract.mint(receiver_addr, {
		from: receiver_addr,
		gas: 1000000
	}, (err, result) => {
			if(err){
				console.log(err);
			}else{
				let element = $('<a>', {
		            href: "https://ropsten.etherscan.io/tx/" + result,
		            text: result
		        });
		        element.attr("target","_blank");
				$('#transHex').append(element);
			}
		}
	); 
    
  },
});
