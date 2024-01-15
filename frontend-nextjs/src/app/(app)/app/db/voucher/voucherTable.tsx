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
  ButtonGroup,
} from "@mui/joy";

import {
  Search,
  FilterAlt,
  CheckRounded,
  Block,
  Add,
  Close,
  Edit,
  // eslint-disable-next-line no-unused-vars
  Delete,
} from "@mui/icons-material";
import { Pagination } from "@mui/material";
import VoucherModel from "@/src/resources/voucher/voucher-model";
import LoaderModal from "@/src/components/Loading/LoaderModal";
import { useQueryState } from "next-usequerystate";
import { usePathname } from "next/navigation";
import MyLink from "@/src/components/MyLink";
import { ErrorToString } from "@/src/utils/error-types";
import EnhancedTableHead, {
  SortType,
} from "@/src/components/EnhancedTableHead";
import useAccessData from "@/src/utils/swr";

export default function VoucherTable() {
  // const [order, setOrder] = React.useState<Order>("desc");
  // const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [openFilters, setOpenFilters] = React.useState(false);
  const [status, setStatus] = useQueryState("status");
  const [sizePage, setSizePage] = React.useState<number>(10);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<SortType>({
    order: "asc",
    orderBy: "id",
  });
  const pathname = usePathname();
  const [errorPage, setErrorPage] = React.useState<Error>();

  const { data, error, isLoading } = useAccessData<
    PaginationModel<VoucherModel>
  >(
    `/voucher?page=${page}&pageSize=${sizePage}${
      status ? `&status=${status}` : ""
    }${search ? `&search=${search}` : ""}${
      sort ? `&sort=${sort.orderBy}:${sort.order}` : ""
    }`
  );

  if (error) throw error;
  if (errorPage) throw errorPage;
  if (data?.error) {
    setErrorPage(new Error(ErrorToString(data.error)));
  }
  const dataVoucher = data?.data;
  //eslint-disable-next-line react-hooks/exhaustive-deps
  // React.useMemo(() => getVoucher(), [search]);

  // eslint-disable-next-line no-unused-vars
  // const deleteVoucher = async (id: number) => {
  //   const { error } = await VoucherServices.remove(user?.token as string, id);
  //   if (error) {
  //     setIsLoading(false);
  //     throw new Error(ErrorToString(error));
  //   }
  //   await getVoucher();
  //   setIsLoading(false);
  // };

  const renderFilters = () => (
    <>
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
        <FormLabel>Status</FormLabel>
        <Select
          size='sm'
          placeholder='All'
          defaultValue={null}
          value={status?.toString()}
          onChange={(e, value) => {
            setStatus(value as string | null);
          }}
        >
          <Option value={null}>All</Option>
          <Option value={"Available"}>Available</Option>
          <Option value={"Expired"}>Expired</Option>
          <Option value={"Sold Out"}>Sold Out</Option>
        </Select>
      </FormControl>
    </>
  );
  return (
    <>
      <LoaderModal open={isLoading} />
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
          <FormLabel>Search for Voucher</FormLabel>
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
                id: "id",
                label: "Action",
                disableOrder: true,
                style: { width: 45, padding: "12px 6px" },
              },
              {
                id: "code",
                label: "Code",
                style: { width: 70, padding: "12px 6px" },
              },
              {
                id: "description",
                label: "Description",
                style: { width: 100, padding: "12px 6px" },
              },
              {
                id: "detail",
                label: "Detail",
                disableOrder: true,
                style: { width: 130, padding: "12px 6px" },
              },
              {
                id: "qty",
                label: "Qty",
                disableOrder: true,
                style: { width: 70, padding: "12px 6px" },
              },
              {
                id: "expired_at",
                label: "Date Expired",
                style: { width: 120, padding: "12px 6px" },
              },
              {
                id: "status",
                label: "Status",
                style: { width: 100, padding: "12px 6px" },
              },
            ]}
          />
          <tbody>
            {dataVoucher?.rows &&
              dataVoucher!.rows!.map((row, index) => {
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
                        {/* <Button
                          size='sm'
                          color='danger'
                          variant='solid'
                          onClick={() => {
                            setIsLoading(true);
                            deleteVoucher(row.id!);
                          }}
                        >
                          <Delete />
                        </Button> */}
                      </ButtonGroup>
                    </td>
                    <td>
                      <Typography level='body-xs'>{row.code}</Typography>
                    </td>
                    <td>
                      <Typography level='body-xs'>{row.description}</Typography>
                    </td>
                    <td>
                      <Typography level='body-xs'>{`Discount     : ${row.discount}`}</Typography>
                      <Typography level='body-xs'>{`Min Purchase : ${row.minPurchase}`}</Typography>
                      <Typography level='body-xs'>{`Max Discount : ${row.maxDiscount}`}</Typography>
                    </td>
                    <td>
                      <Typography level='body-xs'>{`${row.used} of ${row.qty} used`}</Typography>
                    </td>
                    <td>
                      <Typography level='body-xs'>
                        {new Intl.DateTimeFormat("id-ID", {
                          dateStyle: "full",
                        }).format(new Date(row.expiredAt ?? ""))}
                      </Typography>
                      <Typography level='body-xs'>
                        {new Intl.DateTimeFormat("id-ID", {
                          timeStyle: "short",
                        }).format(new Date(row.expiredAt ?? ""))}
                      </Typography>
                    </td>
                    <td>
                      <Chip
                        variant='soft'
                        size='sm'
                        startDecorator={
                          {
                            ["Available"]: <CheckRounded />,
                            ["Sold Out"]: <Block />,
                            ["Expired"]: <Block />,
                          }[row.status ?? ""]
                        }
                        color={
                          {
                            ["Available"]: "success",
                            ["Sold Out"]: "danger",
                            ["Expired"]: "danger",
                          }[row.status ?? ""] as ColorPaletteProp
                        }
                      >
                        {row.status}
                      </Chip>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Sheet>
      {(dataVoucher?.pagination.total ?? 1) > 1 && (
        <Box
          // className='Pagination-tabletUp'
          sx={{ display: "flex", justifyContent: "space-around" }}
        >
          <Pagination
            count={dataVoucher?.pagination.total ?? 1}
            page={dataVoucher?.pagination.current ?? 1}
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
