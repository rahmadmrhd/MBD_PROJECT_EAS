import MenuModel, {
  MenuOptionItemModel,
  MenuOptionModel,
} from "@/src/resources/menu/menu-model";
import { useIsMounted } from "@/src/utils/useIsMounted";
import { Add, Cancel, Delete, Edit, Save } from "@mui/icons-material";
import {
  Card,
  Stack,
  Typography,
  Divider,
  FormLabel,
  Button,
  FormControl,
  Input,
  Box,
  FormHelperText,
} from "@mui/joy";
import {
  DataGrid,
  GridValueFormatterParams,
  GridColumnMenu,
  GridColumnMenuProps,
  GridActionsCellItem,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridToolbarContainer,
  GridRowId,
  GridRowModel,
  GridEventListener,
  GridRowEditStopReasons,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { randomId } from "@mui/x-data-grid-generator";
import React from "react";
import { CurrencyFormatAdapter } from "@/src/utils/formatter";
import { Alert, AlertTitle } from "@mui/material";

interface EditToolbarProps {
  // eslint-disable-next-line no-unused-vars
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    // eslint-disable-next-line no-unused-vars
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

type Properties = {
  index: number;
  menuOption: MenuOptionModel;
  setDataMenu: React.Dispatch<React.SetStateAction<MenuModel>>;
  disabled?: boolean;
};
const StyledBox = styled(Box)(({ theme }) => ({
  height: 250,
  width: "100%",
  "& .MuiDataGrid-cell--editing": {
    backgroundColor: "rgb(255,215,115, 0.19)",
    color: "#1a3e72",
    "& .MuiInputBase-root": {
      height: "100%",
    },
  },
  "& .Mui-error": {
    backgroundColor: `rgb(126,10,15, ${
      theme.palette.mode === "dark" ? 0 : 0.1
    })`,
    color: theme.palette.error.main,
  },
}));

function renderNameCell(params: GridRenderCellParams<any, number>) {
  return (
    <Input
      required
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: 0,
        border: "none",
        backgroundColor: "transparent",
        "--Input-focusedInset": "0",
        "--Input-focusedThickness": "0",
        "&::before": {
          transition: "box-shadow .15s ease-in-out",
        },
        "&:focus-within": {
          border: "none",
          borderColor: "transparent",
        },
        pointerEvents: "none",
      }}
      name='name'
      type='text'
      value={params.value}
    />
  );
}

function renderPriceCell(params: GridRenderCellParams<any, number>) {
  return (
    <Input
      required
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: 0,
        border: "none",
        backgroundColor: "transparent",
        "--Input-focusedInset": "0",
        "--Input-focusedThickness": "0",
        "&::before": {
          transition: "box-shadow .15s ease-in-out",
        },
        "&:focus-within": {
          border: "none",
          borderColor: "transparent",
        },
        pointerEvents: "none",
      }}
      name='price'
      slotProps={{
        input: {
          component: CurrencyFormatAdapter,
        },
      }}
      value={params.value}
    />
  );
}

const MenuOption = React.forwardRef<any, Properties>(function MenuOption(
  { index, menuOption, setDataMenu, disabled }: Properties,
  ref
) {
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  const isMounted = useIsMounted();
  const [rows, setRows] = React.useState(menuOption.items);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [alert, setAlert] = React.useState<
    | {
        severity: "error" | "warning" | "info" | "success";
        title?: string;
        msg: string;
      }
    | undefined
  >();
  React.useImperativeHandle(ref, () => ({
    checkItemsHasEdited() {
      const inEditMode = Object.values(rowModesModel).some(
        (value) => value.mode === GridRowModes.Edit
      );
      if (inEditMode) {
        setAlert({
          severity: "warning",
          msg: "There are unsaved changes. Please save or cancel them first.",
        });
      } else {
        setAlert(undefined);
      }
      return inEditMode;
    },
  }));

  const removeCurrent = () => {
    setDataMenu((prev) => {
      const newOptions = prev.options!;
      const removeIdx = newOptions.findIndex((o) => o.id === menuOption.id);
      if (removeIdx > -1) newOptions.splice(removeIdx, 1);
      return {
        ...prev,
        options: newOptions,
      };
    });
  };

  React.useEffect(() => {
    if (!isMounted) return;
    updateItems(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const updateItems = (items: MenuOptionItemModel[]) => {
    setDataMenu((prev) => {
      const newOptions = prev.options!;
      newOptions[index] = {
        ...newOptions[index],
        items: items,
      };
      return {
        ...prev,
        options: newOptions,
      };
    });
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    // if (!newRow.name) {
    //   setRows(rows.filter((row) => row.id !== newRow.id));
    //   return {};
    // }
    const updatedRow = {
      ...(newRow as MenuOptionItemModel),
      price: newRow.price ?? 0,
      isNew: false,
    };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDataMenu((prev) => {
      const newOptions = prev.options!;
      newOptions[index] = {
        ...newOptions[index],
        [e.target.name]: e.target.value,
      };
      return {
        ...prev,
        options: newOptions,
      };
    });
  };
  return (
    <Card>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          mb: 1,
          alignItems: "center",
          width: "100%",
          display: "flex",
          alignContent: "flex-start",
        }}
        spacing={3}
      >
        <FormControl
          sx={{ width: { xs: "100%", md: "auto" } }}
          disabled={disabled}
        >
          <FormLabel>&#8203;</FormLabel>
          <Button
            disabled={disabled}
            variant='solid'
            color='danger'
            size='sm'
            startDecorator={<Delete />}
            onClick={(e) => {
              e.preventDefault();
              removeCurrent();
            }}
          >
            Remove
          </Button>
        </FormControl>
        <FormControl
          required
          disabled={disabled}
          sx={{
            flexGrow: { md: 1, xs: undefined },
            width: { xs: "100%", md: "auto" },
          }}
        >
          <FormLabel>Name</FormLabel>
          <Input
            size='sm'
            onChange={onChangeInput}
            name='name'
            value={menuOption.name}
          />
        </FormControl>
        <FormControl
          required
          disabled={disabled}
          sx={{
            minWidth: "100px",
            width: { xs: "100%", md: "auto" },
          }}
        >
          <FormLabel>Min</FormLabel>
          <Input
            type='number'
            size='sm'
            onChange={onChangeInput}
            name='min'
            value={menuOption.min}
            slotProps={{
              input: {
                // ref: inputRef,
                min: 0,
                max: menuOption.max || 1,
                step: 1,
              },
            }}
          />
        </FormControl>
        <FormControl
          required
          disabled={disabled}
          sx={{
            minWidth: "100px",
            width: { xs: "100%", md: "auto" },
          }}
        >
          <FormLabel>Max</FormLabel>
          <Input
            type='number'
            size='sm'
            onChange={onChangeInput}
            name='max'
            value={menuOption.max}
            slotProps={{
              input: {
                // ref: inputRef,
                min: menuOption.min || 1,
                max: menuOption.items.length || 1,
                step: 1,
              },
            }}
          />
          <FormHelperText>Set 0 for unlimited</FormHelperText>
        </FormControl>
      </Stack>
      <Divider />
      {/* Items */}
      <Stack spacing={1} sx={{ display: "flex" }}>
        <Typography level='h4' textAlign='center'>
          Items
        </Typography>
        <StyledBox>
          <DataGrid
            rowHeight={42}
            editMode='row'
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            slots={{
              toolbar: (props: EditToolbarProps) => {
                const { setRows, setRowModesModel } = props;

                const handleClick = () => {
                  const id = randomId();
                  setRows((oldRows) => [
                    ...oldRows,
                    {
                      id,
                      name: "",
                      price: null,
                      available: true,
                      isNew: true,
                    },
                  ]);
                  setRowModesModel((oldModel) => ({
                    ...oldModel,
                    [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
                  }));
                };

                return (
                  <Stack>
                    <GridToolbarContainer>
                      <Button
                        disabled={disabled}
                        color='primary'
                        startDecorator={<Add />}
                        onClick={handleClick}
                      >
                        Add Item
                      </Button>
                    </GridToolbarContainer>
                    {alert && (
                      <Alert
                        sx={{
                          mt: 1,
                        }}
                        severity={alert.severity}
                        onClose={() => setAlert(undefined)}
                      >
                        {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                        {alert.msg}
                      </Alert>
                    )}
                  </Stack>
                );
              },
              columnMenu: (props: GridColumnMenuProps) => {
                return (
                  <GridColumnMenu
                    {...props}
                    slots={{
                      columnMenuColumnsItem: null,
                    }}
                  />
                );
              },
            }}
            columns={[
              {
                field: "actions",
                type: "actions",
                headerName: "Actions",
                width: 100,
                cellClassName: "actions",
                getActions: ({ id }) => {
                  const isInEditMode =
                    rowModesModel[id]?.mode === GridRowModes.Edit;

                  if (isInEditMode) {
                    return [
                      <GridActionsCellItem
                        key={id}
                        disabled={disabled}
                        icon={<Save />}
                        label='Save'
                        sx={{
                          color: "primary.main",
                        }}
                        onClick={handleSaveClick(id)}
                      />,
                      <GridActionsCellItem
                        key={id}
                        disabled={disabled}
                        icon={<Cancel />}
                        label='Cancel'
                        className='textPrimary'
                        onClick={handleCancelClick(id)}
                        color='inherit'
                      />,
                    ];
                  }

                  return [
                    <GridActionsCellItem
                      key={id}
                      disabled={disabled}
                      icon={<Edit />}
                      label='Edit'
                      className='textPrimary'
                      onClick={handleEditClick(id)}
                      color='inherit'
                    />,
                    <GridActionsCellItem
                      key={id}
                      disabled={disabled}
                      icon={<Delete />}
                      label='Delete'
                      onClick={handleDeleteClick(id)}
                      color='inherit'
                    />,
                  ];
                },
              },
              {
                field: "name",
                headerName: "Name",
                type: "string",
                editable: !disabled,
                flex: 1,
                renderCell: renderNameCell,
                // renderEditCell: renderNamaEditInputCell,
              },
              {
                field: "price",
                headerName: "Price",
                editable: !disabled,
                flex: 1,
                renderCell: renderPriceCell,
                // renderEditCell: renderPriceEditInputCell,
                valueGetter: (params) => {
                  if (!params.value) {
                    return params.value;
                  }
                  return params.value;
                },
                valueFormatter: (params: GridValueFormatterParams<number>) => {
                  if (params.value == null) {
                    return "";
                  }
                  return currencyFormatter.format(params.value);
                },
                valueSetter(params) {
                  // if (Number(params.value)) {
                  //   return { ...params.row, price: 0 };
                  // }
                  const valueNum = Number(params.value);
                  return {
                    ...params.row,
                    price: Number.isNaN(valueNum) ? 0 : valueNum,
                  };
                },
              },
              {
                field: "available",
                headerName: "Available",
                editable: !disabled,
                type: "boolean",
              },
            ]}
            rows={rows}
            hideFooter={true}
          />
        </StyledBox>
      </Stack>
    </Card>
  );
});

export default MenuOption;
