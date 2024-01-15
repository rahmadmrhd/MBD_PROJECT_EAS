"use client";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Icon } from "@iconify/react";

type ValidationInput = {
  autoCheck: boolean;
  pattern?: RegExp;
  msgError?: string;
};

// eslint-disable-next-line no-unused-vars
export type Validator = (value: string) => boolean;

export interface PropertiesInput
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
  validation?: ValidationInput | boolean | null;
  validator?: Validator;
  autoFocus?: boolean;
}
// const defaultPropertiesInput: PropertiesInput = {
//   some_other_stat: 8,
// };

export interface InputRef extends HTMLInputElement {
  // setValid: (_value: boolean, _msg?: string) => void;
  // getMessage: () => string | null;
}

const Input = React.forwardRef<InputRef, PropertiesInput>(function Input(
  { validation, ...props }: PropertiesInput,
  ref
) {
  const [isHover, setIsHover] = useState(props.autoFocus);
  const [isShow, setIsShow] = useState(false);
  const [isFocused, setIsFocused] = useState(props.autoFocus);
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
  // const [messageError, setMessageError] = useState<string | undefined>(
  //   undefined
  // );
  const [fisrtLoad, setFirstLoad] = useState(true);
  const msgRef = useRef() as React.MutableRefObject<HTMLLabelElement>;
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useImperativeHandle(ref, () => ({
    ...inputRef.current,
    // setValid(value: boolean, msg?: string) {
    //   setIsValid(value);
    //   setMessageError(msg);
    // },
    // getMessage() {
    //   return msgRef.current?.textContent;
    // },
  }));

  useEffect(() => {
    if (isFocused) return;
    setIsHover(Boolean(inputRef.current?.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFocused) return;
    setIsHover(Boolean(inputRef.current?.value));
  }, [isFocused, props.value]);

  const setFocused = (value: boolean) => {
    if (!value) setIsHover(Boolean(inputRef.current?.value));
    else setIsHover(true);
    setIsFocused(value);
  };

  useEffect(() => {
    if (props.value) {
      setFirstLoad(false);
    }
    if (!validation || !(validation as ValidationInput)?.autoCheck) return;
    if (
      (validation as boolean) === false ||
      (validation as ValidationInput)?.autoCheck === false
    ) {
      return;
    }
    const valid = inputRef.current?.validity.valid;
    if (valid) {
      const regex = (validation as ValidationInput)?.pattern;
      const rgxValid = regex?.test(props.value as string);
      setIsValid(rgxValid ?? true);
      return;
    }
    setIsValid(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  const resultValidation =
    (!fisrtLoad && !!validation && isValid === false) ||
    (props.validator && !props.validator?.(props.value as string));

  return (
    <div
      className={
        "text-field" +
        (isHover ? " active" : "") +
        (resultValidation ? " invalid" : "")
      }
      hidden={props.hidden}
    >
      <Icon icon={props.icon} />
      {props.type === "password" && (
        <Icon
          icon={isShow ? "mdi:eye-off" : "mdi:eye"}
          style={{
            cursor: "pointer",
          }}
          onClick={() => setIsShow(!isShow)}
        />
      )}
      <input
        ref={inputRef}
        pattern={(validation as ValidationInput)?.pattern?.toString()}
        {...props}
        type={
          props.type === "password"
            ? isShow
              ? "text"
              : "password"
            : props.type
        }
        // onChange={(e) => {
        //   props.onChange?.(e);
        //   setFirstLoad(false);
        // }}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => setFocused(false)}
        style={{
          padding: props.type === "password" ? "0 32px" : "0 5px 0 32px",
        }}
        // onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
      />
      <label className='input-label'>{props.label}</label>
      {resultValidation && (
        <label className='input-msg' ref={msgRef}>
          {(validation as ValidationInput)?.msgError ||
            `Your ${props.label.toLowerCase()} is invalid`}
        </label>
      )}
    </div>
  );
});

export default Input;
