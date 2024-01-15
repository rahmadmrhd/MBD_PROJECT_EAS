"use client";

import { TabPanel } from "@mui/base";
import { Box, Tab, TabList, Tabs, Typography, tabClasses } from "@mui/joy";
import React from "react";
import SettingProfile from "./setting-profile";
import MyLink from "@/src/components/MyLink";
import { useBreadcrumbsContext } from "@/src/context/BreadcrumbsContext";
import { notFound } from "next/navigation";
import User from "@/src/resources/user/user-model";

export default function Profile({ params }: { params: { tab: string } }) {
  const useBreadcrumbs = useBreadcrumbsContext();

  React.useEffect(() => {
    useBreadcrumbs.setReplace({
      searchValue: `profile/${params.tab}`,
      replaceValue: `profile`,
    });
  }, [params.tab]);

  const listTabs = [
    {
      name: "Settings",
      value: "settings",
      content: <SettingProfile />,
    },
    {
      name: "Plain",
      value: "plain",
      content: <></>,
    },
  ];

  // if (!listTabs.some((x) => x.value === params.tab)) notFound();

  return (
    <>
      <Box
        sx={{
          display: { md: "flex", xs: "none" },
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level='h2' component='h1' className=''>
          Profile
        </Typography>
      </Box>
      <Tabs
        value={params.tab}
        sx={{
          bgcolor: "transparent",
        }}
      >
        <TabList
          tabFlex={1}
          size='sm'
          sx={{
            pl: { xs: 0, md: 4 },
            justifyContent: "left",
            [`&& .${tabClasses.root}`]: {
              fontWeight: "600",
              flex: "initial",
              color: "text.tertiary",
              [`&.${tabClasses.selected}`]: {
                bgcolor: "transparent",
                color: "text.primary",
                "&::after": {
                  height: "2px",
                  bgcolor: "primary.500",
                },
              },
            },
          }}
        >
          {listTabs.map((tab) => (
            <Tab
              key={tab.value}
              sx={{ borderRadius: "6px 6px 0 0" }}
              indicatorInset
              value={tab.value}
              component={MyLink}
              href={`/app/profile/${tab.value}`}
            >
              {tab.name}
            </Tab>
          ))}
        </TabList>
        {listTabs.map((tab) => (
          <TabPanel key={tab.value} value={tab.value}>
            {tab.content}
          </TabPanel>
        ))}
      </Tabs>
    </>
  );
}
