export default function generateString(
  length: number,
  charactersAllow = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
) {
  let result = " ";
  const charactersLength = charactersAllow.length;
  for (let i = 0; i < length; i++) {
    result += charactersAllow.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  return result;
}
