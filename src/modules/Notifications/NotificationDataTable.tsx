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
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ICON_URLS, NOTIFICATION_TAB } from '@/constants';
import { CustomJustification } from '@/components/Custom';
import {
  UIFlexWrapBox,
  UIIOSSwitch,
  UINameChip,
  UIScorebox,
  UIScoreChip,
  UIStatusChip,
  UIBorderCell,
} from '@/components/UI';
import { stableSort } from '@/libs/sort-utils';
import { roundScoreIntelligently } from '@/libs/math-utils';
import { getScoreColor } from '@/libs/color-generator';
import { appImageLoader } from '@/libs/image-loader';
import { noop } from 'lodash';

interface IRequiredProps {
  [key: string]: unknown;
  headerName?: string;
  sortable?: boolean;
  field?: string;
  id: string;
}

interface INotificationDataTableProps<
  T extends IRequiredProps,
  U extends IRequiredProps
> {
  columns: T[];
  rows: U[];
  tableRole: string;
  type: string;
  orderField: keyof U;
}

type OrderDirection = 'asc' | 'desc';

export default function NotificationDataTable<
  T extends IRequiredProps,
  U extends IRequiredProps
>(props: INotificationDataTableProps<T, U>): JSX.Element {
  const router = useRouter();
  const { type: activeTab } = router.query as { type: string };

  const [orderDirection, setOrderDirection] = useState<OrderDirection>('asc');
  const [orderField, setOrderField] = useState<keyof U>(props.orderField);
  const [isOpenJusDlg, setOpenJusDlg] = useState<boolean>(false);
  const [masking, setMasking] = useState<string[]>([]);

  useEffect(() => {
    if (activeTab === NOTIFICATION_TAB.MANAGE) {
      const arr = props.rows
        .filter((row) => row.isMasking)
        .map((row) => row.id);
      setMasking(arr);
    }
  }, [activeTab, props.rows]);

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
    comparatorOrder: OrderDirection,
    comparatorOrderBy: Key
  ): ((a: U, b: U) => number) => {
    return comparatorOrder === 'desc'
      ? (a, b) => descendingComparator(a, b, comparatorOrderBy)
      : (a, b) => -descendingComparator(a, b, comparatorOrderBy);
  };

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof U
  ): void => {
    const isAsc = orderField === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderField(property);
  };

  const createSortHandler =
    (property: keyof U) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  const handleChangeMask = (index: string): void => {
    if (masking.some((mask) => mask === index)) {
      setMasking(masking.filter((mask) => mask !== index));
    } else {
      setMasking([...masking, index]);
    }
  };

  const headCellRenderer = (cell: T, index: number): JSX.Element => (
    <UIBorderCell
      align={cell.id === 'action' ? 'center' : 'left'}
      key={`notification-table-${index}`}
    >
      {cell.sortable ? (
        <TableSortLabel onClick={createSortHandler(cell.id as keyof U)}>
          {cell.headerName}
        </TableSortLabel>
      ) : (
        cell.headerName
      )}
    </UIBorderCell>
  );

  const renderCell = (
    cells: { field: string; val: string }[]
  ): { [key: string]: JSX.Element } => {
    const elements = cells.map((cell, index) => {
      const key = `notification-cell-${cell.field}-${index}`;
      let element = {
        [cell.field]: <UIBorderCell key={key}>{cell.val}</UIBorderCell>,
      };
      element = {
        ...element,
        status: (
          <UIBorderCell key={key}>
            <UIStatusChip label={cell.val} condition={cell.val === 'New'} />
          </UIBorderCell>
        ),
        name: (
          <UIBorderCell key={key}>
            {cell.val === 'Unmask' ? (
              <UINameChip
                label={cell.val}
                icon={
                  <Image
                    src={ICON_URLS.eye}
                    loader={appImageLoader}
                    width={18}
                    height={18}
                    alt={cell.val}
                  />
                }
                condition={cell.val === 'Unmask'}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setOpenJusDlg(true);
                }}
              />
            ) : (
              cell.val
            )}
          </UIBorderCell>
        ),
        score: (
          <UIBorderCell key={key}>
            <UIScorebox>
              <UIScoreChip
                label={roundScoreIntelligently(parseFloat(cell.val) ?? 0)}
                bgColor={getScoreColor(
                  roundScoreIntelligently(parseFloat(cell.val) ?? 0)
                )}
              />
            </UIScorebox>
          </UIBorderCell>
        ),
      };
      return element;
    });

    const result: { [key: string]: JSX.Element } = {};
    elements.forEach((element) => {
      const arr = Object.entries(element)[0];
      const key = arr[0];
      const val = arr[1];
      result[key] = val;
    });

    return result;
  };

  const rowRenderer = (row: U, rowIndex: number, columns: T[]): JSX.Element => {
    const cells = columns.map((col) => {
      const field = col.field as string;
      const val = row[`${field}`] as string;
      return { field, val };
    });

    return (
      <TableRow hover role={props.tableRole} tabIndex={-1} key={rowIndex}>
        {columns.map((col) => renderCell(cells)[col.field as string])}
        {activeTab === NOTIFICATION_TAB.VIEW && (
          <UIBorderCell align="center">
            <Image
              src={ICON_URLS.delete}
              loader={appImageLoader}
              width={18}
              height={18}
              alt="delete"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                console.log('delete');
              }}
            />
          </UIBorderCell>
        )}
        {activeTab === NOTIFICATION_TAB.MANAGE && (
          <UIBorderCell align="center">
            <UIFlexWrapBox sx={{ justifyContent: 'space-evenly' }}>
              <UIIOSSwitch
                checked={masking.some((mask) => mask === row.id)}
                onChange={() => handleChangeMask(row.id)}
              />
              <Image
                src={ICON_URLS.edit}
                loader={appImageLoader}
                width={20}
                height={20}
                alt="edit"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  console.log('edit');
                }}
              />
              <Image
                src={ICON_URLS.delete}
                loader={appImageLoader}
                width={20}
                height={20}
                alt="delete"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  console.log('delete');
                }}
              />
            </UIFlexWrapBox>
          </UIBorderCell>
        )}
      </TableRow>
    );
  };

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {props.columns.map((col: T, index: number) =>
            headCellRenderer(col, index)
          )}
          <UIBorderCell align="center">Action</UIBorderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.rows &&
          stableSort<U>(
            props.rows,
            getComparator(orderDirection, orderField)
          ).map(([row, _], index) => rowRenderer(row, index, props.columns))}
      </TableBody>
      <CustomJustification
        open={isOpenJusDlg}
        onClose={() => setOpenJusDlg(false)}
        submitFn={noop}
      />
    </Table>
  );
}
