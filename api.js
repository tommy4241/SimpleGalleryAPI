const { default: axios } = require("axios");

require("dotenv").config();
const router = require("express").Router();
const ethers = require("ethers");

const SimplifiedERC721ABI = require("./erc721abi");

// get a list of nft contracts
router.get("/collections", async(req,res) => {
    try {
        let thenticUrl = `https://thentic.tech/api/contracts?key=${process.env.THENTIC_KEY}&chain_id=${process.env.CHAIND_ID}`;
        let response = await axios.get(thenticUrl);
        if(response.status != 200) {
            return res.json({
                status : 0,
                data : "internal server error"
            })
        }
        let contracts = response.data.contracts;
        let myCollections = [];
        contracts.map(sc => myCollections.push({
            name : sc.name,
            address : sc.contract
        }));
        return res.json({
            status : 1,
            data : contracts
        })
    } catch (error) {
        return res.json({
            status : 0,
            data : error.toString()
        })
    }
});

// get a list of nfts from a certain nft contract(collection)
router.get("/getCollectionItems/:contract", async(req,res) => {
    try {
        let contract = String(req.params.contract).toLowerCase();
        let thenticUrl = `https://thentic.tech/api/nfts?key=${process.env.THENTIC_KEY}&chain_id=${process.env.CHAIND_ID}`;
        let response = await axios.get(thenticUrl);
        if(response.status != 200) {
            return res.json({
                status : 0,
                data : "internal server error"
            })
        }
        let nfts = response.data.nfts;
        let nftsInCollection = [];
        nfts.map(nft => {
            if(String(nft.contract).toLowerCase() == contract){
                nftsInCollection.push({
                    id : nft.id,
                    name : nft.name
                });
            }
        });
        return res.json({
            status : 1,
            data :nftsInCollection
        })
    } catch (error) {
        return res.json({
            status : 0,
            data : error.toString()
        })
    }
});

// get nft uri for tokenID to get metadata
router.get("/nftDetails/:contract/:id", async(req,res) => {
    try {
        let contract = req.params.contract;
        let tokenID = parseInt(req.params.id);
        let provider = new ethers.providers.JsonRpcProvider(
            process.env.RPC,
            parseInt(process.env.CHAIND_ID)
        );
        let tokenContract = new ethers.Contract(
            contract,
            SimplifiedERC721ABI,
            provider
        );
        let tokenUri = await tokenContract.tokenURI(tokenID);
        return res.json({
            status : 1,
            data : tokenUri
        });
    } catch (error) {
        return res.json({
            status : 0,
            data : error.toString()
        })
    }
});

module.exports = router;