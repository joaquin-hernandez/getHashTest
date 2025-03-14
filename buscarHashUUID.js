"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const readline = __importStar(require("readline"));
// El abi es un descriptor de la interface de los smart contracts
// describe los metodos, sus parametros y respuesta esperada.
// se crea al compilar el smart contract.
const abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "string",
                "name": "transactionNumber",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "HashStored",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_transactionNumber",
                "type": "string"
            }
        ],
        "name": "getHash",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "hash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "string",
                        "name": "transactionNumber",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct HashStorage.HashInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "senderHashes",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "transactionNumber",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_hash",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "_transactionNumber",
                "type": "string"
            }
        ],
        "name": "setHash",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
// Nodo blockchain de desarrollo en AWS
const url = "http://nodo-blockchain.serverpit.com:8545/";
// Es la address en la cual fue deployado en smart contract
const smartContractAddress = '0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da';
// Provider a usar de la libreria Ethers para enviar transacciones al nodo
const provider = new ethers_1.ethers.JsonRpcProvider(url);
// un poco de contexto.
console.log("Nodo utilizado para acceder a blockchain: " + url);
console.log("Llamando al contrato que se encuentra en: " + smartContractAddress);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var UUIDInput;
rl.question("Por favor ingresar el UUID de la solicitud: ", async (dataInput) => {
    UUIDInput = dataInput;
    try {
        // Si solo voy a leer de un smart contract podemos utilizar este otro metodo
        // para crear el objeto contrato en el que no usamos la PK ya que no 
        // tiene costo leer de un contrato.
        const contratoLectura = new ethers_1.ethers.Contract(smartContractAddress, abi, provider);
        // Llamamos al metodo getHash pasando como parametro el UUID que usamos como indice.
        console.log("Llamado a getHash.....");
        const hashRecuperado = await contratoLectura.getHash(UUIDInput);
        console.log("Respuesta: " + hashRecuperado);
    }
    catch (e) {
        console.log("Se ha producido un error" + e);
    }
    rl.close();
});
