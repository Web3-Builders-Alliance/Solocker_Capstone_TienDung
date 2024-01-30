export type SoLocker =
  {
    "version": "0.1.0",
    "name": "solocker",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "lockState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "lock",
        "accounts": [
          {
            "name": "lockState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": []
      },
      {
        "name": "unlock",
        "accounts": [
          {
            "name": "lockState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "lockState",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "isOpen",
              "type": "bool"
            },
            {
              "name": "authority",
              "type": "publicKey"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "Unauthorized",
        "msg": "You are not the one who locked this locker"
      }
    ]
  }

export const IDL: SoLocker =

{
  "version": "0.1.0",
  "name": "solocker",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "lockState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "lock",
      "accounts": [
        {
          "name": "lockState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "unlock",
      "accounts": [
        {
          "name": "lockState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "lockState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isOpen",
            "type": "bool"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not the one who locked this locker"
    }
  ]
}