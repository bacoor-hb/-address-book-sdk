export const welcome = (): string => 'Welcome to Address Book!';

import AddressBook from './address-book';
import { UserInfo } from './address-book/type';

export const resolveByNickname = async (
  nickname: string
): Promise<UserInfo | null> => {
  const client = new AddressBook();
  return await client.resolveByNickname(nickname);
};

export const resolveByAddress = async (
  address: `0x${string}`
): Promise<UserInfo | null> => {
  const client = new AddressBook();
  return await client.resolveByAddress(address);
};

export const resolveByEmail = async (
  email: string
): Promise<UserInfo | null> => {
  const client = new AddressBook();
  return await client.resolveByEmail(email);
};

export default AddressBook;
