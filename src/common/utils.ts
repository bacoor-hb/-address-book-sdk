export function padToBytes32(value: string) {
  value = value.replace(/^0x/, '');
  while (value.length < 64) {
    value = '0' + value;
  }
  return value;
}
