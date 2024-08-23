function encodeBase64(str: string) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}
function decodeBase64(encodedStr: string) {
  try {
    return atob(encodedStr);
  } catch (e) {
    console.error('Error decoding Base64 string:', e);
    return null;
  }
}

export { encodeBase64, decodeBase64 };
