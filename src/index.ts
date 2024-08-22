export const welcome = (): string => 'Welcome to Address Book!';

import AddressBook from './address-book';
import { IAddressBookOptions, AddressBookResolve } from './address-book/type';

export const resolveByNickname = async (
  nickname: string,
  options?: IAddressBookOptions
): Promise<AddressBookResolve | null> => {
  const client = new AddressBook(options);
  return await client.resolveByNickname(nickname);
};

export const resolveByAddress = async (
  address: `0x${string}`,
  options?: IAddressBookOptions
): Promise<AddressBookResolve | null> => {
  const client = new AddressBook(options);
  return await client.resolveByAddress(address);
};

export const resolveByEmail = async (
  email: string,
  options?: IAddressBookOptions
): Promise<AddressBookResolve | null> => {
  const client = new AddressBook(options);
  return await client.resolveByEmail(email);
};

export default AddressBook;
