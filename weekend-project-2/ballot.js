var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var ethers = require("ethers");
require("dotenv").config();
var providerRpcKey = process.env.REACT_APP_PROVIDER_RPC_KEY;
var walletAddress = process.env.REACT_APP_WALLET_ADDRESS;
var privateKey = process.env.REACT_APP_PRIVATE_KEY;
var ballotSmartContractAddress = "0x41874b62017e8bf2c533B73c11750FDBB78ac956";
var ballotSmartContractAbi = require("../weekend-project-2/ballotAbi");
var ballotSmartContractByteCode = require("../weekend-project-2/ballotByteCode");
var provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/" + providerRpcKey);
var wallet = new ethers.Wallet(privateKey, provider);
var signer = wallet.connect(provider);
var smartContract = new ethers.Contract(ballotSmartContractAddress, ballotSmartContractAbi, signer);
var proposals = ["Cofee", "Tea"];
var constructorArguments = [];
function convertStringArrayToBytes32() {
    proposals.forEach(function (proposal) {
        constructorArguments.push(ethers.utils.formatBytes32String(proposal));
    });
    return constructorArguments;
}
var deploySmartContract = function () { return __awaiter(_this, void 0, void 0, function () {
    var constructorArguments, price, _a, _b, options, factory, contract;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                constructorArguments = ["0x6e696b6f73000000000000000000000000000000000000000000000000000000"];
                _b = (_a = ethers.utils).formatUnits;
                return [4 /*yield*/, provider.getGasPrice()];
            case 1:
                price = _b.apply(_a, [_c.sent(), "gwei"]);
                options = { gasLimit: 100000, gasPrice: ethers.utils.parseUnits(price, "gwei"), constructorArguments: constructorArguments };
                factory = new ethers.ContractFactory(ballotSmartContractAbi, ballotSmartContractByteCode, wallet);
                return [4 /*yield*/, factory.deploy(constructorArguments)];
            case 2:
                contract = _c.sent();
                return [4 /*yield*/, contract.deployed()];
            case 3:
                _c.sent();
                console.log("Deployment successful! Contract Address: " + contract.address);
                return [2 /*return*/];
        }
    });
}); };
// deploySmartContract();
var readSmartContract = function () { return __awaiter(_this, void 0, void 0, function () {
    var chairPerson, voters, proposal0, proposal1, winningProposal, winnerName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, smartContract.chairperson()];
            case 1:
                chairPerson = _a.sent();
                return [4 /*yield*/, smartContract.voters("0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678")];
            case 2:
                voters = _a.sent();
                return [4 /*yield*/, smartContract.proposals(0)];
            case 3:
                proposal0 = _a.sent();
                return [4 /*yield*/, smartContract.proposals(1)];
            case 4:
                proposal1 = _a.sent();
                return [4 /*yield*/, smartContract.winningProposal()];
            case 5:
                winningProposal = _a.sent();
                return [4 /*yield*/, smartContract.winnerName()];
            case 6:
                winnerName = _a.sent();
                console.log("Chain person's address " + chairPerson);
                console.log("Voters addresses " + voters);
                console.log("Proposal 1 " + proposal0);
                console.log("Proposal 2 " + proposal1);
                console.log("Winning proposal " + winningProposal);
                console.log("Winner name " + winnerName);
                return [2 /*return*/];
        }
    });
}); };
readSmartContract();
var giveRightToVote = function () { return __awaiter(_this, void 0, void 0, function () {
    var transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, smartContract.giveRightToVote("0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB")];
            case 1:
                transaction = _a.sent();
                return [4 /*yield*/, transaction.wait()];
            case 2:
                _a.sent();
                console.log(transaction);
                console.log("Transaction Hash: " + transaction.hash);
                return [2 /*return*/];
        }
    });
}); };
// giveRightToVote();
// First you need to give voting rights to each address that wants to delegate
var delegate = function () { return __awaiter(_this, void 0, void 0, function () {
    var transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, smartContract.delegate("address to pass your voting rights")];
            case 1:
                transaction = _a.sent();
                return [4 /*yield*/, transaction.wait()];
            case 2:
                _a.sent();
                console.log("Transaction Hash: " + transaction.hash);
                console.log(transaction);
                return [2 /*return*/];
        }
    });
}); };
// delegate();
var vote = function () { return __awaiter(_this, void 0, void 0, function () {
    var transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, smartContract.vote(0)];
            case 1:
                transaction = _a.sent();
                return [4 /*yield*/, transaction.wait()];
            case 2:
                _a.sent();
                console.log("Transaction Hash: " + transaction.hash);
                console.log(transaction);
                return [2 /*return*/];
        }
    });
}); };
// vote();
