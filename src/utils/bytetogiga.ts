export default function bytetogiga(byte: number): number {
  const giga = byte / 1024 / 1024 / 1024;
  return parseFloat(giga.toFixed(2));
}
