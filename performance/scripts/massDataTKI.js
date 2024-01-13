
/* eslint-disable */
// To run use command:
// node scripts/massDataTKI.js --url=http://192.168.50.10:8143 --buyingHouseholds=5 --sellingHouseholds=5 --bigSuppliers=0 --quantityDifferentiation=10 --priceDifferentiation=20

var request = require("request");
const logger = require('log4js').getLogger('ng-rt-digitalAsset-sdk.scripts.massDataTKI');
const args = require('yargs').argv;
const orders = 1;
const priceHousehold = 0.20
const priceSupplier = 0.20;
const quantityHousehold = 2
const quantitySupplier = 200
const auctionDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
const {contextUtil, digitalAssetDriver, digitalAssetApi} = require("ng-rt-digitalAsset-sdk");

var url = args.url;
if (!url) {
    throw new Error('Please set your URL by --url=YOUR_URL');
}

var buyingHouseholds = args.buyingHouseholds;
if (!buyingHouseholds && buyingHouseholds != 0) {
    throw new Error('Please set number of buying households you want to post by --buyingHouseholds=NO_OF_HOUSEHOLDS');
}

var sellingHouseholds = args.sellingHouseholds;
if (!sellingHouseholds && sellingHouseholds != 0) {
    throw new Error('Please set number of selling households you want to post by --sellingHouseholds=NO_OF_HOUSEHOLDS');
}

var bigSuppliers = args.bigSuppliers;
if (!bigSuppliers && bigSuppliers != 0) {
    throw new Error('Please set number of selling big suppliers you want to post by --bigSuppliers=NO_OF_SUPPLIERS ');
}

var quantityDifferentiation = args.quantityDifferentiation;
if (!quantityDifferentiation && quantityDifferentiation != 0) {
    throw new Error('Please set percentage of differentiation in quantity for each order you want to post by --quantityDifferentiation=PERCENTAGE ');
}

var priceDifferentiation = args.priceDifferentiation;
if (!priceDifferentiation && priceDifferentiation != 0) {
    throw new Error('Please set percentage of differentiation in price for each order you want to post by --priceDifferentiation=PERCENTAGE ');
}

const tradeForHousehold = async () => {
    for (let i = 1; i <= buyingHouseholds; i++) {
        keypair = await digitalAssetDriver.generateKeyPairs()
        submitOrder("buy", "household", keypair)
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    for (let i = 1; i <= sellingHouseholds; i++) {
        keypair = await digitalAssetDriver.generateKeyPairs()
        submitOrder("sell", "household", keypair)
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    for (let i = 1; i <= bigSuppliers; i++) {
        keypair = await digitalAssetDriver.generateKeyPairs()
        submitOrder("sell", "supplier", keypair)
    }
}

const calcPriceDifference = async () => {
    if (priceDifferentiation !== 0) {
        const priceDifference = (0.01 * (Math.round(Math.random() * (priceDifferentiation * 2)) - priceDifferentiation));
        return (Math.round((priceHousehold + (priceHousehold * priceDifference))* 1000) / 1000);
    }
    else if (priceDifferentiation === 0) {
        return (priceHousehold);
    }
}

const calcQuantityDifference = async () => {
    if (quantityDifferentiation !== 0) {
        const quantityDifference = (0.01 * (Math.round(Math.random() * (quantityDifferentiation * 2)) - quantityDifferentiation));
        return (Math.round((quantityHousehold + (quantityHousehold * quantityDifference))* 1000) / 1000);
    }
    else if (quantityDifferentiation === 0) {
        return(quantityHousehold);
    }
}

const submitOrder = async (type, actor, keypair) => {
    for (let i = 0; i < orders; i++) {
        const minutes = 900 * i;
        const date = (auctionDate.getTime()/1000|0) + minutes;
        makeApiCall(type, date, actor, keypair);
    }
}

const makeApiCall = async (type, date, actor, keypair) => {
    var price;
    var quantity;
    if (actor === "household"){
        price = await calcPriceDifference();
        quantity = await calcQuantityDifference();
    }
    else if (actor === "supplier") {
        quantity = quantitySupplier
        price = priceSupplier
    }
    var options = {
        method: 'POST',
        url: url + `/ng-tki-prosumer-backend/postOrder`,
        headers:
        {
        },
        body:
        {
            "orderType": "energy", // flexibility or "energy"
            "type": type,
            //"subtype": "negative", // Can be "positive" or "negative". Delete line when "ordertype": "energy"
            "quantity": quantity,
            "price": price,
            "auctionDate": new Date(date*1000),
            "electricityType": "solar",
            "smartMeterID" : "Hgste3USgst2635GSFQW272636wyWY",
            "currentOwner": keypair.signKp.publicKey
        },
        json: true
    };
        request(options, function (error, response, body) {
            logger.debug(body);
            if (error !== null){
                console.error('error:', error); // Print the error if one occurred
            }
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body);
            console.log(options.body)
        })
    }

tradeForHousehold();
