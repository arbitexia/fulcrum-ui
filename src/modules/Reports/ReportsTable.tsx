/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';

import {
  UICheckbox,
  UIDefaultTextField,
  UIScorebox,
  UIScoreChip,
  UIBorderCell,
  UINoBorderCell,
} from '@/components/UI';
import { getScoreColor } from '@/libs/color-generator';
import {
  ReportsColumnType,
  StatusTableType,
  ProgramTableType,
  UsageTableType,
} from '@/types';
import { stableSort } from '@/libs/sort-utils';
import { roundScoreIntelligently } from '@/libs/math-utils';

interface TableProps<T extends ReportsColumnType, U extends ProgramTableType> {
  columns: T[];
  rows: U[];
  tableRole: string;
  type: string;
  order: keyof U;
  unmaskFunction?: (value: U) => void;
  refresh?: boolean;
  setRefresh?: (value: boolean) => void;
}

export default function ReportsTable<
  T extends ReportsColumnType,
  U extends ProgramTableType
>(props: TableProps<T, U>): JSX.Element {
  type Order = 'asc' | 'desc';
  const {
    order: initialOrder,
    rows,
    columns,
    type,
    tableRole,
    refresh,
    setRefresh,
  } = props;
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof U>(initialOrder);
  const [tableList, setTableList] = useState<U[] | null>(null);
  const [selected, setSelected] = useState<readonly string[]>([]);

  const isSelected = (name: string): boolean => selected.indexOf(name) !== -1;

  const handleClick = (name: string): void => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const descendingComparator = (
    a: U,
    b: U,
    comparatorOrderBy: keyof U
  ): number => {
    if (b[comparatorOrderBy] < a[comparatorOrderBy]) {
      return -1;
    }
    if (b[comparatorOrderBy] > a[comparatorOrderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = <Key extends keyof U>(
    comparatorOrder: Order,
    comparatorOrderBy: Key
  ): ((a: U, b: U) => number) => {
    return comparatorOrder === 'desc'
      ? (a, b) => descendingComparator(a, b, comparatorOrderBy)
      : (a, b) => -descendingComparator(a, b, comparatorOrderBy);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof U
  ): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler =
    (property: keyof U) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  useEffect(() => {
    if (
      (tableList === null && rows && rows.length > 0) ||
      (refresh && tableList && tableList.length > rows.length)
    ) {
      setTableList(rows);
      if (setRefresh) {
        setRefresh(false);
      }
    }
  }, [tableList, setTableList, rows, refresh, setRefresh]);

  const handleSearch = (property: string, value: string): void => {
    const filteredList = rows.filter((t) => {
      const attr = property as keyof U;
      const str = t[attr] as unknown as string;
      return str
        .toString()
        .toLocaleLowerCase()
        .includes(value.toLocaleLowerCase());
    });
    setTableList(filteredList ?? []);
  };

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {columns.map((c: T, index: number) => (
            <UINoBorderCell key={index}>
              {c.sortable ? (
                <React.Fragment>
                  <TableSortLabel
                    active={orderBy === c.id}
                    direction={order}
                    onClick={createSortHandler(c.id as keyof U)}
                  >
                    {c.headerName}
                  </TableSortLabel>
                  {type !== 'unmask' && (
                    <UIDefaultTextField
                      variant="standard"
                      sx={{
                        marginTop: '.2rem',
                        width: '100%',
                        input: { color: '#000' },
                      }}
                      onChange={({ target }) =>
                        handleSearch(c.id, target.value)
                      }
                    />
                  )}
                </React.Fragment>
              ) : (
                c.headerName
              )}
            </UINoBorderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableList &&
          stableSort<U>(tableList, getComparator(order, orderBy)).map(
            ([row, _], index) => {
              const isItemSelected = isSelected((row.name ?? '') as string);
              const labelId = `enhanced-table-checkbox-${index}`;
              const scoreValue: number | null =
                type === 'unmask' && row && 'score' in row
                  ? roundScoreIntelligently(
                      (row && 'score' in row
                        ? parseFloat(row.score as string)
                        : 0.0) ?? 0
                    )
                  : null;
              return (
                <TableRow
                  hover
                  onClick={() => handleClick((row.name ?? '') as string)}
                  role={tableRole}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={index}
                  selected={isItemSelected}
                >
                  {columns.map((property, index) => {
                    const { id: propertyId } = property;
                    return (
                      <UIBorderCell key={`reports-${index}-${propertyId}`}>
                        {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          row[propertyId]
                        }
                      </UIBorderCell>
                    );
                  })}
                </TableRow>
              );
            }
          )}
      </TableBody>
    </Table>
  );
}
