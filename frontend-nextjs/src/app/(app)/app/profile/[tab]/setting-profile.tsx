/* eslint-disable @next/next/no-img-element */
"use client";
import User from "@/src/resources/user/user-model";
import {
  AccessTimeFilledRounded,
  EditRounded,
  EmailRounded,
} from "@mui/icons-material";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardActions,
  CardOverflow,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import React from "react";

export default function SettingProfile() {
  const [dataUser, setDataUser] = React.useState<User>({});
  const [lockEdit, setLockEdit] = React.useState(true);

  const onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (lockEdit) setLockEdit(false);
    setDataUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <>
      <Stack
        spacing={4}
        sx={{
          display: "flex",
          maxWidth: "800px",
          mx: "auto",
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level='title-md'>Personal info</Typography>
            <Typography level='body-sm'>
              Customize how your profile information will apper to the networks.
            </Typography>
          </Box>
          <Divider />
          <Stack direction='column' spacing={2} sx={{ display: "flex", my: 1 }}>
            <Stack direction='row' spacing={2}>
              <Stack direction='column' spacing={1}>
                <AspectRatio
                  ratio='1/1'
                  maxHeight={125}
                  sx={{ flex: 1, minWidth: 125, borderRadius: "100%" }}
                >
                  <img
                    src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286'
                    srcSet='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x'
                    loading='lazy'
                    alt=''
                  />
                </AspectRatio>
                <IconButton
                  aria-label='upload new picture'
                  size='sm'
                  variant='outlined'
                  color='neutral'
                  sx={{
                    bgcolor: "background.body",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    left: 100,
                    top: 185,
                    boxShadow: "sm",
                  }}
                >
                  <EditRounded />
                </IconButton>
              </Stack>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <FormControl required>
                  <FormLabel>Fullname</FormLabel>
                  <Input size='sm' placeholder='Your Name' />
                </FormControl>
                <FormControl required>
                  <FormLabel>Username</FormLabel>
                  <Input size='sm' placeholder='Username' />
                </FormControl>
              </Stack>
            </Stack>
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Input size='sm' defaultValue='UI Developer' />
            </FormControl>
            <FormControl sx={{ flexGrow: 1 }}>
              <FormLabel>Email</FormLabel>
              <Input
                size='sm'
                type='email'
                startDecorator={<EmailRounded />}
                placeholder='email'
                defaultValue='siriwatk@test.com'
                sx={{ flexGrow: 1 }}
              />
            </FormControl>
            <div>
              <FormControl sx={{ display: { sm: "contents" } }}>
                <FormLabel>Timezone</FormLabel>
                <Select
                  size='sm'
                  startDecorator={<AccessTimeFilledRounded />}
                  defaultValue='1'
                >
                  <Option value='1'>
                    Indochina Time (Bangkok){" "}
                    <Typography textColor='text.tertiary' ml={0.5}>
                      — GMT+07:00
                    </Typography>
                  </Option>
                  <Option value='2'>
                    Indochina Time (Ho Chi Minh City){" "}
                    <Typography textColor='text.tertiary' ml={0.5}>
                      — GMT+07:00
                    </Typography>
                  </Option>
                </Select>
              </FormControl>
            </div>
          </Stack>
          <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
              <Button size='sm' variant='outlined' color='neutral'>
                Cancel
              </Button>
              <Button size='sm' variant='solid'>
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
      </Stack>
    </>
  );
}
