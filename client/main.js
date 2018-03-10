import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import MockABI from './lib/ERC721TokenMock.json';
import './lib/blockies.js';

import './main.html';

Template.address.onCreated(function () {
  // counter starts at 0
  // this.identinum = new ReactiveVar(null);
});

Template.address.helpers({
  // identinum() {
  //   return Template.instance().identinum.get();
  // },
});

Template.address.events({
  'click #sendToken'(event, instance) {
    let receiver_addr = $('#addr-input').val();
    let erc721_contract = web3.eth.contract( MockABI).at('0x88d11a24B058606963e766B7572CB3da1f076410');

	let transHex = "";

	erc721_contract.mint(receiver_addr, 
	// {
	// 	from: receiver_addr,
	// 	gas: 1000000
	// }, 
	(err, result) => {
			if(err){
				console.log(err);
			}else{
				let element = $('<a>', {
		            href: "https://ropsten.etherscan.io/tx/" + result,
		            text: result
		        });
		        element.attr("target","_blank");
		        let divelement = $('<div>');
		        divelement.append(element);
				$('#transHex').append(divelement);

				$('#pending').toggleClass('hide');

				transHex = result;
				// console.log(result);

				//To make sure the transaction have already confirmed
				let filter = web3.eth.filter({
					transactionHash: result,
				});

				filter.watch(function(fil_err, blockhash){
					if(fil_err){
						console.log(fil_err);
					}else{
						// console.log(blockhash.transactionHash);
						//transaction have already confirmed
						if( transHex == blockhash.transactionHash ){
							filter.stopWatching();
							
							//use tricky way to detect the latest token the user apply
							erc721_contract.tokensOf(receiver_addr, (tokenerr, tokenlist) => {
								let pizzaId = tokenlist[tokenlist.length-1].toString();	
								
								let para = $('<p>');
								let icon = blockies.create({ // All options are optional
								    seed: pizzaId, // seed used to generate icon data, default: random
								    size: 15, // width/height of the icon in blocks, default: 10
								    scale: 3 // width/height of each block in pixels, default: 5
								});
								let span =  $('<span>', {
						            text: "The ERC-721 Token has already send to your account, it Unique ID is "+ pizzaId+ ", and it  identicon is "
						        });
						        para.append(span);
						        para.append(icon);
						        $('#complete').append(para);
								$('#complete').removeClass('hide');
								$('#padding').toggleClass('hide');
							});
							

						}
						


					}
				});
			}
		}
	); 
    



	
  },
});
