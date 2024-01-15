"use client";

import EnhancedTableHead from "@/src/components/EnhancedTableHead";
import LoaderModal from "@/src/components/Loading/LoaderModal";
import MyLink from "@/src/components/MyLink";
import { useBreadcrumbsContext } from "@/src/context/BreadcrumbsContext";
import { useUserContext } from "@/src/context/UserContext";
import OrderModel from "@/src/resources/order/order-model";
import OrderServices from "@/src/resources/order/order-services";
import { ErrorToString } from "@/src/utils/error-types";
import { formatPhoneNumber } from "@/src/utils/formatter";
import useAccessData from "@/src/utils/swr";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Close,
  OpenInNew,
  Task,
  TaskAlt,
  TaskAltRounded,
} from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  Stack,
  Typography,
  Stepper,
  StepIndicator,
  Step,
  stepClasses,
  stepIndicatorClasses,
  Grid,
  Box,
  Avatar,
  Table,
  Sheet,
  AspectRatio,
  IconButton,
} from "@mui/joy";
import { Rating } from "@mui/material";
import React, { useEffect } from "react";

function FormOrder({ idOrder }: { idOrder?: number }) {
  const user = useUserContext();
  const useBreadcrumbs = useBreadcrumbsContext();
  const [loading, setLoading] = React.useState(false);
  const [errorPage, setErrorPage] = React.useState<Error>();
  const { data, error, isLoading, mutate } = useAccessData<OrderModel>(
    `/order/${idOrder}`
  );
  if (error) throw error;
  if (errorPage) throw errorPage;

  const dataOrder = data?.data;

  useEffect(() => {
    if (dataOrder) {
      useBreadcrumbs.setReplace({
        searchValue: `orders/${idOrder}`,
        replaceValue: `orders/${dataOrder?.orderCode}:force`,
      });
    }
  }, [dataOrder]);

  if (data?.error) {
    setErrorPage(new Error(ErrorToString(data.error)));
  }

  const changeStatus = async (status: "IN_PROCESS" | "DONE" | "CANCELED") => {
    setLoading(true);
    const { data, error } = await OrderServices.changeStatus(
      idOrder as number,
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
        icon: <Icon icon='mingcute:task-fill' width='24' height='24' />,
      },
      {
        status: "IN_PROCESS",
        icon: <Icon icon='icon-park-solid:cooking' width='24' height='24' />,
      },
      {
        status: "DONE",
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
                <Icon icon='mingcute:task-2-fill' width='24' />
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
                <Icon icon='mingcute:task-2-fill' width='24' />
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
              <Icon icon='mingcute:task-2-fill' width='24' />
            </StepIndicator>
          }
        />
        {...listComplated}
        {current != "DONE" ? (
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
  const getLabelText = (value: number) => {
    if (value <= 1) return "Useless";
    if (value <= 2) return "Poor";
    if (value <= 3) return "Acceptable";
    if (value <= 4) return "Good";
    if (value <= 5) return "Excellent";
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
        {(dataOrder?.status == "WAITING_CONFIRMATION" ||
          dataOrder?.status == "IN_PROCESS") && (
          <ButtonGroup>
            <Button
              startDecorator={
                dataOrder?.status == "WAITING_CONFIRMATION" ? (
                  <Task />
                ) : dataOrder?.status == "IN_PROCESS" ? (
                  <TaskAlt />
                ) : undefined
              }
              color={
                dataOrder?.status == "WAITING_CONFIRMATION"
                  ? "primary"
                  : "success"
              }
              variant='solid'
              onClick={() => {
                changeStatus(
                  dataOrder?.status == "WAITING_CONFIRMATION"
                    ? "IN_PROCESS"
                    : "DONE"
                );
              }}
            >
              {dataOrder?.status == "WAITING_CONFIRMATION"
                ? "Take Order"
                : dataOrder?.status == "IN_PROCESS"
                ? "Done Order"
                : ""}
            </Button>
            {dataOrder?.status == "WAITING_CONFIRMATION" && (
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
            )}
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
          <Typography level='h3' sx={{ mt: 1 }}>
            #{dataOrder?.orderCode}
          </Typography>

          {getListStep(dataOrder?.status ?? "")}
          <Typography
            sx={{
              display: { xs: "inline", sm: "none" },
              textAlign: "center",
              textTransform: "uppercase",
              fontWeight: "lg",
              fontSize: "12px",
            }}
          >
            {(dataOrder?.status ?? "").toUpperCase().replace("_", " ")}
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
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography level='body-sm'>Customer</Typography>
            <Divider sx={{ my: 1, display: { xs: "block", md: "none" } }} />
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", my: 1 }}>
              {dataOrder?.customer?.imageUrl ? (
                <Avatar
                  variant='outlined'
                  size='sm'
                  src={dataOrder?.customer?.imageUrl}
                />
              ) : (
                <Avatar variant='soft' size='sm'>
                  {dataOrder?.customer?.name?.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <div>
                <Typography level='body-xs'>
                  {dataOrder?.customer?.name}
                </Typography>
                <Typography level='body-xs'>
                  {formatPhoneNumber(dataOrder?.customer?.noTelp)}
                </Typography>
              </div>
            </Box>
          </Grid>
          <Grid
            xs={12}
            md={6}
            sx={{
              px: 2,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography level='body-sm'>Employee</Typography>
            <Divider sx={{ my: 1, display: { xs: "block", md: "none" } }} />
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", my: 1 }}>
              {dataOrder?.employee?.imageUrl ? (
                <Avatar
                  variant='outlined'
                  size='sm'
                  src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286'
                />
              ) : (
                <Avatar variant='soft' size='sm'>
                  {dataOrder?.employee?.name?.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <div>
                <Typography level='body-xs'>
                  {dataOrder?.employee?.name}
                </Typography>
              </div>
            </Box>
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
            <Typography level='body-sm'>Order Time</Typography>
            {dataOrder?.timestamp && (
              <Typography level='body-xs'>
                {new Intl.DateTimeFormat("id-ID", {
                  dateStyle: "full",
                  timeStyle: "short",
                })
                  .format(new Date(dataOrder?.timestamp ?? ""))
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
            <Typography level='body-sm'>{dataOrder?.tableName}</Typography>
          </Grid>
          {dataOrder?.rating && (
            <>
              <Grid
                xs={12}
                md={6}
                sx={{
                  px: 2,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography level='body-sm'>Rating</Typography>
                <Stack direction='column' spacing={0.2}>
                  <Rating
                    name='read-only'
                    size='small'
                    precision={0.5}
                    value={dataOrder!.rating!}
                    readOnly
                  />
                  <Typography level='body-sm' sx={{ textAlign: "right" }}>
                    {`${dataOrder!.rating!} | ${getLabelText(
                      dataOrder!.rating!
                    )}`}
                  </Typography>
                </Stack>
              </Grid>
              <Grid
                xs={12}
                md={6}
                sx={{
                  px: 2,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography level='body-sm'>Review</Typography>
                <Typography level='body-sm'>
                  {dataOrder?.review!.length > 0 ? dataOrder?.review : "-"}
                </Typography>
              </Grid>
            </>
          )}
          {dataOrder?.note && (
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
                {dataOrder?.note}
              </Typography>
            </Grid>
          )}
          <Grid
            xs={12}
            sx={{
              px: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography level='body-sm'>Subtotal</Typography>
            <Typography level='body-sm'>{dataOrder?.subtotal}</Typography>
          </Grid>
          {dataOrder?.voucherCode && (
            <Grid
              xs={12}
              sx={{
                px: 2,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography level='body-sm'>
                Voucher ({dataOrder?.voucherCode}-{dataOrder?.voucherDiscount})
              </Typography>
              <Typography level='body-sm'>{dataOrder?.discount}</Typography>
            </Grid>
          )}
          <Grid
            xs={12}
            sx={{
              px: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography level='body-sm'>PPN ({dataOrder?.ppn})</Typography>
            <Typography level='body-sm'>{dataOrder?.totalPpn}</Typography>
          </Grid>
          <Grid
            xs={12}
            sx={{
              px: 2,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography level='title-sm'>Total</Typography>
            <Typography level='title-sm'>{dataOrder?.total}</Typography>
          </Grid>
        </Grid>
        <Sheet
          className='OrderTableContainer'
          variant='outlined'
          sx={{
            display: { sm: "initial" },
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
              disableOrder
              headCells={[
                // {
                //   id: "action",
                //   label: "Action",
                //   disableOrder: true,
                //   style: { width: 70, padding: "12px 6px" },
                // },
                {
                  id: "menu",
                  label: "Menu",
                  style: { width: 300, padding: "12px 6px" },
                },
                {
                  id: "qty",
                  label: "Qty",
                  style: { width: 40, padding: "12px 6px" },
                },
                {
                  id: "price",
                  label: "Price",
                  style: { width: 70, padding: "12px 6px" },
                },
                {
                  id: "",
                  label: "",
                  style: { width: 40, padding: "12px 6px" },
                },
              ]}
            />
            <tbody>
              {dataOrder?.details?.map((detail) => (
                <tr key={detail.id}>
                  <td>
                    <Stack
                      direction='row'
                      sx={{ alignItems: "center", display: "flex" }}
                      gap={2}
                    >
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
                            detail.image
                              ? `${process.env.NEXT_PUBLIC_API_URL}/files/${detail.image}`
                              : "/empty.jpg"
                          }
                          loading='lazy'
                          alt=''
                        />
                      </AspectRatio>
                      <Stack sx={{ width: "100%", mr: 2 }}>
                        <Stack
                          direction='row'
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography level='title-md'>
                            {detail?.menuName}
                          </Typography>
                          <Typography level='title-md'>
                            {detail?.price != detail?.afterDiscount && (
                              <Typography
                                level='body-sm'
                                sx={{
                                  textDecoration: "line-through",
                                  color: "text.secondary",
                                }}
                              >
                                {detail?.price}
                              </Typography>
                            )}
                            {`    ${detail?.afterDiscount}`}
                          </Typography>
                        </Stack>
                        {detail?.note && (
                          <Stack
                            direction='row'
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography level='title-sm'>Note :</Typography>
                            <Typography level='title-sm'>
                              {detail?.note}
                            </Typography>
                          </Stack>
                        )}
                        {detail?.options?.map((option) => (
                          <>
                            {option.items?.length == 1 && (
                              <>
                                <Divider />
                                <Stack
                                  key={option.items[0]?.name}
                                  direction='row'
                                  sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography
                                    key={option?.name}
                                    level='body-sm'
                                    sx={{
                                      color: "text.secondary",
                                      mb: -1,
                                    }}
                                  >
                                    {`${option?.name} : `}
                                    <Typography
                                      level='body-sm'
                                      sx={{
                                        color: "text.secondary",
                                      }}
                                    >
                                      {option.items[0]?.name}
                                    </Typography>
                                  </Typography>
                                  <Typography
                                    level='body-sm'
                                    sx={{
                                      color: "text.secondary",
                                    }}
                                  >
                                    {option.items[0]?.price}
                                  </Typography>
                                </Stack>
                              </>
                            )}
                            {option.items?.length > 1 && (
                              <>
                                <Divider />
                                <Typography
                                  key={option?.name}
                                  level='body-sm'
                                  sx={{
                                    color: "text.secondary",
                                    mb: -1,
                                  }}
                                >
                                  {`${option?.name} : `}
                                </Typography>
                                {option.items?.map((item) => (
                                  <Stack
                                    key={item?.name}
                                    direction='row'
                                    sx={{
                                      width: "100%",
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Typography
                                      level='body-sm'
                                      sx={{
                                        color: "text.secondary",
                                      }}
                                    >
                                      {`   - ${item?.name}`}
                                    </Typography>
                                    <Typography
                                      level='body-sm'
                                      sx={{
                                        color: "text.secondary",
                                      }}
                                    >
                                      {item?.price}
                                    </Typography>
                                  </Stack>
                                ))}
                              </>
                            )}
                          </>
                        ))}
                        {(detail?.options?.length ?? 0) > 0 && (
                          <>
                            <Divider />
                            <Stack
                              direction='row'
                              sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography
                                level='title-sm'
                                sx={{
                                  color: "text.secondary",
                                }}
                              >
                                Total
                              </Typography>
                              <Typography
                                level='title-sm'
                                sx={{
                                  color: "text.secondary",
                                }}
                              >
                                {detail?.subtotal}
                              </Typography>
                            </Stack>
                          </>
                        )}
                      </Stack>
                    </Stack>
                  </td>
                  <td>
                    <Typography level='title-sm'>{detail.qty}</Typography>
                  </td>
                  <td>
                    <Typography level='title-sm'>{detail.total}</Typography>
                  </td>
                  <td>
                    <IconButton
                      size='sm'
                      variant='plain'
                      color='neutral'
                      component={MyLink}
                      href={`/app/db/menu/${detail.menuId}`}
                      target='_blank'
                    >
                      <OpenInNew />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>
                  <Typography
                    level='title-sm'
                    sx={{ textAlign: "right", mr: 3 }}
                  >
                    SUBTOTAL
                  </Typography>
                </td>
                <td>
                  <Typography level='title-sm'>
                    {dataOrder?.subtotal}
                  </Typography>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </Table>
        </Sheet>
      </Card>
    </>
  );
}

export default FormOrder;
