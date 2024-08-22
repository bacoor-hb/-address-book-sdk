export type IAddressBookOptions = {
  rpcUrl?: string | string[];
  contractAddress?: string;
  isTestnet?: boolean;
};

export type AddressBookInfoWithNickname = {
  address: `0x${string}`;
  nickname: string;
  avatar?: string;
  freeText?: string;
};

export type AddressBookInfoWithEmail = {
  address: `0x${string}`;
  email: string;
  avatar?: string;
  freeText?: string;
};

export type AddressBookInfo =
  | AddressBookInfoWithNickname
  | AddressBookInfoWithEmail;

export type AddressBookResolve = {
  info: AddressBookInfo;
  resolvedAt: Date;
  resolvedBy: 'nickname' | 'address' | 'email';
};
