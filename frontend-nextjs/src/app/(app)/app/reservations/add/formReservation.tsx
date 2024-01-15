/* eslint-disable @next/next/no-img-element */
"use client";
import { SaveRounded, Cancel, InfoOutlined } from "@mui/icons-material";
import {
  Card,
  Divider,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Grid,
  Textarea,
  Select,
  Option,
  FormHelperText,
} from "@mui/joy";
import { Button, ButtonGroup } from "@mui/joy";
import React from "react";
import { useUserContext } from "@/src/context/UserContext";
import { ErrorToString } from "@/src/utils/error-types";

import ReservationServices from "@/src/resources/reservation/reservation-services";
import { useRouter } from "next/navigation";
import { useBreadcrumbsContext } from "@/src/context/BreadcrumbsContext";
import MyLink from "@/src/components/MyLink";
import ReservationModel from "@/src/resources/reservation/reservation-model";
import useAccessData from "@/src/utils/swr";
import TableModel from "@/src/resources/table/table-model";
import LoaderModal from "@/src/components/Loading/LoaderModal";
import { PhoneFormatAdapter } from "@/src/utils/formatter";

function FormReservation() {
  const user = useUserContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [dataReservation, setDataReservation] =
    React.useState<ReservationModel>({} as ReservationModel);
  const useBreadcrumbs = useBreadcrumbsContext();
  const [errorPage, setErrorPage] = React.useState<Error>();
  // const pathname = usePathname();
  const { data, error } = useAccessData<TableModel[]>("/table");

  if (error) throw error;
  if (errorPage) throw errorPage;
  const tables = data?.data ?? [];
  if (data?.error) {
    setErrorPage(new Error(ErrorToString(data.error)));
  }
  React.useEffect(() => {
    useBreadcrumbs.setReplace({
      searchValue: `reservations/add`,
      replaceValue: `reservations/New Reservation:force`,
    });
  }, []);

  const onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDataReservation({ ...dataReservation, [e.target.name]: e.target.value });
  };
  const createRequest = async () => {
    try {
      const { data, error } = await ReservationServices.create(
        user?.token as string,
        dataReservation
      );
      if (data) {
        router.replace(`/app/reservations/${data.id}`);
      }
      if (error) {
        throw new Error(ErrorToString(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoaderModal open={isLoading} />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          await createRequest();
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
              startDecorator={<SaveRounded />}
              color='primary'
              variant='solid'
              type={"submit"}
            >
              Save
            </Button>
            <Button
              startDecorator={<Cancel />}
              color='danger'
              variant='solid'
              component={MyLink}
              href='/app/reservations'
            >
              Cancel
            </Button>
          </ButtonGroup>
          <Divider sx={{ mt: 1 }} />
        </Stack>
        <Card>
          <Grid container spacing={2} sx={{ my: 1, flexGrow: 1 }}>
            <Grid xs={12} md={6}>
              <FormControl
                required
                sx={{
                  minWidth: "100px",
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <FormLabel>Customer Name</FormLabel>
                <Input
                  type='text'
                  size='sm'
                  onChange={onChangeInput}
                  name='customerName'
                  value={dataReservation.customerName}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl
                required
                sx={{
                  minWidth: "100px",
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <FormLabel>Customer Phone</FormLabel>
                <Input
                  size='sm'
                  placeholder='081-2345-6789'
                  onChange={onChangeInput}
                  name='customerNoTelp'
                  slotProps={{
                    input: {
                      component: PhoneFormatAdapter,
                    },
                  }}
                  value={dataReservation.customerNoTelp}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl
                required
                sx={{
                  minWidth: "100px",
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <FormLabel>Reservation Date</FormLabel>
                <Input
                  type='datetime-local'
                  size='sm'
                  onChange={onChangeInput}
                  name='datetime'
                  value={dataReservation.datetime}
                  slotProps={{
                    input: {
                      min: "2023-01-01",
                      max: `${new Date().getUTCFullYear() + 2}-12-31`,
                    },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl
                required
                sx={{
                  minWidth: "100px",
                  width: { xs: "100%", md: "auto" },
                }}
                color={
                  (dataReservation?.totalGuests ?? 0) >
                  (tables.find((table) => table.id === dataReservation.tableId)
                    ?.capacity ?? 0)
                    ? "warning"
                    : "neutral"
                }
              >
                <FormLabel>Total Guests</FormLabel>
                <Input
                  type='number'
                  size='sm'
                  onChange={onChangeInput}
                  name='totalGuests'
                  value={dataReservation.totalGuests}
                  slotProps={{
                    input: {
                      // ref: inputRef,
                      min: 0,
                      step: 1,
                    },
                  }}
                />
                {(dataReservation?.totalGuests ?? 0) >
                  (tables.find((table) => table.id === dataReservation.tableId)
                    ?.capacity ?? 0) && (
                  <FormHelperText>
                    <InfoOutlined />
                    The number of guests exceeds capacity
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl
                required
                sx={{
                  minWidth: "100px",
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <FormLabel>Table</FormLabel>
                <Select
                  required
                  size='sm'
                  placeholder='-- Select Table--'
                  value={dataReservation?.tableId}
                  onChange={(e, value) => {
                    setDataReservation((prev) => ({
                      ...prev,
                      tableId: value as number,
                    }));
                  }}
                >
                  {tables?.map((table) => (
                    <Option key={table.id} value={table.id}>
                      {table.name} (capacity : {table.capacity})
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <FormControl
                sx={{
                  minWidth: "100px",
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <FormLabel>Note</FormLabel>
                <Textarea
                  minRows={5}
                  maxRows={7}
                  size='sm'
                  onChange={(e) => onChangeInput(e)}
                  name='note'
                  value={dataReservation.note}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Card>
      </form>
    </>
  );
}

export default FormReservation;
