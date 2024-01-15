import { ArrowDropDown } from "@mui/icons-material";
import { Box, Link } from "@mui/joy";
import React, { useEffect } from "react";
import { visuallyHidden } from "@mui/utils";

export interface HeadCell
  extends React.DetailedHTMLProps<
    React.ThHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  > {
  id: string;
  label: string;
  isNumeric?: boolean;
  disableOrder?: boolean;
}

export type SortType = {
  order: "asc" | "desc";
  orderBy?: string;
};

export interface EnhancedTableHeadProps {
  headCells: HeadCell[];
  sort: SortType;
  setSort: React.Dispatch<React.SetStateAction<SortType>>;
}
export interface EnhancedTableHeadDisableProps {
  disableOrder: boolean;
  headCells: HeadCell[];
}

export default function EnhancedTableHead({
  headCells,
  ...props
}: EnhancedTableHeadProps | EnhancedTableHeadDisableProps) {
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<string | undefined>();

  useEffect(() => {
    if ("sort" in props) {
      if (
        (props as EnhancedTableHeadProps).sort.orderBy === orderBy &&
        (props as EnhancedTableHeadProps).sort.order === order
      )
        return;
      setOrder((props as EnhancedTableHeadProps).sort.order);
      setOrderBy((props as EnhancedTableHeadProps).sort.orderBy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(props as EnhancedTableHeadProps).sort]);

  const handleRequestSort = (
    e: React.MouseEvent<HTMLButtonElement>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
    (props as EnhancedTableHeadProps).setSort({
      order: isAsc ? "desc" : "asc",
      orderBy: property,
    });
  };

  return (
    <thead>
      <tr>
        {headCells.map(
          ({ id, label, isNumeric, disableOrder, ...headCell }) => {
            const active = orderBy === id;
            return (props as EnhancedTableHeadDisableProps).disableOrder ||
              disableOrder ? (
              <th key={id} {...headCell}>
                {label}
              </th>
            ) : (
              <th key={id} {...headCell}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <Link
                  underline='none'
                  color='neutral'
                  textColor={active ? "primary.plainColor" : undefined}
                  component='button'
                  onClick={(e) => handleRequestSort(e, id)}
                  fontWeight='lg'
                  startDecorator={
                    isNumeric ? (
                      <ArrowDropDown sx={{ opacity: active ? 1 : 0 }} />
                    ) : null
                  }
                  endDecorator={
                    !isNumeric ? (
                      <ArrowDropDown sx={{ opacity: active ? 1 : 0 }} />
                    ) : null
                  }
                  sx={{
                    "& svg": {
                      transition: "0.2s",
                      transform:
                        active && order === "desc"
                          ? "rotate(0deg)"
                          : "rotate(180deg)",
                    },
                    "&:hover": { "& svg": { opacity: 1 } },
                  }}
                >
                  {label}
                  {active ? (
                    <Box component='span' sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </Link>
              </th>
            );
          }
        )}
      </tr>
    </thead>
  );
}
