export type IAddressBookOptions = {
  rpcUrl?: string;
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
