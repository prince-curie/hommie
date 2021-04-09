## contract_address
contract_address: 0xac80b5e5e26bf3787591bc3b52a0de4679c53e71
## Transaction_Hash
Transaction_Hash: 0x44f137a009202916348c76eceb198146c0477273efd1c955f137f3497ce3b93e

## Libraries I Used and Why
### Truffle
Truffle is used due to the ease it provides in compiling and testing a smart contract, deploying the smart contract to the ethereum blockchain, and integrating a smart contract with a web app.

### Ganache
While building there is need to have a local blockchain to ensure that the latency and other issues involved with interacting with a main network or test network is avoided. Ganache allows you to develop fast by giving a safe environment to test and deploy your smart contract.

### IPFS
In order to save media assets and view it when needed. I needed the Ipfs library to connect to the Ipfs network.

### TruffleContract
This library made it possibe to access the smart contract methods from the javascript code running on the browser. It can also be used with Node.js.

### Web3.js
THis library is use to ensure I interact with the ethereum blockchain using javascript.

### Truffle hdwallet-provider
This library helps to configure a network connection to an ethereum network of choice.

## How I Implemented IPFS to Save Images

I had to use IPFS to save image files recently on a project I worked on. It was a blockchain project with the smart contract written in solidity. The frontend was in vanilla JavaScript, HTML and CSS. This articles shows how I was able to use IPFS from the frontend to save the image and also how I was able to view the image from the browser  

### Importing The IPFS Class
In order to interact with IPFS, we need to import it. Since the front end is in vanilla JavaScript we use the `ipfs` package hosted on a content delivery network(cdn). We import the `ipfs` package globally into the project as a javascript script using the link `<script src="https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js"></script>`. The link is placed in the HTML file.

### Uploading Image with IPFS
After importing the script we need to upload the image. To do this we need to:
1. Create an interface to ensure an image is picked.
2. Have event listeners to listen for when a file is selected
3. Initialise IPFS
4. Upload the image to IPFS

#### Create an interface to ensure an image is picked
To ensure a file is picked, a form is created with a input field for file, in the `index.html` file. 
```html
<form>
    <input type="file" accept="image/*" name="image" id="file">
</form>
```

#### Create event listeners 
We need to listen for when an image has been selected for upload. The event listener listens for the 'change' event on the `id` file. The listener is located in the `app.js` file. 
```javascript
$('#file').on('change', App.upload)
```
When the event is fired, the `upload` method is called to handle it.

#### Initialise IPFS
To get IPFS ready for use it is initialised and assigned to an `App.node` property on line 108.
Initialising Ipfs is done by calling the create method on Ipfs.
```javascript
// Set up IPFS
App.node = await Ipfs.create()
```  
The method is made an async method so we can use the await keyword without an error.

#### Upload the image
To upload the image, we need to ensure that the image is fully read by the javascript file and converted to an ArrayBuffer.

To read the image and convert it to ArrayBuffer we use the javascript `FileReader` Object. On the `FileReader` object we listen for the `load` event to ensure that the image has been successfully loaded.

The `load` event handler, takes the resulting ArrayBuffer which is saved on the result property of the `FileReader` object and send it as a parameter to the add method of Ipfs.

The `add` method of ipfs uploads the image.
```javascript
upload: async function (event) {
    const fileReader = new FileReader()
    // Read file as ArrayBuffer
    await fileReader.readAsArrayBuffer(event.target.files[0])
    //  Listen for the onload event
    fileReader.onload = async (event) => {            
        // upload the file content
        let result = await App.node.add(fileReader.result)
        // Pick out the file path. Here cid stands for content identifier.
        let cid = result.path 

        // So we can decide what to do with the content identifier
    }
    
}
```

### Viewing Image on IPFS
To fetch the image from ipfs, we need to attach the value saved to the cid variable to this url: [https://ipfs.io/ipfs/](https://ipfs.io/ipfs/). Running it on a web browser will return the image saved. 

### Conclusion
This article explains how I used IPFS to save images. I hope it passes the needed information to help you go through with such task.  

## Solidity Version
- v0.4.23

## Node Version
- v12.21.0

## Truffle Version
- v4.1.14

## web3 Version
- v1.3.4
