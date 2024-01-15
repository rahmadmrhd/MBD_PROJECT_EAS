/* eslint-disable @next/next/no-img-element */
"use client";
import { SaveRounded, Cancel, LockOpenRounded } from "@mui/icons-material";
import {
  Card,
  Divider,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Tabs,
  TabList,
  TabPanel,
  Tab,
  Grid,
  FormHelperText,
  Textarea,
} from "@mui/joy";
import { Button, ButtonGroup } from "@mui/joy";
import React from "react";
import { useUserContext } from "@/src/context/UserContext";
import { ErrorToString } from "@/src/utils/error-types";
import {
  CurrencyFormatAdapter,
  PercentFormatAdapter,
} from "@/src/utils/formatter";
import LoaderModal from "@/src/components/Loading/LoaderModal";
import VoucherServices from "@/src/resources/voucher/voucher-services";
import { notFound, useRouter } from "next/navigation";
import { useBreadcrumbsContext } from "@/src/context/BreadcrumbsContext";
import MyLink from "@/src/components/MyLink";
import VoucherModel from "@/src/resources/voucher/voucher-model";
import generateString from "@/src/utils/randomString";
import datetimeLocal from "@/src/utils/datetimelocal-formater";

function FormVoucher({ idVoucher }: { idVoucher?: number }) {
  const user = useUserContext();
  const [isLoading, setIsLoading] = React.useState(true);
  const [dataVoucher, setDataVoucher] = React.useState<VoucherModel>({});
  const router = useRouter();
  const isEdit = !!idVoucher;
  const useBreadcrumbs = useBreadcrumbsContext();
  const [error, setError] = React.useState<Error>();
  // const pathname = usePathname();
  const [lockEdit, setLockEdit] = React.useState(!!idVoucher);

  React.useEffect(() => {
    setIsLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (error) {
    throw error;
  }
  const fetchData = async () => {
    try {
      if (isEdit) {
        await getVoucher();
      } else {
        useBreadcrumbs.setReplace({
          searchValue: `voucher/add`,
          replaceValue: `voucher/New Voucher:force`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  const getVoucher = async () => {
    const { data: voucherr, error } = await VoucherServices.getById(
      user?.token as string,
      idVoucher as number
    );
    if (error) {
      setError(new Error(ErrorToString(error)));
    }
    if (voucherr == null) {
      notFound();
    }
    useBreadcrumbs.setReplace({
      searchValue: `voucher/${idVoucher}`,
      replaceValue: `voucher/${voucherr.code ?? idVoucher}:force`,
    });
    voucherr.expiredAt = datetimeLocal(voucherr.expiredAt);
    setDataVoucher(voucherr);
  };

  const onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDataVoucher((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createOrUpdateRequest = async () => {
    try {
      dataVoucher.code = dataVoucher.code?.toUpperCase();
      const { data, error } = isEdit
        ? await VoucherServices.update(user?.token as string, dataVoucher)
        : await VoucherServices.create(user?.token as string, dataVoucher);
      if (data) {
        if (isEdit) {
          setIsLoading(true);
          setLockEdit(true);
          await fetchData();
        } else {
          router.replace(`/app/db/voucher/${data.id}`);
        }
      }
      if (error) {
        setError(new Error(ErrorToString(error)));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoaderModal open={isLoading} />
      <Tabs defaultValue={0} sx={{ width: "100%" }}>
        {isEdit && (
          <TabList
            sx={{
              display: "flex",
              zIndex: 10,
              position: "sticky",
              top: { xs: "24px", md: "-24px" },
              mx: { xs: -2, md: -6 },
              px: { xs: 2, md: 6 },
              pt: 2,
              backgroundColor: "background.body",
              borderRadius: "0",
            }}
          >
            <Tab>{isEdit ? "Edit Voucher" : "New Voucher"}</Tab>
            <Tab>Log</Tab>
          </TabList>
        )}
        <TabPanel value={0}>
          <form
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") e.preventDefault();
            // }}
            onSubmit={async (e) => {
              e.preventDefault();
              if (lockEdit) {
                setLockEdit(false);
                return;
              }
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
                top: isEdit
                  ? { xs: "24px", md: "30px" }
                  : { xs: "-12px", md: "-24px" },
                mx: { xs: -2, md: -6 },
                mt: -2,
                mb: 2,
                px: { xs: 2, md: 4 },
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
                  type={lockEdit ? undefined : "submit"}
                >
                  {lockEdit ? "Unlock" : idVoucher ? "Update" : "Save"}
                </Button>
                <Button
                  startDecorator={<Cancel />}
                  color='danger'
                  variant='solid'
                  component={MyLink}
                  href='/app/db/voucher'
                >
                  Cancel
                </Button>
              </ButtonGroup>
              <Divider sx={{ mt: 1 }} />
            </Stack>
            <Card>
              <Grid container spacing={2} sx={{ my: 1, flexGrow: 1 }}>
                <Grid xs={12} md={12} lg={4}>
                  <FormControl required disabled={isEdit}>
                    <FormLabel>Code</FormLabel>
                    <Input
                      size='sm'
                      onChange={onChangeInput}
                      name='code'
                      type='text'
                      value={dataVoucher.code}
                      sx={{ "--Input-decoratorChildHeight": "31px" }}
                      slotProps={{
                        input: {
                          style: { textTransform: "uppercase" },
                        },
                      }}
                      endDecorator={
                        <Button
                          size='sm'
                          disabled={isEdit}
                          onClick={(e) => {
                            e.preventDefault();
                            setDataVoucher((prev) => ({
                              ...prev,
                              code: generateString(10).toUpperCase(),
                            }));
                          }}
                        >
                          Generate
                        </Button>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={6} md={3} lg={2}>
                  <FormControl
                    required
                    disabled={lockEdit}
                    sx={{
                      minWidth: "100px",
                      width: { xs: "100%", md: "auto" },
                    }}
                  >
                    <FormLabel>Qty</FormLabel>
                    <Input
                      type='number'
                      size='sm'
                      onChange={onChangeInput}
                      name='qty'
                      value={dataVoucher.qty}
                      slotProps={{
                        input: {
                          // ref: inputRef,
                          min: 0,
                          step: 1,
                        },
                      }}
                    />
                  </FormControl>
                </Grid>{" "}
                <Grid xs={12} sm={6} md={3} lg={2}>
                  <FormControl
                    required
                    disabled={lockEdit}
                    sx={{
                      minWidth: "100px",
                      width: { xs: "100%", md: "auto" },
                    }}
                  >
                    <FormLabel>Maximum use</FormLabel>
                    <Input
                      type='number'
                      size='sm'
                      onChange={onChangeInput}
                      name='maxUse'
                      value={dataVoucher.maxUse}
                      slotProps={{
                        input: {
                          // ref: inputRef,
                          min: 0,
                          step: 1,
                        },
                      }}
                    />
                    <FormHelperText>Set 0 for unlimited</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={4}>
                  <FormControl
                    required
                    disabled={lockEdit}
                    sx={{
                      minWidth: "100px",
                      width: { xs: "100%", md: "auto" },
                    }}
                  >
                    <FormLabel>Expired Date</FormLabel>
                    <Input
                      type='datetime-local'
                      size='sm'
                      onChange={onChangeInput}
                      name='expiredAt'
                      value={dataVoucher.expiredAt}
                      slotProps={{
                        input: {
                          min: "2023-01-01",
                          max: `${new Date().getUTCFullYear() + 2}-12-31`,
                        },
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <FormControl disabled={lockEdit}>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      minRows={5}
                      maxRows={7}
                      size='sm'
                      onChange={onChangeInput}
                      name='description'
                      value={dataVoucher.description}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={12} md={4}>
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
                      value={dataVoucher.discount}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={12} md={4}>
                  <FormControl
                    required
                    sx={{ flexGrow: 1 }}
                    disabled={lockEdit}
                  >
                    <FormLabel>Minimum Purchase</FormLabel>
                    <Input
                      sx={{ minWidth: "auto" }}
                      onChange={onChangeInput}
                      name='minPurchase'
                      size='sm'
                      placeholder='Rp. 123.456,78'
                      slotProps={{
                        input: {
                          component: CurrencyFormatAdapter,
                        },
                      }}
                      value={dataVoucher.minPurchase ?? ""}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={12} md={4}>
                  <FormControl
                    required
                    sx={{ flexGrow: 1 }}
                    disabled={lockEdit}
                  >
                    <FormLabel>Maximum Discount</FormLabel>
                    <Input
                      sx={{ minWidth: "auto" }}
                      onChange={onChangeInput}
                      name='maxDiscount'
                      size='sm'
                      placeholder='Rp. 123.456,78'
                      slotProps={{
                        input: {
                          component: CurrencyFormatAdapter,
                        },
                      }}
                      value={dataVoucher.maxDiscount ?? ""}
                    />
                    <FormHelperText>
                      Maximum discount that can be applied, set 0 for unlimited
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Card>
          </form>
        </TabPanel>
        <TabPanel value={1}>
          <b>Second</b> tab panel
        </TabPanel>
      </Tabs>
    </>
  );
}

export default FormVoucher;
