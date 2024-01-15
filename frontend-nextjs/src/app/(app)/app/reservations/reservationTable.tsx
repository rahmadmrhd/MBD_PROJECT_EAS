"use client";
/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import {
  ColorPaletteProp,
  Button,
  Chip,
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
  Avatar,
  Modal,
  Table,
} from "@mui/joy";

import {
  Search,
  FilterAlt,
  Close,
  TaskAltRounded,
  Add,
} from "@mui/icons-material";
import { Pagination, TableRow } from "@mui/material";
import EnhancedTableHead, {
  SortType,
} from "@/src/components/EnhancedTableHead";
import MyLink from "@/src/components/MyLink";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import { useQueryState } from "next-usequerystate";
import useAccessData from "@/src/utils/swr";
import { PaginationModel } from "@/src/utils/pagination-model";
import ReservationModel from "@/src/resources/reservation/reservation-model";
import { ErrorToString } from "@/src/utils/error-types";
import { formatPhoneNumber } from "@/src/utils/formatter";

export default function ReservationTable() {
  const pathname = usePathname();
  const [openFilters, setOpenFilters] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = useQueryState("status");
  const [sizePage, setSizePage] = React.useState<number>(10);
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState<SortType>({
    order: "desc",
    orderBy: "timestamp",
  });
  const [errorPage, setErrorPage] = React.useState<Error>();

  const { data, error } = useAccessData<PaginationModel<ReservationModel>>(
    `/reservation?page=${page}&pageSize=${sizePage}${
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

  const dataReservation = data?.data;
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
          placeholder='Filter by status'
          value={status}
          onChange={(e, value) => {
            setStatus(value as string | null);
          }}
        >
          <Option value={null}>All</Option>
          <Option value='waiting_confirmation'>Waiting Confirmation</Option>
          <Option value='confirmed'>Confirmed</Option>
          <Option value='canceled'>Canceled</Option>
        </Select>
      </FormControl>
    </>
  );
  return (
    <>
      <Sheet
        className='SearchAndFilters-mobile'
        sx={{
          display: { xs: "flex", sm: "none" },
          my: 1,
          gap: 1,
        }}
      >
        <Input
          size='sm'
          placeholder='Search'
          startDecorator={<Search />}
          sx={{ flexGrow: 1 }}
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
        className='SearchAndFilters-tabletUp'
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "auto", md: "160px" },
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
        className='ReservationTableContainer'
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
          }}
        >
          <EnhancedTableHead
            sort={sort}
            setSort={setSort}
            headCells={[
              // {
              //   id: "action",
              //   label: "Action",
              //   disableReservation: true,
              //   style: { width: 70, padding: "12px 6px" },
              // },
              {
                id: "orderCode",
                label: "ID Reservation",
                style: { width: 90, padding: "12px 6px" },
              },
              {
                id: "timestamp",
                label: "Reservation Time",
                style: { width: 100, padding: "12px 6px" },
              },
              {
                id: "tableName",
                label: "Table",
                style: { width: 70, padding: "12px 6px" },
              },
              {
                id: "customerName",
                label: "Customer",
                style: { width: 150, padding: "12px 6px" },
              },
              {
                id: "totalGuest",
                label: "Total Guest",
                style: { width: 50, padding: "12px 6px" },
              },
              {
                id: "status",
                label: "Status",
                style: { width: 100, padding: "12px 6px" },
              },
            ]}
          />
          <tbody>
            {dataReservation?.rows?.map((row) => (
              <TableRow
                key={row.id}
                component={MyLink}
                href={`/app/reservations/${row.id}`}
                // onClick={(e) => {
                //   e.preventDefault();
                //   router.push(`/app/reservations/${row.id}`);
                // }}
              >
                {/* <td>
                  <IconButton
                    aria-label='expand row'
                    variant='plain'
                    color='neutral'
                    size='sm'
                    onClick={() => setOpenFilters(!openFilters)}
                  >
                    {openFilters ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </td> */}
                <td>
                  <Typography level='body-xs'>{row.reservationCode}</Typography>
                </td>
                <td>
                  <Typography level='body-xs'>
                    {new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "full",
                    }).format(new Date(row.timestamp ?? ""))}
                  </Typography>
                  <Typography level='body-xs'>
                    {new Intl.DateTimeFormat("id-ID", {
                      timeStyle: "short",
                    }).format(new Date(row.timestamp ?? ""))}
                  </Typography>
                </td>
                <td>
                  <Typography level='body-xs'>{row.tableName}</Typography>
                </td>
                <td>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    {row.customer?.imageUrl ? (
                      <Avatar
                        variant='outlined'
                        size='sm'
                        src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286'
                      />
                    ) : (
                      <Avatar variant='soft' size='sm'>
                        {row.customer?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                    <div>
                      <Typography level='body-xs'>
                        {row.customer?.name}
                      </Typography>
                      <Typography level='body-xs'>
                        {formatPhoneNumber(row.customer?.noTelp ?? "")}
                      </Typography>
                    </div>
                  </Box>
                </td>
                <td>
                  <Typography level='body-xs'>{row.totalGuests}</Typography>
                </td>
                <td>
                  <Chip
                    variant='soft'
                    size='sm'
                    startDecorator={
                      {
                        ["Waiting Confirmation"]: (
                          <Icon icon='fluent-mdl2:date-time' width={24} />
                        ),
                        ["Confirmed"]: <TaskAltRounded />,
                        ["Canceled"]: <Close />,
                      }[row.status ?? ""]
                    }
                    color={
                      {
                        ["Waiting Confirmation"]: "warning",
                        ["Confirmed"]: "success",
                        ["Canceled"]: "danger",
                      }[row.status ?? ""] as ColorPaletteProp
                    }
                  >
                    {row.status}
                  </Chip>
                </td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Sheet>
      {/* <Box sx={{ display: { xs: "block", sm: "none" } }}>
        {rows.map((item) => (
          <List
            key={item.id}
            size='sm'
            sx={{
              "--ListItem-paddingX": 0,
            }}
          >
            <ListItem
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <ListItemContent
                sx={{ display: "flex", gap: 2, alignItems: "start" }}
              >
                <ListItemDecorator>
                  <Avatar size='sm'>{item.customer.initial}</Avatar>
                </ListItemDecorator>
                <div>
                  <Typography fontWeight={600} gutterBottom>
                    {item.customer.name}
                  </Typography>
                  <Typography level='body-xs' gutterBottom>
                    {item.customer.email}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    <Typography level='body-xs'>{item.date}</Typography>
                    <Typography level='body-xs'>&bull;</Typography>
                    <Typography level='body-xs'>{item.id}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Link level='body-sm' component='button'>
                      Download
                    </Link>
                    <RowMenu />
                  </Box>
                </div>
              </ListItemContent>
              <Chip
                variant='soft'
                size='sm'
                startDecorator={
                  {
                    Paid: <CheckRounded />,
                    Refunded: <AutorenewRounded />,
                    Cancelled: <Block />,
                  }[item.status]
                }
                color={
                  {
                    Paid: "success",
                    Refunded: "neutral",
                    Cancelled: "danger",
                  }[item.status] as ColorPaletteProp
                }
              >
                {item.status}
              </Chip>
            </ListItem>
            <ListDivider />
          </List>
        ))}
      </Box> */}
      {(dataReservation?.pagination.total ?? 1) > 1 && (
        <Box
          // className='Pagination-tabletUp'
          sx={{ display: "flex", justifyContent: "space-around" }}
        >
          <Pagination
            count={dataReservation?.pagination.total ?? 1}
            page={dataReservation?.pagination.current ?? 1}
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
