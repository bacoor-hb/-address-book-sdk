import { padToBytes32 } from '../common/utils';
import { IAddressBookOptions, UserInfo } from './type';

const RPC_OP = 'https://optimism.llamarpc.com';
const RPC_OP_SEPOLIA = 'https://optimism-sepolia.blockpi.network/v1/rpc/public';
const CONTRACT_ADDRESS = '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58';

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
    functionSelector: `0x${string}`,
    params: string[]
  ): Promise<string | null> {
    const data =
      functionSelector +
      params.map((param: string) => padToBytes32(param)).join('');

    const payload = {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [
        {
          to: this.contractAddress,
          data: data,
        },
        'latest',
      ],
      id: 1,
    };

    const response = await fetch(this.rpcs[0], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json: any = await response.json();
    return json.result as string;
  }

  public async resolveByNickname(nickname: string): Promise<UserInfo | null> {
    console.log(nickname);
    return null;
  }

  public async resolveByEmail(email: string): Promise<UserInfo | null> {
    console.log(email);
    return null;
  }

  public async resolveByAddress(
    address: `0x${string}`
  ): Promise<UserInfo | null> {
    console.log(address);
    return null;
  }
}
