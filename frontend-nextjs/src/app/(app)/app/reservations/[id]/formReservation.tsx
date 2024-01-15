/* eslint-disable @next/next/no-img-element */
"use client";
import {
  TaskAltRounded,
  CalendarMonthRounded,
  Close,
} from "@mui/icons-material";
import {
  Card,
  Divider,
  Stack,
  Grid,
  Stepper,
  stepClasses,
  stepIndicatorClasses,
  Step,
  StepIndicator,
  Typography,
  Box,
  Avatar,
} from "@mui/joy";
import { Button, ButtonGroup } from "@mui/joy";
import React from "react";
import { useUserContext } from "@/src/context/UserContext";
import { ErrorToString } from "@/src/utils/error-types";

import LoaderModal from "@/src/components/Loading/LoaderModal";
import ReservationServices from "@/src/resources/reservation/reservation-services";
import { useBreadcrumbsContext } from "@/src/context/BreadcrumbsContext";
import ReservationModel from "@/src/resources/reservation/reservation-model";
import { Icon } from "@iconify/react/dist/iconify.js";
import useAccessData from "@/src/utils/swr";
import { formatPhoneNumber } from "@/src/utils/formatter";

function FormReservation({ idReservation }: { idReservation?: number }) {
  const user = useUserContext();
  const [loading, setLoading] = React.useState(false);
  const isEdit = !!idReservation;
  const useBreadcrumbs = useBreadcrumbsContext();
  const [errorPage, setErrorPage] = React.useState<Error>();
  const { data, error, isLoading, mutate } = useAccessData<ReservationModel>(
    `/reservation/${idReservation}`,
    isEdit
  );
  if (error) throw error;
  if (errorPage) throw errorPage;

  const dataReservation = data?.data;

  React.useEffect(() => {
    if (dataReservation) {
      useBreadcrumbs.setReplace({
        searchValue: `reservations/${idReservation}`,
        replaceValue: `reservations/${dataReservation?.reservationCode}:force`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataReservation]);

  if (data?.error) {
    setErrorPage(new Error(ErrorToString(data.error)));
  }

  const changeStatus = async (status: "CONFIRMED" | "CANCELED") => {
    setLoading(true);
    const { data, error } = await ReservationServices.changeStatus(
      idReservation as number,
      status,
      user?.token
    );
    setLoading(false);
    if (error) throw error;
    if (data) {
      mutate();
    }
  };

  const getListStep = (current: string) => {
    const status = [
      {
        status: "WAITING_CONFIRMATION",
        icon: <CalendarMonthRounded />,
      },
      {
        status: "CONFIRMED",
        icon: <TaskAltRounded />,
      },
    ];
    if (current === "CANCELED") {
      return (
        <Stepper
          size='lg'
          sx={{
            minWidth: { xs: "auto", sm: "450px" },
            width: { xs: "100%", sm: "60%", md: "40%" },
            "--StepIndicator-size": "48px",
            "--Step-connectorInset": "0px",
            "--Step-connectorThickness": "4px",
            [`& .${stepIndicatorClasses.root}`]: {
              borderWidth: 4,
            },
            [`& .${stepClasses.root}::after`]: {
              height: 4,
            },
            [`& .${stepClasses.completed}`]: {
              [`& .${stepIndicatorClasses.root}`]: {
                borderColor: "primary.500",
              },
              "&::after": {
                background:
                  "linear-gradient(to right, #0b6bcb, #EE77F664, #c41c1c)",
              },
            },
          }}
        >
          <Step
            completed
            orientation='vertical'
            indicator={
              <StepIndicator variant='solid' color='primary'>
                <Icon icon='fluent-mdl2:reservation-orders' />
              </StepIndicator>
            }
          />
          <Step
            orientation='vertical'
            active
            indicator={
              <StepIndicator variant='solid' color='danger'>
                <Close />
              </StepIndicator>
            }
          >
            <Typography
              sx={{
                textTransform: "uppercase",
                fontWeight: "lg",
                fontSize: "0.75rem",
                letterSpacing: "0.5px",
              }}
            >
              CANCELED
            </Typography>
          </Step>
        </Stepper>
      );
    }

    if (!current) {
      return (
        <Stepper
          size='lg'
          sx={{
            minWidth: { xs: "auto", sm: "450px" },
            width: { xs: "100%", sm: "60%", md: "40%" },
            "--StepIndicator-size": "48px",
            "--Step-connectorInset": "0px",
            "--Step-connectorThickness": "4px",
            [`& .${stepIndicatorClasses.root}`]: {
              borderWidth: 4,
            },
            [`& .${stepClasses.root}::after`]: {
              height: 4,
            },
            [`& .${stepClasses.completed}`]: {
              [`& .${stepIndicatorClasses.root}`]: {
                borderColor: "primary.500",
              },
              "&::after": {
                bgcolor: "primary.500",
              },
            },
            [`& .${stepClasses.active}`]: {
              [`& .${stepIndicatorClasses.root}`]: {
                borderColor: "currentColor",
              },
              "&::after": {
                bgcolor: "primary.300",
              },
            },
            [`& .${stepClasses.disabled} *`]: {
              color: "neutral.outlinedDisabledColor",
            },
          }}
        >
          <Step
            completed
            orientation='vertical'
            indicator={
              <StepIndicator variant='solid' color='primary'>
                <Icon icon='fluent-mdl2:reservation-orders' />
              </StepIndicator>
            }
          />
          {status.map((item) => (
            <Step
              key={item.status}
              disabled
              orientation='vertical'
              indicator={
                <StepIndicator variant='outlined' color='neutral'>
                  {item.icon}
                </StepIndicator>
              }
            />
          ))}
        </Stepper>
      );
    }
    const indexStatus = status.findIndex((s) => s.status === current);

    const listComplated = status.slice(0, indexStatus).map((item) => (
      <Step
        key={item.status}
        completed
        orientation='vertical'
        indicator={
          <StepIndicator variant='solid' color='primary'>
            {item.icon}
          </StepIndicator>
        }
      />
    ));
    const listNotComplated = status.slice(indexStatus + 1).map((item) => (
      <Step
        key={item.status}
        disabled
        orientation='vertical'
        indicator={
          <StepIndicator variant='outlined' color='neutral'>
            {item.icon}
          </StepIndicator>
        }
      />
    ));

    return (
      <Stepper
        size='lg'
        sx={{
          minWidth: { xs: "auto", sm: "450px" },
          width: { xs: "100%", sm: "60%", md: "40%" },
          "--StepIndicator-size": "48px",
          "--Step-connectorInset": "0px",
          "--Step-connectorThickness": "4px",
          [`& .${stepIndicatorClasses.root}`]: {
            borderWidth: 4,
          },
          [`& .${stepClasses.root}::after`]: {
            height: 4,
          },
          [`& .${stepClasses.completed}`]: {
            [`& .${stepIndicatorClasses.root}`]: {
              borderColor: "primary.500",
            },
            "&::after": {
              bgcolor: "primary.500",
            },
          },
          [`& .${stepClasses.active}`]: {
            [`& .${stepIndicatorClasses.root}`]: {
              borderColor: "currentColor",
            },
            "&::after": {
              bgcolor: "primary.300",
            },
          },
          [`& .${stepClasses.disabled} *`]: {
            color: "neutral.outlinedDisabledColor",
          },
        }}
      >
        <Step
          completed
          orientation='vertical'
          indicator={
            <StepIndicator variant='solid' color='primary'>
              <Icon icon='fluent-mdl2:reservation-orders' />
            </StepIndicator>
          }
        />
        {...listComplated}
        {current != "CONFIRMED" ? (
          <Step
            orientation='vertical'
            active
            indicator={
              <StepIndicator variant='outlined' color='primary'>
                <Icon
                  icon='eos-icons:three-dots-loading'
                  width='24'
                  height='24'
                />
              </StepIndicator>
            }
          >
            <Typography
              sx={{
                display: { xs: "none", sm: "inline" },
                textAlign: "center",
                textTransform: "uppercase",
                fontWeight: "lg",
                fontSize: "12px",
              }}
            >
              {current.toUpperCase().replace("_", " ")}
            </Typography>
          </Step>
        ) : (
          <Step
            completed
            orientation='vertical'
            indicator={
              <StepIndicator variant='solid' color='primary'>
                <TaskAltRounded />
              </StepIndicator>
            }
          />
        )}
        {...listNotComplated}
      </Stepper>
    );
  };

  return (
    <>
      {(!data || isLoading || loading) && <LoaderModal open={true} />}
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
        {(dataReservation?.status == "WAITING_CONFIRMATION" ||
          dataReservation?.status == "IN_PROCESS") && (
          <ButtonGroup>
            <Button
              startDecorator={<TaskAltRounded />}
              color='success'
              variant='solid'
              onClick={() => {
                changeStatus("CONFIRMED");
              }}
            >
              Confirm
            </Button>
            <Button
              startDecorator={<Close />}
              color='danger'
              variant='solid'
              onClick={() => {
                changeStatus("CANCELED");
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        )}
        <Divider sx={{ mt: 1 }} />
      </Stack>
      <Card>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          gap={{ xs: 2, lg: 0 }}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "center", lg: "flex-start" },
          }}
        >
          <Stack>
            <Typography level='h3' sx={{ mt: 1 }}>
              #{dataReservation?.reservationCode}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", my: 1 }}>
              {dataReservation?.customer?.imageUrl ? (
                <Avatar
                  variant='outlined'
                  size='sm'
                  src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286'
                />
              ) : (
                <Avatar variant='soft' size='sm'>
                  {dataReservation?.customer?.name?.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <div>
                <Typography level='body-xs'>
                  {dataReservation?.customer?.name}
                </Typography>
                <Typography level='body-xs'>
                  {formatPhoneNumber(dataReservation?.customer?.noTelp ?? "")}
                </Typography>
              </div>
            </Box>
          </Stack>

          {getListStep(dataReservation?.status ?? "")}
          <Typography
            sx={{
              display: { xs: "inline", sm: "none" },
              textAlign: "center",
              textTransform: "uppercase",
              fontWeight: "lg",
              fontSize: "12px",
            }}
          >
            {(dataReservation?.status ?? "").toUpperCase().replace("_", " ")}
          </Typography>
        </Stack>
        <Divider />
        <Grid
          container
          sx={{
            margin: 0,
            mt: 1,
            width: "100%",
            "--Grid-borderWidth": "1px",
            borderTop: "var(--Grid-borderWidth) solid",
            borderLeft: "var(--Grid-borderWidth) solid",
            borderColor: "divider",
            "& > div": {
              borderRight: "var(--Grid-borderWidth) solid",
              borderBottom: "var(--Grid-borderWidth) solid",
              borderColor: "divider",
            },
          }}
          spacing={{ xs: 1, md: 3 }}
        >
          <Grid
            xs={12}
            md={6}
            sx={{
              px: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography level='body-sm'>Reservation Time</Typography>
            {dataReservation?.timestamp && (
              <Typography level='body-xs'>
                {new Intl.DateTimeFormat("id-ID", {
                  dateStyle: "full",
                  timeStyle: "short",
                })
                  .format(new Date(dataReservation?.datetime ?? ""))
                  .replace(" pukul", ", ")}
              </Typography>
            )}
          </Grid>
          <Grid
            xs={12}
            md={6}
            sx={{
              px: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography level='body-sm'>Created at</Typography>
            {dataReservation?.timestamp && (
              <Typography level='body-xs'>
                {new Intl.DateTimeFormat("id-ID", {
                  dateStyle: "full",
                  timeStyle: "short",
                })
                  .format(new Date(dataReservation?.timestamp ?? ""))
                  .replace(" pukul", ", ")}
              </Typography>
            )}
          </Grid>
          <Grid
            xs={12}
            md={6}
            sx={{
              px: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography level='body-sm'>Table</Typography>
            <Typography level='body-sm'>
              {dataReservation?.tableName}
            </Typography>
          </Grid>
          <Grid
            xs={12}
            md={6}
            sx={{
              px: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography level='body-sm'>Total Guests</Typography>
            <Typography level='body-sm'>
              {dataReservation?.totalGuests}
            </Typography>
          </Grid>
          {dataReservation?.note && (
            <Grid
              xs={12}
              sx={{
                px: 2,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              spacing={6}
            >
              <Typography level='title-sm' sx={{ mr: "47.5%" }}>
                Note
              </Typography>
              {/* <Divider /> */}
              <Typography level='title-sm' sx={{ textAlign: "right" }}>
                {dataReservation?.note}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Card>
    </>
  );
}

export default FormReservation;
