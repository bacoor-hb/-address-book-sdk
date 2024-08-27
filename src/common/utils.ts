export function encodeUint256(value: number | bigint): string {
  let hex = BigInt(value).toString(16);
  hex = hex.padStart(64, '0');
  return hex;
}

export function encodeAddress(address: string): string {
  if (address.startsWith('0x')) {
    address = address.slice(2);
  }
  if (address.length !== 40) {
    throw new Error('Invalid Ethereum address');
  }
  return address.padStart(64, '0');
}

export function encodeString(value: string, dynamicData: string[]): string {
  const utf8Bytes = new TextEncoder().encode(value);
  const length = utf8Bytes.length;

  // Convert the string to hex
  let hex = Array.from(utf8Bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  // Pad the string data to a multiple of 32 bytes
  hex = hex.padEnd(Math.ceil(length / 32) * 64, '0');

  // Record the dynamic data (length + data)
  const lengthEncoded = encodeUint256(length);
  dynamicData.push(lengthEncoded + hex);

  // Return the offset for this string
  const offset = 32 * dynamicData.length; // calculate the offset based on dynamic data size
  return encodeUint256(offset);
}

export const encodeFunctionData = (
  selector: `0x${string}`,
  params: any[]
): `0x${string}` => {
  const dynamicData: string[] = [];
  const data =
    selector +
    params
      .map((param) => {
        if (typeof param === 'number' || typeof param === 'bigint') {
          return encodeUint256(param);
        } else if (typeof param === 'string' && param.length === 42) {
          return encodeAddress(param);
        } else if (typeof param === 'string') {
          return encodeString(param, dynamicData);
        }
      })
      .join('') +
    dynamicData.join('');
  return data as `0x${string}`;
};
function decodeUint256(data: string, offset: number): bigint {
  return BigInt(`0x${data.slice(offset, offset + 64)}`);
}

function decodeAddress(data: string, offset: number): `0x${string}` {
  return `0x${data.slice(offset + 24, offset + 64)}`;
}

function decodeString(data: string, offset: number): string {
  const stringOffset = parseInt(data.slice(offset, offset + 64), 16) * 2;
  const length = parseInt(data.slice(stringOffset, stringOffset + 64), 16);
  const stringData = data.slice(
    stringOffset + 64,
    stringOffset + 64 + length * 2
  );
  return Buffer.from(stringData, 'hex').toString('utf8');
}

export function decodeData(data: string) {
  data = data.startsWith('0x') ? data.slice(2) : data;
  const tokenId = decodeUint256(data, 0);
  const nickname = decodeString(data, 64);
  const email = decodeString(data, 128);
  const address = decodeAddress(data, 192);
  const freeText = decodeString(data, 256);
  const image = decodeString(data, 320);

  return { tokenId, nickname, address, email, freeText, image };
}
