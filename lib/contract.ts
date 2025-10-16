export  default  {
    
    contractAddress: "0xEc632126Ea270D792b71379f223fbEE1C496f6DE",
    abi : [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "name": "AllScoresReset",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "username",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "fid",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "pfp",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "score",
              "type": "uint256"
            }
          ],
          "name": "NewUserAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "username",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "fid",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "pfp",
              "type": "string"
            }
          ],
          "name": "ProfileUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "newScore",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "oldScore",
              "type": "uint256"
            }
          ],
          "name": "ScoreUpdated",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_score",
              "type": "uint256"
            }
          ],
          "name": "addScore",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getAllScoresDescending",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "fid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "pfp",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "score",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Flappybirdweekly.UserScoreData[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getMyProfile",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "fid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "pfp",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "score",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Flappybirdweekly.UserScoreData",
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
              "internalType": "address",
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "getScore",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_limit",
              "type": "uint256"
            }
          ],
          "name": "getTopScores",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "fid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "pfp",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "score",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Flappybirdweekly.UserScoreData[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getTotalUsers",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_fid",
              "type": "uint256"
            }
          ],
          "name": "getUserByFid",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "fid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "pfp",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "score",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Flappybirdweekly.UserScoreData",
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
              "internalType": "address",
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "getUserProfile",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "fid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "pfp",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "score",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Flappybirdweekly.UserScoreData",
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
              "internalType": "address",
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "getUserRank",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "hasProfile",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "resetAllScores",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_score",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_username",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_fid",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_pfp",
              "type": "string"
            }
          ],
          "name": "setScore",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_username",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_fid",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_pfp",
              "type": "string"
            }
          ],
          "name": "updateProfile",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
        
    

}