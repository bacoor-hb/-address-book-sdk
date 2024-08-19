# Address Book SDK

> The sdk package provides a simple and efficient way to resolve email addresses into their corresponding Ethereum addresses (0x) using the Address Book protocol.

## Getting started

[![npm package][npm-img]][npm-url]
[![Downloads][downloads-img]][downloads-url]


## Install

```bash
npm install @address-book/sdk
```

## Usage

```ts
import { resolveByNickname, resolveByAddress, resolveByEmail } from '@address-book/sdk';

const info = resolveByNickname('0xVinny')
// { address: '0xeeC5915A21DA64a58DE1e9a3D7dd7b8Bff775cF0' avatar: 'base64...', nickname: '0xVinny', freeText: '...' } 
```

```ts
import { resolveByAddress } from '@address-book/sdk';

const info = resolveByAddress('0xeeC5915A21DA64a58DE1e9a3D7dd7b8Bff775cF0')
// { address: '0xeeC5915A21DA64a58DE1e9a3D7dd7b8Bff775cF0', avatar: 'base64...', nickname: '0xVinny', freeText: '...' } 
```


```ts
import {  resolveByEmail } from '@address-book/sdk';

const info = resolveByEmail('vinny@gmail.com')
// { address: '0xeeC5915A21DA64a58DE1e9a3D7dd7b8Bff775cF0' avatar: 'base64...', email: 'vinny@gmail.com', freeText: '...' } 
```

## Advance

```ts
import AddressBook from '@address-book/sdk';

const client = new AddressBook({
  rpcUrl: 'Your RPC',
  contractAddress: 'Your Contract Address',
  // isTestnet: true  
})


const info = client.resolveByNickname('0xVinny')
// { address: '0xeeC5915A21DA64a58DE1e9a3D7dd7b8Bff775cF0' avatar: 'base64...', nickname: '0xVinny', freeText: '...' } 
```

## API

### AddressBook(options?: IAddressBookOptions)

#### IAddressBookOptions

Type: `object`

##### rpcUrl

Type: `string`
Default: `https://optimism.llamarpc.com`

##### contractAddress

Type: `string`
Default: `0x94b008aA00579c1307B0EF2c499aD98a8ce58e58`

##### isTestnet

Type: `bool`

[downloads-img]:https://img.shields.io/npm/dt/@address-book/sdk
[downloads-url]:https://www.npmtrends.com/@address-book/sdk
[npm-img]:https://img.shields.io/npm/v/@address-book/sdk
[npm-url]:https://www.npmjs.com/package/@address-book/sdk