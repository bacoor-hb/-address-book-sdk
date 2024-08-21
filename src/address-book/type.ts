export type IAddressBookOptions = {
  rpcUrl?: string | string[];
  contractAddress?: string;
  isTestnet?: boolean;
};

export type UserInfo = {
  address: string;
  avatar?: string;
  nickname?: string;
  email?: string;
  freeText?: string;
};
