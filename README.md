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

const info = await resolveByNickname('0xVinny')
// { info: { address: '0xeeC5915A21DA64a58DE1e9a3D7dd7b8Bff775cF0' avatar: 'base64...', nickname: '0xVinny', freeText: '...' } , resolvedAt: '...', resolvedBy: 'nickname' } 
```

```ts
import { resolveByAddress } from '@address-book/sdk';

const info = await resolveByAddress('0xeeC5915A21DA64a58DE1e9a3D7dd7b8Bff775cF0')
// { info: { address: '0xeeC5915A21DA64a58DE1e9a3D7dd7b8Bff775cF0', avatar: 'base64...', nickname: '0xVinny', freeText: '...' }, resolvedAt: '...', resolvedBy: 'address' } 
```


```ts
import {  resolveByEmail } from '@address-book/sdk';

const info = await resolveByEmail('vinny@gmail.com')
// { info: { address: '0xeeC5915A21DA64a58DE1e9a3D7dd7b8Bff775cF0' avatar: 'base64...', email: 'vinny@gmail.com', freeText: '...' }, resolvedAt: '...', resolvedBy: 'email' } 
```

## Advance (Recommend)

```ts
import AddressBook from '@address-book/sdk';

const client = new AddressBook({
  rpcUrl: 'Your RPC',
  contractAddress: 'Your Contract Address',
  isTestnet: true  
})


const info = client.resolveByNickname('0xVinny')
// { info: { address: '0xeeC5915A21DA64a58DE1e9a3D7dd7b8Bff775cF0' avatar: 'base64...', nickname: '0xVinny', freeText: '...' } , resolvedAt: '...', resolvedBy: 'nickname' } 
```

## API

### AddressBook(options?: IAddressBookOptions)

#### IAddressBookOptions

Type: `object`

##### rpcUrl

Type: `string | string[]` 
Default: `https://optimism.llamarpc.com`

##### contractAddress

Type: `string`
Default: `0x32b4aED2b805dAb72c4bAD5807fE8bBae2934fcd`

##### isTestnet

Type: `bool`

##### showLog

Type: `bool`

##### cache?: CacheOptions

Type: `object`

###### cacheTime
Type: `number`

###### cacheCheckExists
Type: `bool`

###### cacheResolve
Type: `bool`



[downloads-img]:https://img.shields.io/npm/dt/@address-book/sdk
[downloads-url]:https://www.npmtrends.com/@address-book/sdk
[npm-img]:https://img.shields.io/npm/v/@address-book/sdk
[npm-url]:https://www.npmjs.com/package/@address-book/sdk