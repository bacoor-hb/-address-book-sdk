import { decodeData, encodeFunctionData } from '../common/utils';
import {
  IAddressBookOptions,
  AddressBookResolve,
  CacheOptions,
  ResolveOptions,
} from './type';

const RPC_OP = [
  'https://optimism.llamarpc.com',
  'https://1rpc.io/op',
  'https://optimism.drpc.org',
];
const RPC_OP_SEPOLIA = [
  'https://optimism-sepolia.blockpi.network/v1/rpc/public',
  'https://endpoints.omniatech.io/v1/op/sepolia/public',
  'https://sepolia.optimism.io',
];

const CONTRACT_ADDRESS = {
  TESTNET: '0x32b4aED2b805dAb72c4bAD5807fE8bBae2934fcd',
  MAINNET: '0x32b4aED2b805dAb72c4bAD5807fE8bBae2934fcd',
};

const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minute

export default class AddressBook {
  private rpcs: string[] = RPC_OP;
  private contractAddress: string = CONTRACT_ADDRESS.MAINNET;
  private cacheOptions: CacheOptions = {
    cacheTime: DEFAULT_CACHE_TIME, // 5 minute
    cacheCheckExists: false,
    cacheResolve: false,
  };
  private nicknameCache: Map<string, AddressBookResolve> = new Map();
  private emailCache: Map<string, AddressBookResolve> = new Map();
  private addressCache: Map<string, AddressBookResolve> = new Map();

  constructor(options?: IAddressBookOptions) {
    if (options?.contractAddress) {
      this.contractAddress = options?.contractAddress;
    } else {
      if (options?.isTestnet) {
        this.contractAddress = CONTRACT_ADDRESS.TESTNET;
      }
    }
    if (options?.rpcUrl) {
      this.rpcs =
        typeof options?.rpcUrl === 'string'
          ? [options?.rpcUrl]
          : options?.rpcUrl;
    } else {
      if (options?.isTestnet) {
        this.rpcs = RPC_OP_SEPOLIA;
      }
    }

    if (options?.cache) {
      this.cacheOptions = {
        ...this.cacheOptions,
        ...options.cache,
      };
    }
  }

  private async call(
    address: string,
    selector: `0x${string}`,
    params: string[],
    currentRpc = 0
  ): Promise<`0x${string}` | null> {
    try {
      const data = encodeFunctionData(selector, params);
      const payload = {
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: address,
            data: data,
          },
          'latest',
        ],
        id: 1,
      };

      const response = await fetch(this.rpcs[currentRpc], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json: any = await response.json();
      if (json?.result && json?.result !== '0x') {
        return json?.result as `0x${string}`;
      }
      return null;
    } catch (error) {
      console.log(`Call error ${this.rpcs[currentRpc]}`, error);
      if (currentRpc + 1 < this.rpcs.length) {
        return this.call(address, selector, params, currentRpc + 1);
      }
      return null;
    }
  }

  public clearNicknameCache() {
    this.nicknameCache.clear();
  }

  public clearEmailCache() {
    this.emailCache.clear();
  }

  public clearAddressCache() {
    this.addressCache.clear();
  }

  public clearAllCache() {
    this.clearAddressCache();
    this.clearEmailCache();
    this.clearNicknameCache();
  }

  public clearNicknameCacheByKey(key: string) {
    this.nicknameCache.delete(key.toLowerCase());
  }

  public clearEmailCacheByKey(key: string) {
    this.emailCache.delete(key.toLowerCase());
  }

  public clearAddressCacheByKey(key: string) {
    this.addressCache.delete(key.toLowerCase());
  }

  public setCacheTime(time: number) {
    this.cacheOptions.cacheTime = time;
  }

  public setCacheCheckExists(check: boolean) {
    this.cacheOptions.cacheCheckExists = check;
  }

  public setCacheResolve(resolve: boolean) {
    this.cacheOptions.cacheResolve = resolve;
  }

  public setRpcUrl(rpcUrl: string | string[]) {
    this.rpcs = typeof rpcUrl === 'string' ? [rpcUrl] : rpcUrl;
  }

  public setContractAddress(address: string) {
    this.contractAddress = address;
  }

  public async resolveByNickname(
    nickname: string,
    options?: ResolveOptions
  ): Promise<AddressBookResolve> {
    const key = nickname.toLowerCase();
    let returnData: AddressBookResolve = {
      info: null,
      resolvedAt: Date.now(),
      resolvedBy: 'nickname',
    };

    if (this.cacheOptions.cacheResolve && !options?.forceRequest) {
      const cachedData = this.nicknameCache.get(key);
      if (
        cachedData &&
        Date.now() - cachedData.resolvedAt <
          (this.cacheOptions.cacheTime || DEFAULT_CACHE_TIME)
      ) {
        console.log(`Resolve nickname from cache for ${key}`);
        return cachedData;
      }
      this.nicknameCache.delete(key);
    }

    const result = await this.call(this.contractAddress, '0x1420eb16', [key]);

    if (result) {
      const metadata = decodeData(result);
      if (metadata && metadata?.tokenId) {
        returnData = {
          info: {
            address: metadata.address,
            email: metadata.email,
            avatar: metadata.image,
            nickname: metadata.nickname,
            freeText: metadata.freeText,
          },
          resolvedAt: Date.now(),
          resolvedBy: 'nickname',
        };
        this.nicknameCache.set(key, returnData);
        return returnData;
      }
    }
    this.nicknameCache.set(key, returnData);
    return returnData;
  }

  public async resolveByEmail(
    email: string,
    options?: ResolveOptions
  ): Promise<AddressBookResolve> {
    const key = email.toLowerCase();
    let returnData: AddressBookResolve = {
      info: null,
      resolvedAt: Date.now(),
      resolvedBy: 'email',
    };

    if (this.cacheOptions.cacheResolve && !options?.forceRequest) {
      const cachedData = this.emailCache.get(key);
      if (
        cachedData &&
        Date.now() - cachedData.resolvedAt <
          (this.cacheOptions.cacheTime || DEFAULT_CACHE_TIME)
      ) {
        console.log(`Resolve email from cache for ${key}`);
        return cachedData;
      }
      this.emailCache.delete(key);
    }

    const result = await this.call(this.contractAddress, '0x9eab70f9', [key]);

    if (result) {
      const metadata = decodeData(result);
      if (metadata && metadata?.tokenId) {
        returnData = {
          info: {
            address: metadata.address,
            email: metadata.email,
            avatar: metadata.image,
            nickname: metadata.nickname,
            freeText: metadata.freeText,
          },
          resolvedAt: Date.now(),
          resolvedBy: 'address',
        };
        this.emailCache.set(key, returnData);
        return returnData;
      }
    }

    this.emailCache.set(key, returnData);
    return returnData;
  }

  public async resolveByAddress(
    address: `0x${string}`,
    options?: ResolveOptions
  ): Promise<AddressBookResolve> {
    const key = address.toLowerCase();
    let returnData: AddressBookResolve = {
      info: null,
      resolvedAt: Date.now(),
      resolvedBy: 'address',
    };

    if (this.cacheOptions.cacheResolve && !options?.forceRequest) {
      const cachedData = this.addressCache.get(key);
      if (
        cachedData &&
        Date.now() - cachedData.resolvedAt <
          (this.cacheOptions.cacheTime || DEFAULT_CACHE_TIME)
      ) {
        console.log(`Resolve address from cache for ${key}`);
        return cachedData;
      }
      this.addressCache.delete(key);
    }

    const result = await this.call(this.contractAddress, '0x0bdc37cd', [
      address,
    ]);

    if (result && result !== '0x') {
      const metadata = decodeData(result);
      if (metadata && metadata?.tokenId) {
        returnData = {
          info: {
            address: metadata.address,
            email: metadata.email,
            avatar: metadata.image,
            nickname: metadata.nickname,
            freeText: metadata.freeText,
          },
          resolvedAt: Date.now(),
          resolvedBy: 'address',
        };
        this.addressCache.set(key, returnData);
        return returnData;
      }
    }

    this.addressCache.set(key, returnData);
    return returnData;
  }

  public async isNicknameExists(
    nickname: string,
    options?: ResolveOptions
  ): Promise<boolean> {
    const key = nickname.toLowerCase();
    if (this.cacheOptions.cacheCheckExists && !options?.forceRequest) {
      const cachedData = this.nicknameCache.get(key);
      if (
        cachedData &&
        Date.now() - cachedData.resolvedAt <
          (this.cacheOptions.cacheTime || DEFAULT_CACHE_TIME)
      ) {
        console.log(`Nick exist from cache for ${key}`);
        return !!cachedData.info;
      } else {
        this.nicknameCache.delete(key);
      }
    }
    const infoData = await this.resolveByNickname(nickname, options);
    return !!infoData?.info;
  }

  public async isEmailExists(email: string, options?: ResolveOptions): Promise<boolean> {
    const key = email.toLowerCase();
    if (this.cacheOptions.cacheCheckExists && !options?.forceRequest) {
      const cachedData = this.emailCache.get(key);
      if (
        cachedData &&
        Date.now() - cachedData.resolvedAt <
          (this.cacheOptions.cacheTime || DEFAULT_CACHE_TIME)
      ) {
        console.log(`Email exist from cache for ${key}`);
        return !!cachedData.info;
      } else {
        this.emailCache.delete(key);
      }
    }
    const infoData = await this.resolveByEmail(email, options);
    return !!infoData?.info;
  }

  public async isAddressExists(address: `0x${string}`, options?: ResolveOptions): Promise<boolean> {
    const key = address.toLowerCase();
    if (this.cacheOptions.cacheCheckExists && !options?.forceRequest) {
      const cachedData = this.addressCache.get(key);
      if (
        cachedData &&
        Date.now() - cachedData.resolvedAt <
          (this.cacheOptions.cacheTime || DEFAULT_CACHE_TIME)
      ) {
        console.log(`Address exist from cache for ${key}`);
        return !!cachedData.info;
      } else {
        this.addressCache.delete(key);
      }
    }
    const infoData = await this.resolveByAddress(address, options);
    return !!infoData?.info;
  }
}
