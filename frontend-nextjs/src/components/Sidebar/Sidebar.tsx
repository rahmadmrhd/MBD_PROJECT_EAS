"use client";

import React, { useState } from "react";
import {
  GlobalStyles,
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemContent,
  Typography,
  Sheet,
  Button,
  Badge,
} from "@mui/joy";
import { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ColorSchemeToggle from "../ColorSchemeToggle";
import Menu from "@mui/icons-material/Menu";

import { Icon } from "@iconify/react/dist/iconify.js";
import { closeSidebar, toggleSidebar } from "../utils";
import { useUserContext } from "../../context/UserContext";
import ActiveListItemButton from "../ActiveListItemButton";
import { useSidebarContext } from "../../context/SidebarContext";
import listItemSidebar, {
  ItemSidebarExpanded,
  isItemSidebarExpanded,
} from "./item-sidebar";
import LoaderModal from "../Loading/LoaderModal";
import MyLink from "../MyLink";
import userServicesClient from "@/src/resources/user/user-services-client";
import { useCookies } from "next-client-cookies";
import { useSWRConfig } from "swr";
import { useBadgeContext } from "@/src/context/BadgeContext";
import { usePathname, useRouter } from "next/navigation";

// const dataDummy = {
//   ["Orders"]: 4,
//   ["Menu"]: 6,
// };
function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "0.2s ease",
          "& > *": {
            overflow: "hidden",
          },
        }}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar() {
  const [title, setTitle] = useState("");
  const user = useUserContext();
  const sidebar = useSidebarContext();
  const [isLoading, setIsLoading] = useState(false);
  const cookie = useCookies();
  const { mutate } = useSWRConfig();
  const [listBadge, setListBadge] = React.useState<{
    [key: string]: number | undefined;
  }>({});
  const badge = useBadgeContext();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    setListBadge(badge);
  }, [badge]);

  React.useEffect(() => {
    if (pathname.startsWith("/profile")) setTitle("Profile");
  }, [pathname]);

  const logoutRequest = async () => {
    setIsLoading(true);
    await userServicesClient
      .logout(user?.token)
      .then(() => {
        cookie.remove("token");
        router.replace("/auth/signin");
        mutate(["/auth/employee/current", user?.token], undefined);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onActivePage = (title: string) => {
    setTitle(title);
    sidebar.setTitle(title);
  };

  return (
    <>
      <LoaderModal open={isLoading} />
      <Sheet
        sx={{
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          width: "100vw",
          height: "var(--Header-height)",
          zIndex: 9995,
          p: 2,
          gap: 1,
          borderBottom: "1px solid",
          borderColor: "background.level1",
          boxShadow: "sm",
        }}
      >
        <GlobalStyles
          styles={(theme) => ({
            ":root": {
              "--Header-height": "52px",
              [theme.breakpoints.up("md")]: {
                "--Header-height": "0px",
              },
            },
          })}
        />
        <IconButton
          onClick={() => toggleSidebar()}
          variant='outlined'
          color='neutral'
          size='sm'
        >
          <Menu />
        </IconButton>

        <Typography
          sx={{
            flexGrow: 1,
            textAlign: "center",
            fontWeight: 500,
            letterSpacing: 5,
            color: "text.primary",
          }}
        >
          {title.toUpperCase()}
        </Typography>
      </Sheet>
      <Sheet
        className='Sidebar'
        sx={{
          position: { xs: "fixed", md: "sticky" },
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
            md: "none",
          },
          transition: "transform 0.4s, width 0.4s",
          zIndex: 10000,
          height: "100dvh",
          width: "var(--Sidebar-width)",
          top: 0,
          p: 2,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRight: "1px solid",
          borderColor: "divider",
        }}
      >
        <GlobalStyles
          styles={(theme) => ({
            ":root": {
              "--Sidebar-width": "220px",
              [theme.breakpoints.up("lg")]: {
                "--Sidebar-width": "240px",
              },
            },
          })}
        />
        <Box
          className='Sidebar-overlay'
          sx={{
            position: "fixed",
            zIndex: 9998,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            opacity: "var(--SideNavigation-slideIn)",
            backgroundColor: "var(--joy-palette-background-backdrop)",
            transition: "opacity 0.4s",
            transform: {
              xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
              lg: "translateX(-100%)",
            },
          }}
          onClick={() => closeSidebar()}
        />
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {/* <IconButton variant='soft' color='primary' size='sm'>
          <BrightnessAutoRoundedIcon />
        </IconButton> */}
          <Typography level='title-lg'>Cafe</Typography>
          <ColorSchemeToggle sx={{ ml: "auto" }} />
        </Box>
        <Box
          sx={{
            minHeight: 0,
            overflow: "hidden auto",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            [`& .${listItemButtonClasses.root}`]: {
              gap: 1.5,
            },
          }}
        >
          <List
            size='sm'
            sx={{
              gap: 1,
              "--List-nestedInsetStart": "30px",
              "--ListItem-radius": (theme) => theme.vars.radius.sm,
            }}
          >
            {" "}
            {listItemSidebar.map((item, index) => {
              if (isItemSidebarExpanded(item)) {
                return (
                  <ListItem nested key={index}>
                    <Toggler
                      renderToggle={({ open, setOpen }) => (
                        <ActiveListItemButton
                          redirect={!(item as ItemSidebarExpanded).disable}
                          href={`${sidebar.rootPath}${item.href}`}
                          exact={item.exact}
                          onClick={() => setOpen(!open)}
                          onActive={() =>
                            onActivePage(item.label.toUpperCase())
                          }
                        >
                          {typeof item.icon === "string" ? (
                            <Icon
                              style={{ fontSize: 18 }}
                              icon={item.icon as string}
                            />
                          ) : (
                            item.icon
                          )}
                          <ListItemContent>
                            <Typography level='title-sm'>
                              {item.label}
                            </Typography>
                          </ListItemContent>
                          <Icon
                            style={{ fontSize: 18 }}
                            icon='mdi:chevron-down'
                            rotate={open ? 2 : 0}
                          />
                        </ActiveListItemButton>
                      )}
                    >
                      <List sx={{ gap: 0.5 }}>
                        {(item as ItemSidebarExpanded).children?.map(
                          (child, index) => {
                            return (
                              <ListItem sx={{ mt: 0.5 }} key={index}>
                                <ActiveListItemButton
                                  exact={child.exact}
                                  href={`${sidebar.rootPath}${item.href}${child.href}`}
                                  onActive={() => {
                                    onActivePage(child.label.toUpperCase());
                                    sidebar.setMenuSelected(child.label);
                                  }}
                                >
                                  {child.label}
                                </ActiveListItemButton>
                              </ListItem>
                            );
                          }
                        )}
                      </List>
                    </Toggler>
                  </ListItem>
                );
              } else {
                return (
                  <ListItem key={index}>
                    <ActiveListItemButton
                      href={`${sidebar.rootPath}${item.href}`}
                      exact={item.exact}
                      onActive={() => {
                        onActivePage(item.label.toUpperCase());
                        sidebar.setMenuSelected(item.label);
                      }}
                    >
                      {typeof item.icon === "string" ? (
                        <Badge
                          size='sm'
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          showZero={false}
                          badgeContent={listBadge[item.label] ?? 0}
                          max={99}
                        >
                          <Icon
                            style={{ fontSize: 18 }}
                            icon={item.icon as string}
                          />
                        </Badge>
                      ) : (
                        <Badge
                          size='sm'
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          badgeContent={listBadge[item.label] ?? 0}
                          max={99}
                        >
                          {item.icon}
                        </Badge>
                      )}
                      <ListItemContent>
                        <Typography level='title-sm'>{item.label}</Typography>
                      </ListItemContent>
                    </ActiveListItemButton>
                  </ListItem>
                );
              }
            })}
          </List>
        </Box>
        <Divider />
        <Box sx={{ display: "flex", gap: 0, alignItems: "center" }}>
          <Button
            sx={{ flexGrow: 1, display: "flex", gap: 2, alignItems: "center" }}
            variant='plain'
            color='neutral'
            href='/app/profile/settings'
            component={MyLink}
          >
            {user?.imageUrl ? (
              <Avatar
                variant='outlined'
                size='sm'
                src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286'
              />
            ) : (
              <Avatar variant='soft' size='sm'>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            )}

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography level='title-sm'>{user?.name}</Typography>
              <Typography level='body-xs'>{user?.username}</Typography>
            </Box>
          </Button>
          <IconButton
            size='sm'
            variant='plain'
            color='neutral'
            onClick={logoutRequest}
          >
            <Icon icon='mdi:logout' />
          </IconButton>
        </Box>
      </Sheet>
    </>
  );
}
