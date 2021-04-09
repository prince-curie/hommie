App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await ethereum.request({ method: 'eth_requestAccounts' });

            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        await App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: async function () {
        web3 = await new Web3(App.web3Provider);
        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: async function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        // Set default account
        web3.eth.defaultAccount = App.metamaskAccountID;

        // Set up IPFS
        App.node = await Ipfs.create()

        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
        $('#file').on('change', App.upload)
    },

    handleButtonClick: async function(event) {
        // event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            case 11:
                return await App.read(event);
                break;
            }
    },

    harvestItem: async function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm()

        try {
            let appContract = await App.contracts.SupplyChain.deployed()    
            let result = await appContract.harvestItem(
                App.upc, 
                App.metamaskAccountID, 
                App.originFarmName, 
                App.originFarmInformation, 
                App.originFarmLatitude, 
                App.originFarmLongitude, 
                App.productNotes,
                {'from': App.metamaskAccountID}
            )

            $("#ftc-item").text(result);
            console.log('harvestItem',result);
        } catch (err) {
            console.log(err.message);
        }
    },

    processItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('processItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    packItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellItem: async function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        try {
            let appContract = await App.contracts.SupplyChain.deployed()
            const productPrice = web3.utils.toWei(App.productPrice, "ether");
            console.log('productPrice',productPrice);
            let result = await appContract.sellItem(App.upc, productPrice, {from: App.metamaskAccountID});
                
            $("#ftc-item").text(result);
            console.log('sellItem',result);                
        } catch (err) {
            console.log(err.message);
        }
    },

    buyItem: async function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        try {
            let appContract = await App.contracts.SupplyChain.deployed()
            const walletValue = web3.utils.toWei(App.productPrice, "ether");
            const result = await appContract.buyItem(App.upc, {from: App.metamaskAccountID, value: walletValue, to: App.originFarmerID});
            $("#ftc-item").text(result);
            console.log('buyItem',result);
        } catch (err) {
            console.log(err.message);            
        }
    },

    shipItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('shipItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItem: async function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();
        
        try {
            let appContract = await App.contracts.SupplyChain.deployed()
            console.log('AAA ', App.upc, '\n', 'bbb => ', App.metamaskAccountID, '\n', 'from form ==> ',$("#consumerID").val(), App.consumerID)
            let result = await appContract.purchaseItem(App.upc, {'from': App.metamaskAccountID});
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);                
        } catch (err) {
            console.log(err);            
        }
    },

    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },  

    upload: async function (event) {
        // event.preventDefault()

        let supplyChain = await App.contracts.SupplyChain.deployed()
        const fileReader = new FileReader()
        await fileReader.readAsArrayBuffer(event.target.files[0])
        fileReader.onload = async (event) => {            

            let result = await App.node.add(fileReader.result)
            let cid = result.path 

            try {
                result = await supplyChain.saveImageHash(App.upc, cid, {
                    from: App.metamaskAccountID}
                )
                console.log('result ==> ', result);
                $("#ftc-item").text(result);    
            } catch (error) {
                console.log('error ==> ', error);
            }
        }
        
    },

    read: async function () {
        let base_url = 'https://ipfs.io/ipfs'
        const supplyChain = await App.contracts.SupplyChain.deployed()
        let cid = await supplyChain.fetchCid(App.upc, {from: App.metamaskAccountID})
        let img = document.getElementById('display_image')
        img.src = `${base_url}/${cid}`
    },
    
    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
