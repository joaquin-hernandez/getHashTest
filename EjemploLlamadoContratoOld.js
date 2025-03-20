"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const uuid_1 = require("uuid");
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
// Clave privada con la cual vamos a firmar las transacciones
const account = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
// Es la address en la cual fue deployado en smart contract
const smartContractAddress = '0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da';
// Provider a usar de la libreria Ethers para enviar transacciones al nodo
const provider = new ethers_1.ethers.JsonRpcProvider(url);
// En caso de necesitar enviar una transaccion firmada, debemos hacerlo con
// el objeto Wallet de Ethers.
const wallet = new ethers_1.ethers.Wallet(account, provider);
// Creamos el objeto contract para pode llamar un metodo despues.
console.log("Buscando el contrato");
const contract = new ethers_1.ethers.Contract(smartContractAddress, abi, wallet);
console.log("Ok....");
// hash para probar el smart contract.
const hashInput = "0xd191b628047221ab40a7117e8f31bed3f84d714f00aae8c5ff6e5769c0077264";
// El contrato espera un string para utilizar como indice de los hashes guardados.
const UUIDInput = (0, uuid_1.v4)();
console.log("Hash: " + hashInput);
console.log("UUID: " + UUIDInput);
console.log("Llamando al contrato....");
async function callTest() {
    try {
        // Aqui se envia una transaccion firmada al nodo indicando que metodo ejecutar.
        // El nodo crea una transaccion que se mete en el mempool y en algun momento
        // se ejecutara y validara por todos los nodos de la red.
        //const tx =  contract.setHash(hashInput, UUIDInput);
        //console.log ("Priema llamada al contrato");
        const tx2 = await contract.setHash(hashInput, UUIDInput);
        console.log("tx Hash: " + tx2.hash);
        // Si queremos quedarnos esperando a que la transaccion enviada sea procesada
        // podemos utilizar el metodo wait, si no importa.... no lo usamos.
        const receipt = await tx2.wait();
        console.log('Transaccion minada en el bloque: ', receipt.blockNumber);
        // Si solo voy a leer de un smart contract podemos utilizar este otro metodo
        // para crear el objeto contrato en el que no usamos la PK ya que no 
        // tiene costo leer de un contrato.
        const contratoLectura = new ethers_1.ethers.Contract(smartContractAddress, abi, provider);
        // Llamamos al metodo getHash pasando como parametro el UUID que usamos como indice.
        console.log("Llamado a getHash");
        const hashRecuperado = await contract.getHash(UUIDInput);
        console.log("Hash recuperado: " + hashRecuperado);
    }
    catch (error) {
        console.error("Error: " + error);
    }
}
callTest();
// FIN.
