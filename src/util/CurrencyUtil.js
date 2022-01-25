export function formatCurrency(currencyCode, amount) {
  if (amount === undefined || amount === null || amount === 0) {
    return "";
  }
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  });
  return formatter.format(amount);
}

export function getCurrencySymbol(currencyCode) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  });
  return formatter.formatToParts(0)[0].value;
}

export function getCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const currencyParts = formatter.formatToParts(amount);
  let result =
    currencyParts[1].value + currencyParts[2].value + currencyParts[3].value;
  console.log(result);
  return result;
}
