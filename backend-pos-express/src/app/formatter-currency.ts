const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

const currencyFormat = (num: number) => {
  return formatter.format(num).replace(/\u00A0/, " ");
};
export default currencyFormat;
