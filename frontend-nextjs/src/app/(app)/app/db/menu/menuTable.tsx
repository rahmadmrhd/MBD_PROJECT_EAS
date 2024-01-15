"use client";
/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { PaginationModel } from "@/src/utils/pagination-model";
import {
  Button,
  IconButton,
  Select,
  Typography,
  Sheet,
  Box,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Option,
  ModalDialog,
  ModalClose,
  Modal,
  Table,
  Chip,
  ColorPaletteProp,
  Stack,
  ButtonGroup,
  AspectRatio,
} from "@mui/joy";

import {
  Search,
  FilterAlt,
  CheckRounded,
  Block,
  Add,
  Close,
  Edit,
  Delete,
} from "@mui/icons-material";
import { Pagination, Rating } from "@mui/material";
import MenuServices from "@/src/resources/menu/menu-services";
import { ErrorToString } from "@/src/utils/error-types";
import MenuModel from "@/src/resources/menu/menu-model";
import { useUserContext } from "@/src/context/UserContext";
import LoaderModal from "@/src/components/Loading/LoaderModal";
import CategoryModel from "@/src/resources/category/category-model";
import { useQueryState } from "next-usequerystate";
import { usePathname } from "next/navigation";
import MyLink from "@/src/components/MyLink";
import EnhancedTableHead, {
  SortType,
} from "@/src/components/EnhancedTableHead";
import useAccessData from "@/src/utils/swr";

export default function MenuTable() {
  // const [order, setOrder] = React.useState<Order>("desc");
  // const [selected, setSelected] = React.useState<readonly string[]>([]);
  const user = useUserContext();
  const [openFilters, setOpenFilters] = React.useState(false);
  const [isAvailable, setIsAvailable] = useQueryState("available");
  const [category, setCategory] = useQueryState("category");
  const [sizePage, setSizePage] = React.useState<number>(10);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [sort, setSort] = React.useState<SortType>({
    order: "asc",
    orderBy: "id",
  });
  const pathname = usePathname();
  const [errorPage, setErrorPage] = React.useState<Error>();

  const { data: categories, error: errorCategories } =
    useAccessData<CategoryModel[]>(`/category`);
  const {
    data: menu,
    error: errorMenu,
    isLoading: loadingMenu,
    mutate: mutateMenu,
  } = useAccessData<PaginationModel<MenuModel>>(
    `/menu?page=${page}&pageSize=${sizePage}${
      category ? `&categoryName=${category}` : ""
    }${isAvailable ? `&isAvailable=${isAvailable}` : ""}${
      search ? `&search=${search}` : ""
    }${sort ? `&sort=${sort.orderBy}:${sort.order}` : ""}`
  );

  if (errorMenu) throw errorMenu;
  if (errorCategories) throw errorCategories;
  if (errorPage) throw errorPage;
  if (categories?.error) {
    setErrorPage(new Error(ErrorToString(categories.error)));
  }
  const dataCategories = categories?.data;
  const dataMenu = menu?.data;
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const deleteMenu = async (id: number) => {
    const { error } = await MenuServices.remove(user?.token as string, id);
    if (error) {
      setIsLoading(false);
      throw new Error(ErrorToString(error));
    }
    mutateMenu();
    setIsLoading(false);
  };
  const renderFilters = () => (
    <>
      <FormControl size='sm'>
        <FormLabel>Category</FormLabel>
        <Select
          size='sm'
          placeholder='All'
          defaultValue={null}
          value={category}
          onChange={(e, value) => {
            setCategory(value as string | null);
          }}
        >
          <Option value={null}>All</Option>
          {dataCategories?.map((category) => (
            <Option key={category.id} value={category.name}>
              {category.name}
            </Option>
          ))}
        </Select>
      </FormControl>
      <FormControl size='sm'>
        <FormLabel>Show</FormLabel>
        <Select
          size='sm'
          placeholder='10'
          defaultValue={sizePage}
          value={sizePage}
          onChange={(e, value) => {
            setSizePage(value as number);
          }}
        >
          <Option value={10}>10</Option>
          <Option value={20}>20</Option>
          <Option value={30}>30</Option>
          <Option value={50}>50</Option>
          <Option value={100}>100</Option>
        </Select>
      </FormControl>
      <FormControl size='sm'>
        <FormLabel>Available</FormLabel>
        <Select
          size='sm'
          placeholder='All'
          defaultValue={null}
          value={isAvailable?.toString()}
          onChange={(e, value) => {
            setIsAvailable(value as string | null);
          }}
        >
          <Option value={null}>All</Option>
          <Option value={"true"}>Available</Option>
          <Option value={"false"}>Not Available</Option>
        </Select>
      </FormControl>
    </>
  );

  const getLabelText = (value: number) => {
    if (value <= 1) return "Useless";
    if (value <= 2) return "Poor";
    if (value <= 3) return "Acceptable";
    if (value <= 4) return "Good";
    if (value <= 5) return "Excellent";
  };
  return (
    <>
      <LoaderModal open={isLoading || loadingMenu} />
      <Sheet
        className='SearchAndFilters-mobile'
        sx={{
          display: { xs: "flex", sm: "none" },
          my: 1,
          gap: 1,
        }}
      >
        <Button
          variant='solid'
          color='primary'
          size='sm'
          component={MyLink}
          href={`${pathname}/add`}
          startDecorator={<Add />}
          // onClick={() => setOpenFilters(true)}
        >
          Add
        </Button>
        <Input
          size='sm'
          placeholder='Search'
          value={search}
          startDecorator={<Search />}
          endDecorator={
            search && (
              <IconButton variant='plain' onClick={() => setSearch("")}>
                <Close />
              </IconButton>
            )
          }
          sx={{ flexGrow: 1 }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton
          size='sm'
          variant='outlined'
          color='neutral'
          onClick={() => setOpenFilters(true)}
        >
          <FilterAlt />
        </IconButton>
        <Modal open={openFilters} onClose={() => setOpenFilters(false)}>
          <ModalDialog aria-labelledby='filter-modal' layout='fullscreen'>
            <ModalClose />
            <Typography id='filter-modal' level='h2'>
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {renderFilters()}
              {/* <Sheet
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
              >
                <FormControl size='sm' sx={{ flexGrow: 2 }}>
                  <FormLabel>Sort by</FormLabel>
                  <Select size='sm' placeholder='Date'>
                    <Option value='date'>Date</Option>
                    <Option value='invoice'>Invoice</Option>
                    <Option value='status'>Status</Option>
                  </Select>
                </FormControl>
                <FormControl size='sm' sx={{ flexGrow: 1 }}>
                  <FormLabel> &#8203;</FormLabel>
                  <Select size='sm' placeholder='ASC'>
                    <Option value='asc'>ASC</Option>
                    <Option value='desc'>DESC</Option>
                  </Select>
                </FormControl>
              </Sheet> */}
              <Button color='success' onClick={() => setOpenFilters(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        // className='SearchAndFilters-tabletUp'
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "auto", xl: "160px" },
          },
        }}
      >
        <FormControl sx={{ width: 100, minWidth: "auto" }} size='sm'>
          <FormLabel>&#8203;</FormLabel>
          <Button
            variant='outlined'
            color='neutral'
            size='sm'
            startDecorator={<Add />}
            component={MyLink}
            href={`${pathname}/add`}
            // onClick={() => setOpenFilters(true)}
          >
            Add
          </Button>
        </FormControl>
        <FormControl sx={{ flex: 1 }} size='sm'>
          <FormLabel>Search for menu</FormLabel>
          <Input
            size='sm'
            placeholder='Search'
            value={search}
            startDecorator={<Search />}
            endDecorator={
              search && (
                <IconButton variant='plain' onClick={() => setSearch("")}>
                  <Close />
                </IconButton>
              )
            }
            onChange={(e) => setSearch(e.target.value)}
          />
        </FormControl>
        {renderFilters()}
      </Box>
      <Sheet
        className='OrderTableContainer'
        variant='outlined'
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby='tableTitle'
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
            "& tr > *:first-child": {
              position: "sticky",
              left: 0,
              boxShadow: "1px 0 var(--TableCell-borderColor)",
              bgcolor: "background.surface",
            },
          }}
        >
          <EnhancedTableHead
            sort={sort}
            setSort={setSort}
            headCells={[
              {
                id: "action",
                label: "Action",
                disableOrder: true,
                style: { width: 100, padding: "12px 6px" },
              },
              {
                id: "image",
                label: "",
                style: { width: 100, padding: "12px 6px" },
              },
              {
                id: "category",
                label: "Category",
                style: { width: 100, padding: "12px 6px" },
              },
              {
                id: "name",
                label: "Name",
                style: { width: 250, padding: "12px 6px" },
              },
              {
                id: "price",
                label: "Price",
                style: { width: 100, padding: "12px 6px" },
              },
              {
                id: "diskon",
                label: "Diskon",
                style: { width: 100, padding: "12px 6px" },
              },
              {
                id: "rating",
                label: "Rating",
                style: { width: 100, padding: "12px 6px" },
              },
              {
                id: "available",
                label: "Available",
                style: { width: 100, padding: "12px 6px" },
              },
            ]}
          />
          <tbody>
            {dataMenu?.rows &&
              dataMenu!.rows!.map((row, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <ButtonGroup size='sm'>
                        <Button
                          size='sm'
                          color='primary'
                          variant='solid'
                          component={MyLink}
                          href={`${pathname}/${row.id}`}
                        >
                          <Edit />
                        </Button>
                        <Button
                          size='sm'
                          color='danger'
                          variant='solid'
                          onClick={() => {
                            setIsLoading(true);
                            deleteMenu(row.id!);
                          }}
                        >
                          <Delete />
                        </Button>
                      </ButtonGroup>
                    </td>
                    <td>
                      <AspectRatio
                        ratio='1/1'
                        sx={{
                          width: 75,
                          borderRadius: "8%",
                          alignItems: "center",
                        }}
                      >
                        {/*eslint-disable-next-line @next/next/no-img-element*/}
                        <img
                          src={
                            row.image
                              ? `${process.env.NEXT_PUBLIC_API_URL}/files/${row.image}`
                              : "/empty.jpg"
                          }
                          loading='lazy'
                          alt=''
                        />
                      </AspectRatio>
                    </td>
                    <td>
                      <Typography level='body-md'>
                        {row.category?.name}
                      </Typography>
                    </td>
                    <td>
                      <Typography level='body-md'>{row.name}</Typography>
                      <Typography level='body-md'>{row.description}</Typography>
                    </td>
                    <td>
                      <Typography level='body-md'>{row.price}</Typography>
                    </td>
                    <td>
                      <Typography level='body-md'>{row.discount}</Typography>
                    </td>
                    <td>
                      {row.ratingCount ?? 0 > 0 ? (
                        <Stack direction='column' spacing={0.2}>
                          <Rating
                            name='read-only'
                            size='small'
                            value={row.rating}
                            precision={0.1}
                            readOnly
                          />
                          <Typography level='body-sm'>
                            {`${row.rating} | ${getLabelText(row.rating ?? 0)}`}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography level='body-md'>No Rating</Typography>
                      )}
                    </td>
                    <td style={{ textAlign: "center", width: 72 }}>
                      <Chip
                        variant='soft'
                        size='sm'
                        startDecorator={
                          {
                            true: <CheckRounded />,
                            false: <Block />,
                          }[(row.available ?? false).toString()]
                        }
                        color={
                          {
                            true: "success",
                            false: "danger",
                          }[
                            (row.available ?? false).toString()
                          ] as ColorPaletteProp
                        }
                      >
                        {row.available ? "Available" : "Not Available"}
                      </Chip>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Sheet>
      {(dataMenu?.pagination.total ?? 1) > 1 && (
        <Box
          // className='Pagination-tabletUp'
          sx={{ display: "flex", justifyContent: "space-around" }}
        >
          <Pagination
            count={dataMenu?.pagination.total ?? 1}
            page={dataMenu?.pagination.current ?? 1}
            onChange={(e, page) => {
              setPage(page);
            }}
            color='primary'
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </>
  );
}
