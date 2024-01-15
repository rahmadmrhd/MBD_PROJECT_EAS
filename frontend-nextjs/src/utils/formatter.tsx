"use client";

import React from "react";
import { NumericFormat, PatternFormat } from "react-number-format";

type onChangeParamsType = {
  target: {
    name: string;
    value: string;
  };
};

type Formatter = {
  name: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (e: onChangeParamsType) => {};
};

export const CurrencyFormatAdapter = React.forwardRef(
  function CurrencyFormatAdapter(props: Formatter, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator='.'
        decimalSeparator=','
        decimalScale={2}
        fixedDecimalScale={true}
        valueIsNumericString
        prefix='Rp. '
      />
    );
  }
);

export const PercentFormatAdapter = React.forwardRef(
  function NumericFormatAdapter(props: Formatter, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator='.'
        decimalSeparator=','
        decimalScale={2}
        fixedDecimalScale={true}
        valueIsNumericString
        suffix='%'
      />
    );
  }
);
export const PhoneFormatAdapter = React.forwardRef(
  function NumericFormatAdapter(props: Formatter, ref) {
    const { onChange, ...other } = props;

    return (
      <PatternFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        format='(+62) ###-####-#######'
        // displayType={"text"}
      />
    );
  }
);
export function formatPhoneNumber(
  phoneNumberString?: string,
  code: string = "62"
) {
  if (!phoneNumberString) return undefined;
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var regex = new RegExp(`^(${code}|)?(\\d{0,3})(\\d{0,4})(\\d*)$`);
  var match = cleaned.match(regex);
  if (match) {
    var intlCode = match[1] ? `(+${match[1]}) ` : `(+${code}) `;
    return [intlCode, match[2], "-", match[3], "-", match[4]].join("");
  }
  return undefined;
}
