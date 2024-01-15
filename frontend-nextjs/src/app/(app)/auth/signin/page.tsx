"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { InputRef } from "../Input";
import { FormTemplate, getFormSignIn } from "./service";
import { AxiosError } from "axios";
import LoaderModal from "@/src/components/Loading/LoaderModal";
import dynamic from "next/dynamic";
import User from "@/src/resources/user/user-model";
import userServicesClient from "@/src/resources/user/user-services-client";
import { useCookies } from "next-client-cookies";
import { useSWRConfig } from "swr";
// import emailImg from "@resources/email_img.png";

const Input = dynamic(() => import("../Input"), {
  ssr: false,
  loading: () => <LoaderModal open />,
});
const Account = dynamic(() => import("./Account"), {
  ssr: false,
  loading: () => <LoaderModal open />,
});
// const Account = dynamic(() => import("./Account"), { ssr: false });

type Properties = {
  params: { auth: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// eslint-disable-next-line no-unused-vars
enum Mode {
  // eslint-disable-next-line no-unused-vars
  SignIn,
  // eslint-disable-next-line no-unused-vars
  SignUp,
  // eslint-disable-next-line no-unused-vars
  OTP,
  // eslint-disable-next-line no-unused-vars
  Reset,
  // eslint-disable-next-line no-unused-vars
  ResetPassword,
  // eslint-disable-next-line no-unused-vars
  ChangePassword,
}

const defaultValueAuth = {
  username: "",
  password: "",
  remember: false,
};

function Auth(props: Properties) {
  const [template, setTemplate] = useState<FormTemplate | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<Array<User>>(
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("users") ?? "[]")
      : []
  );
  const [valueAuth, setValueAuth] = useState(defaultValueAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const router = useRouter();
  const cookie = useCookies();
  const { mutate } = useSWRConfig();
  const inputsRef = useRef<{
    [key: string]: InputRef;
  }>({});

  useEffect(() => {
    if (users.length <= 0) {
      setSelectedUser("other");
      setTemplate(getFormSignIn("other"));
    }
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (selectedUser === "other") return null;
    if (selectedUser) {
      return users.filter((item) => item.username === selectedUser);
    }
    return users;
  }, [selectedUser, users]);

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }

  const deleteUser = (user: User) => {
    const index = users.findIndex((u) => u.username === user.username);
    if (index < 0) return;
    users.splice(index, 1);
    setUsers(users);
    if (typeof window !== "undefined")
      window.localStorage.setItem("users", JSON.stringify(users));
    router.refresh();
  };

  const userOnClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent> | null,
    user: User
  ) => {
    e?.preventDefault();

    if (user.username === selectedUser) return;
    setValueAuth(defaultValueAuth);
    if (user.username === "other") {
      setSelectedUser("other");
      setTemplate(getFormSignIn("other"));
      return;
    }
    setValueAuth({
      ...valueAuth,
      username: user.username ?? "",
    });
    setTemplate(getFormSignIn("user"));
    setSelectedUser(user.username ?? null);
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueAuth({
      ...valueAuth,
      [e.target.name]: e.target.value,
    });
  };

  const saveUserToLocalStorage = (data: User) => {
    let isDuplicate = false;
    const users: Array<User> = JSON.parse(
      typeof window !== "undefined"
        ? window.localStorage.getItem("users") ?? "[]"
        : "[]"
    );
    const newUsers: Array<User> = users.map((user) => {
      if (user?.id === data?.id) {
        isDuplicate = true;
      }
      return {
        id: user?.id,
        name: user?.name,
        username: user?.username,
        // imageUrl: user?.imageUrl,
      };
    });
    if (!isDuplicate) {
      const newUser: User = {
        id: data?.id,
        name: data?.name,
        username: data?.username,
        // imageUrl: data?.imageUrl,
      };
      newUsers.push(newUser);
    }
    if (typeof window !== "undefined")
      window.localStorage.setItem("users", JSON.stringify(newUsers));
  };

  const loginRequest = async (): Promise<void> => {
    await userServicesClient
      .login(valueAuth.username, valueAuth.password)
      .then((user: User | null) => {
        if (!user) return;
        cookie.set("token", user?.token ?? "", {
          expires: 1 * 24 * 60 * 60 * 1000,
        });
        if (valueAuth.remember) {
          saveUserToLocalStorage(user as User);
        }
        const query = props.searchParams.callbackUrl as string;
        router.replace(query || "/app");
        mutate(["/auth/employee/current", user?.token ?? ""], undefined, {
          revalidate: true,
        });
      })
      .catch((error: AxiosError) => {
        setIsLoading(false);
        setMessageError(
          (error.response?.data as any)?.message ?? "Something went wrong"
        );
      })
      .finally(() => {});
  };

  const clear = () => {
    setValueAuth(defaultValueAuth);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await loginRequest();
  };

  return (
    <main
      className='auth-box disable-select'
      // onKeyDown={(e) => {
      //   // console.log(e);
      // }}
    >
      <LoaderModal open={isLoading} />
      <div className='auth-form'>
        <h1 className='auth-title'>{template?.title ?? "Sign In"}</h1>
        <div
          className='auth-alert'
          style={{ display: messageError ? "block" : "none" }}
        >
          <p>{messageError}</p>
        </div>

        {users.length > 0 && (
          <div className='select-account'>
            <button
              className={
                "back-btn" + (selectedUser ? " enabled focus-visible" : "")
              }
              disabled={Boolean(!selectedUser)}
              tabIndex={-1}
              onClick={() => {
                setSelectedUser(null);
                setTemplate(null);
                setMessageError(null);
                clear();
              }}
            >
              {selectedUser ? (
                <div tabIndex={1} style={{ color: "var(--foreground)" }}>
                  <Icon icon='material-symbols:arrow-back' />
                  <b>Back</b>
                </div>
              ) : (
                <b>Select Your Account</b>
              )}
            </button>
            <ul>
              {filteredUsers &&
                filteredUsers.map((user, index) => {
                  return (
                    <Account
                      key={index}
                      selectedUser={selectedUser}
                      tabIndex={index + 2}
                      allowRemove={selectedUser !== user.username}
                      name={user.name}
                      username={user.username}
                      // imageUrl={user.imageUrl}
                      onClick={userOnClick}
                      onRemove={deleteUser}
                    />
                  );
                })}

              {!selectedUser || selectedUser === "other" ? (
                <li
                  className={selectedUser === "other" ? "disable-click" : ""}
                  tabIndex={
                    selectedUser === "other"
                      ? -1
                      : (filteredUsers?.length ?? 0) + 3
                  }
                  onKeyDown={(e) => {
                    if (e.code === "Enter" || e.code === "Space")
                      userOnClick?.(e as any, { username: "other" });
                  }}
                  onClick={(e) => {
                    if (selectedUser === "other") return;
                    userOnClick(e, { username: "other" });
                  }}
                >
                  <b
                    style={{
                      width: "100%",
                      textAlign: "center",
                      color: "var(--foreground)",
                    }}
                  >
                    Other
                  </b>
                </li>
              ) : (
                <></>
              )}
            </ul>
          </div>
        )}

        {template && (
          <form
            onSubmit={(e) => {
              // e.preventDefault();
              onSubmit(e);
            }}
          >
            {template.inputs.map((input, index) => {
              return (
                <Input
                  key={index}
                  {...input}
                  ref={(node) =>
                    (inputsRef.current[input.name ?? ""] = node as InputRef)
                  }
                  value={
                    valueAuth[
                      (input.name ?? "") as keyof typeof valueAuth
                    ] as string
                  }
                  onChange={onChangeInput}
                  // onChangeInput={(e, props) => onChangeInput(e, props)}
                />
              );
            })}

            <div className='auth-option-btn'>
              {template.option.allowRemember && (
                <div>
                  <input
                    className='focus'
                    type='checkbox'
                    name='remember'
                    id='remember'
                    onChange={onChangeInput}
                  />
                  <label htmlFor='remember'>Remember Me</label>
                </div>
              )}
            </div>
            <input
              type='submit'
              name='submit'
              className='focus-visible'
              value={template.action}
            />
          </form>
        )}
      </div>
    </main>
  );
}

export default Auth;
