/* eslint-disable @next/next/no-img-element */
"use client";
import {
  SaveRounded,
  Add,
  EditRounded,
  Cancel,
  LockOpenRounded,
} from "@mui/icons-material";
import {
  AspectRatio,
  Card,
  Box,
  Typography,
  Divider,
  Stack,
  FormControl,
  Select,
  Option,
  Textarea,
  FormLabel,
  Input,
  IconButton,
  TabPanel,
  Tab,
  TabList,
  Tabs,
  tabClasses,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Avatar,
  ListDivider,
} from "@mui/joy";
import { Button, ButtonGroup } from "@mui/joy";
import React from "react";
import { useUserContext } from "@/src/context/UserContext";
import CategoryModel from "@/src/resources/category/category-model";
import { ErrorToString } from "@/src/utils/error-types";
import {
  CurrencyFormatAdapter,
  PercentFormatAdapter,
} from "@/src/utils/formatter";
import MenuOption from "./menuOption";
import MenuModel, {
  MenuOptionUpdateModel,
  MenuRating,
} from "@/src/resources/menu/menu-model";
import LoaderModal from "@/src/components/Loading/LoaderModal";
import MenuServices from "@/src/resources/menu/menu-services";
import { notFound, useRouter } from "next/navigation";
import { useBreadcrumbsContext } from "@/src/context/BreadcrumbsContext";
import { randomId } from "@mui/x-data-grid-generator";
import MyLink from "@/src/components/MyLink";
import useAccessData from "@/src/utils/swr";
import { Rating } from "@mui/material";

const defaultValue: MenuModel = {
  name: "",
  description: "",
  available: true,
  options: [],
};

function FormMenu({ idMenu }: { idMenu?: number }) {
  const user = useUserContext();
  const [isLoading, setIsLoading] = React.useState(true);
  const [valueAdd, setValueAdd] = React.useState(1);
  const [dataMenu, setDataMenu] = React.useState<MenuModel>(defaultValue);
  const [dataMenuOriginal, setDataMenuOriginal] = React.useState<MenuModel>({
    ...defaultValue,
  });
  const [count, setCount] = React.useState(0);
  const router = useRouter();
  const isEdit = !!idMenu;
  const useBreadcrumbs = useBreadcrumbsContext();
  const [image, setImage] = React.useState<File | Blob>();
  const [lockEdit, setLockEdit] = React.useState(!!idMenu);
  const optionsRef = React.useMemo(
    () => (dataMenu.options ?? []).map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataMenu.options ?? []]
  );
  const [errorPage, setErrorPage] = React.useState<Error>();
  const { data, error } = useAccessData<CategoryModel[]>("/category");
  const { data: rating, error: ratingError } = useAccessData<MenuRating[]>(
    `/menu/${idMenu}/rating`,
    isEdit
  );

  React.useEffect(() => {
    setIsLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (error) throw error;
  if (errorPage) throw errorPage;
  if (ratingError) throw ratingError;

  const categories = data?.data ?? [];

  const ratings = rating?.data ?? [];

  const fetchData = async () => {
    try {
      if (isEdit) {
        await getMenu();
      } else {
        useBreadcrumbs.setReplace({
          searchValue: `menu/add`,
          replaceValue: `menu/New Menu:force`,
        });
      }
      // eslint-disable-next-line no-useless-catch
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const getMenu = async () => {
    const { data: menu, error } = await MenuServices.getById(
      user?.token as string,
      idMenu as number
    );
    if (error) {
      setErrorPage(new Error(ErrorToString(error)));
    }
    if (menu == null) {
      notFound();
    }
    useBreadcrumbs.setReplace({
      searchValue: `menu/${idMenu}`,
      replaceValue: `menu/${menu.name}:force`,
    });
    menu.categoryId = menu.category?.id as number;
    menu.discount = (menu.discount ?? 0) * 100;
    setDataMenu(menu);
    setDataMenuOriginal(JSON.parse(JSON.stringify(menu)));
  };

  const onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDataMenu({ ...dataMenu, [e.target.name]: e.target.value });
  };

  const createOrUpdateRequest = async () => {
    try {
      const listDeletedOption =
        dataMenuOriginal.options
          ?.filter(
            (x) =>
              !dataMenu.options?.some((y) => y.id === x.id) &&
              typeof x.id === "number"
          )
          .map((x) => x.id as number) ?? [];
      const listUpdatedOption =
        dataMenu.options
          ?.filter(
            (opti) =>
              typeof opti.id === "number" &&
              listDeletedOption.indexOf(opti.id) < 0
          )
          .map((option) => {
            const oldOption = dataMenuOriginal.options?.find(
              (x) => x.id === option.id
            );
            const newItems =
              option.items.filter((opti) => typeof opti.id === "string") ?? [];
            const deleteItem =
              oldOption?.items
                ?.filter(
                  (x) =>
                    !option.items.some((y) => y.id === x.id) &&
                    typeof x.id === "number"
                )
                .map((x) => x.id as number) ?? [];
            const update = option.items.filter((item) => {
              const oldItem = oldOption?.items?.find((y) => y.id === item.id);
              return (
                typeof item.id === "number" &&
                deleteItem.indexOf(item.id) < 0 &&
                (oldItem?.name !== item.name ||
                  oldItem?.price !== item.price ||
                  oldItem?.available !== item.available)
              );
            });
            return {
              ...option,
              items: {
                new: newItems,
                delete: deleteItem,
                update: update,
              },
            };
          }) ?? [];
      const dataEdit: Omit<MenuModel, "options" | "category"> & {
        options: MenuOptionUpdateModel;
      } = {
        ...dataMenu,
        options: {
          new:
            dataMenu.options?.filter((opti) => typeof opti.id === "string") ??
            [],
          delete: listDeletedOption,

          update: listUpdatedOption,
        },
      };

      const { data, error } = isEdit
        ? await MenuServices.update(user?.token as string, dataEdit)
        : await MenuServices.create(user?.token as string, dataMenu);
      if (data) {
        if (isEdit) {
          setIsLoading(true);
          setLockEdit(true);
          await fetchData();
        } else {
          router.replace(`/app/db/menu/${data.id}`);
        }
      }
      if (error) {
        setErrorPage(new Error(ErrorToString(error)));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getLabelText = (value: number) => {
    if (value <= 1) return "Useless";
    if (value <= 2) return "Poor";
    if (value <= 3) return "Acceptable";
    if (value <= 4) return "Good";
    if (value <= 5) return "Excellent";
  };

  return (
    <>
      <LoaderModal open={isLoading} />

      <Tabs
        defaultValue='menu'
        sx={{
          bgcolor: "transparent",
        }}
      >
        <TabList
          tabFlex={1}
          size='sm'
          sx={{
            display: isEdit ? "flex" : "none",
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
          <Tab sx={{ borderRadius: "6px 6px 0 0" }} indicatorInset value='menu'>
            Menu
          </Tab>
          <Tab
            sx={{ borderRadius: "6px 6px 0 0" }}
            indicatorInset
            value='rating'
          >
            Rating
          </Tab>
        </TabList>
        <TabPanel value='menu'>
          <form
            noValidate={lockEdit}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") e.preventDefault();
            // }}
            onSubmit={async (e) => {
              e.preventDefault();
              if (lockEdit) {
                setLockEdit(false);
                return;
              }
              const inEditMode = optionsRef.some((option) => {
                return (option.current as any).checkItemsHasEdited();
              });
              if (inEditMode) return;
              setIsLoading(true);
              await createOrUpdateRequest();
            }}
          >
            <Stack
              direction='column'
              sx={{
                display: "flex",
                zIndex: 10,
                position: "sticky",
                top: { xs: "-12px", md: "-24px" },
                mx: { xs: -2, md: -6 },
                px: { xs: 2, md: 6 },
                pt: 2,
                backgroundColor: "background.body",
                borderRadius: "0",
              }}
            >
              <ButtonGroup>
                <Button
                  startDecorator={
                    lockEdit ? <LockOpenRounded /> : <SaveRounded />
                  }
                  color='primary'
                  variant='solid'
                  component='button'
                  type={lockEdit ? undefined : "submit"}
                >
                  {lockEdit ? "Unlock" : idMenu ? "Update" : "Save"}
                </Button>
                <Button
                  startDecorator={<Cancel />}
                  color='danger'
                  variant='solid'
                  component={MyLink}
                  href='/app/db/menu'
                >
                  Cancel
                </Button>
              </ButtonGroup>
              <Divider sx={{ mt: 1 }} />
            </Stack>
            <Card>
              <Stack
                direction={{ xs: "column", lg: "row" }}
                divider={<Divider orientation='vertical' />}
                spacing={3}
                sx={{ my: 1 }}
              >
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Stack
                    direction={{ xs: "column", lg: "row" }}
                    spacing={{ xs: 1, lg: 2 }}
                  >
                    <FormControl
                      required
                      size='sm'
                      sx={{ flexGrow: 1 }}
                      disabled={lockEdit}
                    >
                      <FormLabel>Category</FormLabel>
                      <Select
                        required
                        size='sm'
                        placeholder='-- Select Category--'
                        value={dataMenu.categoryId || dataMenu.category?.id}
                        onChange={(e, value) => {
                          setDataMenu({
                            ...dataMenu,
                            categoryId: value as number,
                          });
                        }}
                      >
                        {categories?.map((category) => (
                          <Option key={category.id} value={category.id}>
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      required
                      size='sm'
                      sx={{ flexGrow: 1 }}
                      disabled={lockEdit}
                    >
                      <FormLabel>Is Available?</FormLabel>
                      <Select
                        required
                        size='sm'
                        placeholder='-- Available --'
                        value={dataMenu.available}
                        onChange={(e, value) => {
                          setDataMenu({
                            ...dataMenu,
                            available: value as boolean,
                          });
                        }}
                      >
                        <Option value={true}>Available</Option>
                        <Option value={false}>Not Available</Option>
                      </Select>
                    </FormControl>
                  </Stack>
                  <FormControl required disabled={lockEdit}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      size='sm'
                      onChange={onChangeInput}
                      name='name'
                      value={dataMenu.name}
                    />
                  </FormControl>
                  <FormControl disabled={lockEdit}>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      minRows={5}
                      maxRows={7}
                      size='sm'
                      onChange={(e) => onChangeInput(e)}
                      name='description'
                      value={dataMenu.description}
                    />
                  </FormControl>
                  <Stack
                    direction={{ xs: "column", lg: "row" }}
                    spacing={{ xs: 1, lg: 2 }}
                  >
                    <FormControl
                      required
                      sx={{ flexGrow: 1 }}
                      disabled={lockEdit}
                    >
                      <FormLabel>Price</FormLabel>
                      <Input
                        sx={{ minWidth: "auto" }}
                        onChange={onChangeInput}
                        name='price'
                        size='sm'
                        placeholder='Rp. 123.456,78'
                        slotProps={{
                          input: {
                            component: CurrencyFormatAdapter,
                          },
                        }}
                        value={dataMenu.price ?? ""}
                      />
                    </FormControl>
                    <FormControl required disabled={lockEdit}>
                      <FormLabel>Discount</FormLabel>
                      <Input
                        onChange={onChangeInput}
                        name='discount'
                        size='sm'
                        placeholder='0.00%'
                        slotProps={{
                          input: {
                            component: PercentFormatAdapter,
                          },
                        }}
                        value={dataMenu.discount}
                      />
                    </FormControl>
                    <FormControl disabled={lockEdit}>
                      <FormLabel>After Diskon</FormLabel>
                      <Input
                        placeholder='Rp. 123.456,78'
                        value={
                          (dataMenu.price ?? 0) -
                          (dataMenu.price ?? 0) *
                            ((dataMenu.discount ?? 0) / 100)
                        }
                        slotProps={{
                          input: {
                            component: CurrencyFormatAdapter,
                          },
                        }}
                        size='sm'
                        readOnly
                      />
                    </FormControl>
                  </Stack>
                </Stack>
                {/* Gambar */}
                <Stack direction='column' sx={{ alignItems: "center" }}>
                  <AspectRatio
                    ratio='1'
                    sx={{ width: 250, height: 250, borderRadius: "12%" }}
                  >
                    <img
                      src={
                        image
                          ? URL.createObjectURL(image)
                          : dataMenu.image
                          ? `${process.env.NEXT_PUBLIC_API_URL}/files/${dataMenu.image}`
                          : "/empty.jpg"
                      }
                      loading='lazy'
                      alt=''
                    />
                  </AspectRatio>
                  <IconButton
                    aria-label='upload new picture'
                    size='sm'
                    variant='outlined'
                    color='neutral'
                    component='label'
                    disabled={lockEdit}
                    sx={{
                      bgcolor: "background.body",
                      position: "relative",
                      width: 50,
                      height: 50,
                      zIndex: 2,
                      borderRadius: "50%",
                      left: 90,
                      bottom: 60,
                      boxShadow: "sm",
                    }}
                  >
                    <EditRounded />
                    <input
                      disabled={lockEdit}
                      type='file'
                      accept='image/*'
                      hidden
                      onChange={(e) => {
                        console.log(e.target.files);
                        if (e.target.files) setImage(e.target.files?.[0]);
                      }}
                    />
                  </IconButton>
                </Stack>
              </Stack>
            </Card>
            {/* List Menu Options */}
            <Card>
              <Box sx={{ mb: 1 }}>
                <Typography level='title-md'>Menu Options</Typography>
              </Box>
              <Divider />
              {/* List Menu Options */}
              {dataMenu?.options &&
                dataMenu?.options!.map((option, index) => {
                  return (
                    <MenuOption
                      key={option.id}
                      index={index}
                      menuOption={option}
                      ref={optionsRef[index]}
                      setDataMenu={setDataMenu}
                      disabled={lockEdit}
                    />
                  );
                })}
              <Card>
                <Stack direction={"row"} spacing={3}>
                  <Typography level='title-md'>Add Menu Options?</Typography>

                  <Input
                    sx={{ minWidth: "65px", width: "65px" }}
                    disabled={lockEdit}
                    type='number'
                    value={valueAdd}
                    size='sm'
                    onChange={(event) =>
                      setValueAdd(Number.parseInt(event.target.value))
                    }
                    slotProps={{
                      input: {
                        sx: { width: "auto" },
                        // ref: inputRef,
                        min: 1,
                        step: 1,
                      },
                    }}
                  />
                  <Button
                    disabled={lockEdit}
                    variant='solid'
                    color='success'
                    size='sm'
                    startDecorator={<Add />}
                    onClick={() => {
                      setDataMenu((prev) => {
                        return {
                          ...prev,
                          options: [
                            ...(prev.options ?? []),
                            ...Array.from({ length: valueAdd }, (_, index) => ({
                              id: randomId(),
                              name: `Option ${count + index + 1}`,
                              min: 0,
                              max: 1,
                              items: [],
                            })),
                          ],
                        };
                      });
                      setValueAdd(1);
                      setCount(count + valueAdd);
                    }}
                  >
                    Add
                  </Button>
                </Stack>
              </Card>
            </Card>
          </form>
        </TabPanel>
        <TabPanel value='rating'>
          <List
            aria-labelledby='ellipsis-list-demo'
            sx={{ "--ListItemDecorator-size": "56px" }}
          >
            {ratings.map((rating, index) => {
              return (
                <>
                  <ListItem key={index}>
                    <ListItemDecorator sx={{ alignSelf: "start" }}>
                      {rating?.customer?.imageUrl ? (
                        <Avatar
                          variant='outlined'
                          size='sm'
                          src={rating?.customer?.imageUrl}
                        />
                      ) : (
                        <Avatar variant='soft' size='sm'>
                          {rating?.customer?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                    </ListItemDecorator>
                    <ListItemContent>
                      <Typography level='title-sm'>
                        {rating.customer.username}
                      </Typography>
                      <Typography level='body-sm' noWrap>
                        {new Intl.DateTimeFormat("id-ID", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })
                          .format(new Date(rating.timestamp ?? ""))
                          .replace(" pukul", ", ")}
                      </Typography>
                      <Stack
                        direction='row'
                        spacing={0.2}
                        sx={{
                          alignItems: "center",
                        }}
                      >
                        <Rating
                          name='read-only'
                          size='small'
                          value={rating.rating}
                          precision={0.1}
                          readOnly
                        />
                        <Typography level='body-sm'>
                          {`    ${rating.rating} | ${getLabelText(
                            rating.rating ?? 0
                          )}`}
                        </Typography>
                      </Stack>
                      <Typography level='body-sm' noWrap>
                        {rating.review}
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                  <ListDivider inset='gutter' />
                </>
              );
            })}
          </List>
        </TabPanel>
      </Tabs>
    </>
  );
}

export default FormMenu;
