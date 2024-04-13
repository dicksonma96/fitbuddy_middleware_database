export default function CheckEmptyValues(requestBody) {
  for (const [key, value] of Object.entries(requestBody)) {
    if (value == "") {
      return `Error: ${key} cannot be empty.`;
    }
  }
  return "";
}
