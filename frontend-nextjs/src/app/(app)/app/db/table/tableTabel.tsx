"use client";
import React from "react";
import {
  Add,
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
import { useUserContext } from "@/src/context/UserContext";
import { ErrorToString } from "@/src/utils/error-types";
import LoaderModal from "@/src/components/Loading/LoaderModal";
import TableModel from "@/src/resources/table/table-model";
import TableServices from "@/src/resources/table/table-services";
// import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/utils";
import { Alert, AlertTitle } from "@mui/material";
interface EditToolbarProps {
  // eslint-disable-next-line no-unused-vars
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    // eslint-disable-next-line no-unused-vars
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}
// function EditInputCell(props: GridRenderEditCellParams) {
//   const { id, value, field, hasFocus } = props;
//   const apiRef = useGridApiContext();
//   const ref =
//     React.useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

//   const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = event.target.value; // The new value entered by the user
//     apiRef.current.setEditCellValue({ id, field, value: newValue });
//   };

//   useEnhancedEffect(() => {
//     if (hasFocus && ref.current) {
//       const input = ref.current.querySelector<HTMLInputElement>(
//         `input[value="${value}"]`
//       );
//       input?.focus();
//     }
//   }, [hasFocus, value]);

//   return (
//     <Input
//       required
//       sx={{ height: "100%", width: "100%", borderRadius: 0 }}
//       ref={ref}
//       type='text'
//       value={value}
//       onChange={handleValueChange}
//     />
//   );
// }
// const renderEditInputCell: GridColDef["renderCell"] = (params) => {
//   return <EditInputCell {...params} />;
// };
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
export default function Table() {
  const user = useUserContext();
  const [isLoading, setIsLoading] = React.useState(true);
  const [rows, setRows] = React.useState<TableModel[]>([]);
  const [originalData, setOriginalData] = React.useState<TableModel[]>([]);
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
    let listUpdate = {
      new: rows.filter((row) => typeof row.id === "string"),
      update: rows.filter(
        (row) =>
          typeof row.id === "number" &&
          originalData.some(
            (origin) =>
              origin.id === row.id &&
              (origin.name != row.name ||
                origin.capacity != row.capacity ||
                origin.available != row.available)
          )
      ),
    };
    const { data, error } = await TableServices.updateAll(
      user?.token as string,
      listUpdate
    );
    if (error) {
      setIsLoading(false);
      setErrorPage(new Error(ErrorToString(error)));
    }
    if (data == null) return;
    setRows(data);
    setChanged(false);
    setIsLoading(false);
  };

  const getCategory = async () => {
    const { data, error } = await TableServices.getAll(user?.token as string);
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
    if (
      original?.name != editedRow?.name ||
      original?.capacity != editedRow?.capacity ||
      original?.available != editedRow?.available
    )
      setChanged(true);
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
    const updatedRow = { ...(newRow as TableModel), isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    const original = originalData.find((row) => row.id === newRow.id);
    if (
      original?.name != updatedRow?.name ||
      original?.capacity != updatedRow?.capacity ||
      original?.available != updatedRow?.available
    )
      setChanged(true);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
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
                    icon={<Edit />}
                    label='Edit'
                    className='textPrimary'
                    onClick={() => handleEditClick(id)}
                    sx={{
                      color: "primary.main",
                    }}
                  />,

                  ...((typeof id === "string" && [
                    <GridActionsCellItem
                      key={id}
                      icon={<Delete />}
                      label='Delete'
                      onClick={() => {
                        if (typeof id === "string") handleDeleteClick(id);
                        else {
                          window.alert("You can't delete this item");
                        }
                      }}
                      sx={{
                        color: "danger",
                      }}
                    />,
                  ]) ||
                    []),
                ];
              },
            },
            {
              field: "name",
              headerName: "Name",
              editable: true,
              flex: 1,
              type: "string",
              renderCell: renderInputCell,
              // renderEditCell: renderEditInputCell,
            },
            {
              field: "capacity",
              headerName: "Capacity",
              editable: true,
              type: "number",
              renderCell: renderInputCell,
              // renderEditCell: renderEditInputCell,
            },
            {
              field: "available",
              headerName: "Available",
              editable: true,
              type: "boolean",
            },
          ]}
          rows={rows}
          hideFooter={true}
        />
      </Box>
    </>
  );
}
