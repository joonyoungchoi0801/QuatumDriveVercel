import * as base64js from 'base64-js';

export function utf8_to_b64(str: string) {
  const utf8Bytes = new TextEncoder().encode(str);

  return base64js.fromByteArray(utf8Bytes);
}

export function b64_to_utf8(str: string) {
  try {
    const byteArray = base64js.toByteArray(str);
    return new TextDecoder('utf-8').decode(byteArray);
  } catch (error) {
    return '';
  }
}
