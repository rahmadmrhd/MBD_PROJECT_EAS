"use client";
import React from "react";
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Cancel,
  Delete,
  Edit,
  Save,
  SaveRounded,
} from "@mui/icons-material";
import { Box, Button, Input, Stack } from "@mui/joy";
import {
  DataGrid,
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
import { randomId } from "@mui/x-data-grid-generator";
import CategoryModel from "@/src/resources/category/category-model";
import CategoryServices from "@/src/resources/category/category-services";
import { useUserContext } from "@/src/context/UserContext";
import { ErrorToString } from "@/src/utils/error-types";
import LoaderModal from "@/src/components/Loading/LoaderModal";
import { Alert, AlertTitle } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
interface EditToolbarProps {
  // eslint-disable-next-line no-unused-vars
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    // eslint-disable-next-line no-unused-vars
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}
function renderInputIconCell(params: GridRenderCellParams<any, number>) {
  return (
    <>
      <Icon icon={params.value as unknown as string} width={24} />
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
    </>
  );
}
function renderInputCell(params: GridRenderCellParams<any, number>) {
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

function CategoryTabel() {
  const user = useUserContext();
  const [isLoading, setIsLoading] = React.useState(true);
  const [rows, setRows] = React.useState<CategoryModel[]>([]);
  const [originalData, setOriginalData] = React.useState<CategoryModel[]>([]);
  const [changed, setChanged] = React.useState(false);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [errorPage, setErrorPage] = React.useState<Error>();
  const [alert, setAlert] = React.useState<
    | {
        severity: "error" | "warning" | "info" | "success";
        title?: string;
        msg: string;
      }
    | undefined
  >();
  if (errorPage) throw errorPage;

  React.useEffect(() => {
    setIsLoading(true);
    getCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // React.useEffect(() => {
  //   setChanged(true);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [rows]);
  const updateCategories = async () => {
    const newRows = rows.map((x, index) => {
      const row = x as CategoryModel;
      return {
        ...row,
        order: index,
      };
    });
    let listUpdate = {
      new: newRows.filter((row) => typeof row.id === "string"),
      update: newRows.filter(
        (row) =>
          typeof row.id === "number" &&
          !originalData.some(
            (origin) =>
              origin.id === row.id &&
              origin.name === row.name &&
              origin.order === row.order
          )
      ),
    };
    const { data, error } = await CategoryServices.updateAll(
      user?.token as string,
      listUpdate
    );
    if (error) {
      setIsLoading(false);
      setErrorPage(new Error(ErrorToString(error)));
    }
    setIsLoading(false);
    if (data == null) return;
    setRows(data);
    setChanged(false);
  };

  const getCategory = async () => {
    const { data, error } = await CategoryServices.getAll(
      user?.token as string
    );
    if (error) {
      setIsLoading(false);
      throw new Error(ErrorToString(error));
    }
    if (data == null) return;
    setRows(data);
    setOriginalData(data);
    setChanged(false);
    setIsLoading(false);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    const editedRow = rows.find((row) => row.id === id);
    const original = originalData.find((row) => row.id === id);
    if (original?.name != editedRow?.name) setChanged(true);
  };

  const handleDeleteClick = (id: GridRowId) => {
    const filteredRows = rows.filter((row) => row.id !== id);
    setRows(filteredRows);
    setChanged(true);
  };

  const handleCancelClick = (id: GridRowId) => {
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
    const updatedRow = { ...(newRow as CategoryModel), isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    const original = originalData.find((row) => row.id === newRow.id);
    if (original?.name != updatedRow?.name) setChanged(true);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const handleOrderRow = (id: GridRowId, direction: "up" | "down") => {
    const currentIndex = rows.findIndex((row) => row.id === id);
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex >= 0 && targetIndex < rows.length) {
      moveRow(currentIndex, targetIndex);
    }
    setChanged(true);
  };
  const moveRow = (dragIndex: number, hoverIndex: number) => {
    const draggedRow = rows[dragIndex];
    let updatedRows = [...rows];
    updatedRows.splice(dragIndex, 1);
    updatedRows.splice(hoverIndex, 0, draggedRow);
    updatedRows = updatedRows.map((row, index) => ({ ...row, order: index }));
    // Update the state to reflect the new order of rows
    setRows(updatedRows);
  };
  return (
    <>
      <LoaderModal open={isLoading} />
      <Box
        sx={{ height: "100%", width: "100%" }}
        component='form'
        onSubmit={async (e) => {
          e.preventDefault();
          const inEditMode = Object.values(rowModesModel).some(
            (value) => value.mode === GridRowModes.Edit
          );
          if (inEditMode) {
            setAlert({
              severity: "warning",
              msg: "There are unsaved changes. Please save or cancel them first.",
            });
            return;
          }
          setAlert(undefined);
          setIsLoading(true);
          await updateCategories();
        }}
      >
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
                  { id, name: "", price: null, available: true, isNew: true },
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
                      color='primary'
                      startDecorator={<Add />}
                      onClick={handleClick}
                    >
                      Add Item
                    </Button>

                    {changed && (
                      <Button
                        color='success'
                        startDecorator={<SaveRounded />}
                        type='submit'
                      >
                        Apply
                      </Button>
                    )}
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

                  <Alert
                    sx={{
                      mt: 1,
                      fontSize: "12px",
                    }}
                    severity='info'
                  >
                    <AlertTitle>Cara Penggunaan Icon</AlertTitle>- Kunjung web
                    berikut{" "}
                    <a
                      href='https://icon-sets.iconify.design/'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      https://icon-sets.iconify.design/
                    </a>
                    <br />- Cari icon yang ingin anda gunakan
                    <br />- Copy nama icon, dan tempel pada kolom
                    {" 'icon'"}
                  </Alert>
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
              width: 200,
              cellClassName: "actions",
              getActions: ({ id }) => {
                const isInEditMode =
                  rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                  return [
                    <GridActionsCellItem
                      key={id}
                      icon={<ArrowUpward />}
                      label='Up'
                      className='textPrimary'
                      disabled={rows.findIndex((row) => row.id === id) === 0}
                      onClick={() => handleOrderRow(id, "up")}
                      sx={{
                        color: "neutral",
                      }}
                    />,
                    <GridActionsCellItem
                      key={id}
                      icon={<ArrowDownward />}
                      label='Down'
                      className='textPrimary'
                      disabled={
                        rows.findIndex((row) => row.id === id) ===
                        rows.length - 1
                      }
                      onClick={() => handleOrderRow(id, "down")}
                      sx={{
                        color: "neutral",
                      }}
                    />,
                    <GridActionsCellItem
                      key={id}
                      icon={<Save />}
                      label='Save'
                      sx={{
                        color: "primary.main",
                      }}
                      onClick={() => handleSaveClick(id)}
                    />,
                    <GridActionsCellItem
                      key={id}
                      icon={<Cancel />}
                      label='Cancel'
                      className='textPrimary'
                      onClick={() => handleCancelClick(id)}
                      sx={{
                        color: "danger.main",
                      }}
                    />,
                  ];
                }

                return [
                  <GridActionsCellItem
                    key={id}
                    icon={<ArrowUpward />}
                    label='Up'
                    className='textPrimary'
                    disabled={rows.findIndex((row) => row.id === id) === 0}
                    onClick={() => handleOrderRow(id, "up")}
                    sx={{
                      color: "neutral",
                    }}
                  />,
                  <GridActionsCellItem
                    key={id}
                    icon={<ArrowDownward />}
                    label='Down'
                    className='textPrimary'
                    disabled={
                      rows.findIndex((row) => row.id === id) === rows.length - 1
                    }
                    onClick={() => handleOrderRow(id, "down")}
                    sx={{
                      color: "neutral",
                    }}
                  />,
                  <GridActionsCellItem
                    key={id}
                    icon={<Edit />}
                    label='Edit'
                    className='textPrimary'
                    onClick={() => handleEditClick(id)}
                    sx={{
                      color: "primary.main",
                    }}
                  />,

                  <GridActionsCellItem
                    key={id}
                    icon={<Delete />}
                    label='Delete'
                    disabled={typeof id === "number"}
                    onClick={() => {
                      if (typeof id === "string") handleDeleteClick(id);
                      else {
                        window.alert("You can't delete this item");
                      }
                    }}
                    sx={{
                      color: typeof id === "number" ? "background" : "danger",
                    }}
                  />,
                ];
              },
            },
            {
              field: "name",
              headerName: "Name",
              editable: true,
              flex: 1,
              sortable: false,
              renderCell: renderInputCell,
            },
            {
              field: "icon",
              headerName: "Icon",
              editable: true,
              flex: 1,
              sortable: false,
              renderCell: renderInputIconCell,
            },
          ]}
          rows={rows}
          hideFooter={true}
        />
      </Box>
    </>
  );
}

export default CategoryTabel;
