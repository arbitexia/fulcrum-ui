/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import React, { useState } from 'react';
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
import { NewMaskingStatusParams } from '@/types/governance.type';
import {
  removeNotification,
  removeNotificationEvent,
  setNewMasking,
} from '@/redux/slices';
import { useAppDispatch } from '@/hooks';

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
  accessToken: string;
  columns: T[];
  rows: U[];
  tableRole: string;
  type: string;
  orderField: keyof U;
  setOpenEditDialog: () => void;
  setNotificationId: (notificationId: string) => void;
  setNotificationType: (notificationType: string) => void;
  setModelId: (modelId: string) => void;
  setCategoryName: (categoryName: string) => void;
  setThreshold: (threshold: number) => void;
  useInputs: (inputs: boolean) => void;
  submitNotificationChange: ({
    notificationId,
    notificationType,
    modelId,
    categoryName,
    threshold,
    active,
  }: {
    notificationId: string | null;
    notificationType: string;
    modelId: string;
    categoryName: string;
    threshold: number;
    active?: boolean;
  }) => void;
}

type OrderDirection = 'asc' | 'desc';

export default function NotificationDataTable<
  T extends IRequiredProps,
  U extends IRequiredProps
>(props: INotificationDataTableProps<T, U>): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { type: activeTab } = router.query as { type: string };

  const [orderDirection, setOrderDirection] = useState<OrderDirection>('asc');
  const [orderField, setOrderField] = useState<keyof U>(props.orderField);
  const [isOpenJusDlg, setOpenJusDlg] = useState<boolean>(false);
  const [entityId, setEntityId] = useState<string | null>(null);
  const [score, setScore] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);
  const [scoringInstance, setScoringInstance] = useState<number | null>(null);

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
    cells: { field: string; val: string }[],
    row: U
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
                  setModelId(row.model as string);
                  setScore(row.score as string);
                  setScoringInstance(row.scoringInstance as number);
                  setEntityId(row.entityId as string);
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
        active: (
          <UIBorderCell key={key}>
            <UIIOSSwitch
              checked={row.active as boolean}
              onChange={() =>
                props.submitNotificationChange({
                  notificationId: row.id as string,
                  notificationType: row.notificationType as string,
                  modelId: row.model as string,
                  categoryName: row.category as string,
                  threshold: parseInt(row.threshold as string),
                  active: row.active !== true,
                })
              }
            />
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

  const deleteNotification = (notificationId: string): void => {
    dispatch(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      removeNotification({
        accessToken: props.accessToken,
        notificationId,
      })
    );
  };

  const deleteNotificationEvent = (
    notificationId: string,
    deleteEntityId: string,
    deleteScoringInstance: number
  ): void => {
    dispatch(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      removeNotificationEvent({
        accessToken: props.accessToken,
        notificationId,
        entityId: deleteEntityId,
        scoringInstance: deleteScoringInstance,
      })
    );
  };

  const rowRenderer = (row: U, rowIndex: number, columns: T[]): JSX.Element => {
    const cells = columns.map((col) => {
      const field = col.field as string;
      const val = row[`${field}`] as string;
      return { field, val };
    });

    return (
      <TableRow hover role={props.tableRole} tabIndex={-1} key={rowIndex}>
        {columns.map((col) => renderCell(cells, row)[col.field as string])}
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
                deleteNotificationEvent(
                  row.id as string,
                  row.entityId as string,
                  row.scoringInstance as number
                );
              }}
            />
          </UIBorderCell>
        )}
        {activeTab === NOTIFICATION_TAB.MANAGE && (
          <UIBorderCell align="center">
            <UIFlexWrapBox sx={{ justifyContent: 'space-evenly' }}>
              <Image
                src={ICON_URLS.edit}
                loader={appImageLoader}
                width={20}
                height={20}
                alt="edit"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  props.setNotificationId(row.id as string);
                  props.setNotificationType(row.notificationType as string);
                  props.setModelId(row.model as string);
                  props.setCategoryName(row.category as string);
                  props.setThreshold(parseFloat(row.threshold as string));
                  props.useInputs(true);
                  props.setOpenEditDialog();
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
                  deleteNotification(row.id as string);
                }}
              />
            </UIFlexWrapBox>
          </UIBorderCell>
        )}
      </TableRow>
    );
  };

  const justificationFn = (
    selectedItems: string[],
    justificationText: string
  ): void => {
    if (
      entityId !== null &&
      score !== null &&
      modelId !== null &&
      scoringInstance !== null
    ) {
      const args: NewMaskingStatusParams = {
        accessToken: props.accessToken,
        userId: '',
        entityId,
        status: 'in-review',
        justification: `${selectedItems.join(',')}: ${justificationText}`,
        lastUpdateDate: Date.now(),
        score: (parseInt(score) / 100).toString(),
        modelId,
        scoringInstance,
      };
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setNewMasking(args)
      );
    }
  };

  const submitJustificationFn =
    props.type === NOTIFICATION_TAB.VIEW ? justificationFn : noop;

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
      {props.type === NOTIFICATION_TAB.VIEW && (
        <CustomJustification
          open={isOpenJusDlg}
          onClose={() => {
            setOpenJusDlg(false);
            setModelId(null);
            setScore(null);
            setScoringInstance(null);
            setEntityId(null);
          }}
          submitFn={submitJustificationFn}
        />
      )}
    </Table>
  );
}
