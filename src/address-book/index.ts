import { decodeData, encodeFunctionData } from '../common/utils';
import { IAddressBookOptions, AddressBookResolve } from './type';

const RPC_OP = 'https://optimism.llamarpc.com';
const RPC_OP_SEPOLIA = 'https://optimism-sepolia.blockpi.network/v1/rpc/public';
const CONTRACT_ADDRESS = '0x32b4aED2b805dAb72c4bAD5807fE8bBae2934fcd';

export default class AddressBook {
  private rpcs: string[] = [RPC_OP];
  private isTestnet = false;
  private contractAddress: string = CONTRACT_ADDRESS;

  constructor(options?: IAddressBookOptions) {
    if (options?.contractAddress) {
      this.contractAddress = options?.contractAddress;
    }
    if (options?.isTestnet) {
      this.isTestnet = options?.isTestnet;
    }
    if (options?.rpcUrl) {
      this.rpcs =
        typeof options?.rpcUrl === 'string'
          ? [options?.rpcUrl]
          : options?.rpcUrl;
    } else {
      if (this.isTestnet) {
        this.rpcs = [RPC_OP_SEPOLIA];
      }
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
      return json?.result as `0x${string}`;
    } catch (error) {
      console.log(`Call error ${this.rpcs[currentRpc]}`, error);
      if (currentRpc + 1 < this.rpcs.length) {
        return this.call(address, selector, params, currentRpc + 1);
      }
      return null;
    }
  }

  public async resolveByNickname(
    nickname: string
  ): Promise<AddressBookResolve | null> {
    const result = await this.call(this.contractAddress, '0x1420eb16', [
      nickname,
    ]);

    if (result) {
      const metadata = decodeData(result);
      if (metadata && metadata?.tokenId) {
        return {
          info: {
            address: metadata.address,
            email: metadata.email,
            avatar: metadata.image,
            nickname: metadata.nickname,
            freeText: metadata.freeText,
          },
          resolvedAt: new Date(),
          resolvedBy: 'nickname',
        };
      }
    }

    return null;
  }

  public async resolveByEmail(
    email: string
  ): Promise<AddressBookResolve | null> {
    const result = await this.call(this.contractAddress, '0x9eab70f9', [email]);

    if (result) {
      const metadata = decodeData(result);
      if (metadata && metadata?.tokenId) {
        return {
          info: {
            address: metadata.address,
            email: metadata.email,
            avatar: metadata.image,
            nickname: metadata.nickname,
            freeText: metadata.freeText,
          },
          resolvedAt: new Date(),
          resolvedBy: 'email',
        };
      }
    }

    return null;
  }

  public async resolveByAddress(
    address: `0x${string}`
  ): Promise<AddressBookResolve | null> {
    const result = await this.call(this.contractAddress, '0x0bdc37cd', [
      address,
    ]);

    if (result && result !== '0x') {
      const metadata = decodeData(result);
      if (metadata && metadata?.tokenId) {
        return {
          info: {
            address: metadata.address,
            email: metadata.email,
            avatar: metadata.image,
            nickname: metadata.nickname,
            freeText: metadata.freeText,
          },
          resolvedAt: new Date(),
          resolvedBy: 'address',
        };
      }
    }

    return null;
  }
}
