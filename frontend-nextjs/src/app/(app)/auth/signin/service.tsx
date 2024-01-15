import { PropertiesInput } from "../Input";

export interface FormTemplate {
  title: string;
  action: string;
  option: {
    forgotPassword?: boolean;
    allowRemember?: boolean;
  };
  inputs: Array<PropertiesInput>;
  Note?: any;
}

interface FormTemplates {
  [key: string]: FormTemplate;
}

const signinForm: FormTemplates = {
  user: {
    title: "Sign In",
    action: "Login",
    option: {
      allowRemember: false,
      forgotPassword: true,
    },
    inputs: [
      {
        type: "text",
        name: "username",
        id: "username",
        label: "Username",
        required: true,
        // pattern: 'S+',
        icon: "mdi:account",
        hidden: true,
      },
      {
        type: "password",
        name: "password",
        id: "password",
        label: "Password",
        required: true,
        icon: "typcn:key",
        autoFocus: true,
      },
    ],
  },
  other: {
    title: "Sign In",
    action: "Login",
    option: {
      allowRemember: true,
      forgotPassword: true,
    },
    inputs: [
      {
        type: "text",
        name: "username",
        id: "username",
        label: "Username",
        required: true,
        // pattern: 'S+',
        icon: "mdi:account",
        autoFocus: true,
      },
      {
        type: "password",
        name: "password",
        id: "password",
        label: "Password",
        required: true,
        // pattern: 'S+',
        icon: "typcn:key",
      },
    ],
  },
};

export function getFormSignIn(key: string) {
  // keyForm = key;
  return signinForm[key];
}
