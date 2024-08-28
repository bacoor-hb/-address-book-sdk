export type CacheOptions = {
  cacheTime?: number;
  cacheCheckExists?: boolean;
  cacheResolve?: boolean;
}

export type IAddressBookOptions = {
  rpcUrl?: string | string[];
  contractAddress?: string;
  isTestnet?: boolean;
  cache?: CacheOptions
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
  info: AddressBookInfo | null;
  resolvedAt: number;
  resolvedBy: 'nickname' | 'address' | 'email';
};
export type ResolveOptions = {
  forceRequest?: boolean;
}