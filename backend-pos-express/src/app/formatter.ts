export const currencyFormat = (num: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  })
    .format(num)
    .replace(/\u00A0/, " ");
};

export const percentFormat = (num: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

export const dateTimeFormater = (date?: Date) => {
  if (!date) {
    return "";
  }
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
