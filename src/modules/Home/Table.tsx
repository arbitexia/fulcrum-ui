/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  UIFlexCenterBox,
  UIStatusChip,
  UIScoreChip,
  UINameChip,
} from '@/components/UI';
import { StyledTableCell } from './ui';
import { appImageLoader } from '@/libs/image-loader';
import { HomeJustification } from './Justification';
import { stableSort } from '@/libs/sort-utils';
import { noop } from 'lodash';
import {
  convertEntitiesPropertiesToDashBoardTable,
  getEntitiesConfigInitialized,
  getEntityProperties,
  getSelectedModelId,
} from '@/redux/slices';
import { useAppSelector } from '@/hooks';
import { roundScoreIntelligently } from '@/libs/math-utils';
import { getScoreColor } from '@/libs/color-generator';
import { formatKey } from '@/libs/string-utils';
import { PropertyType } from '@/types/entity.type';
import { EntityProperty, EntityPropertyBase } from '@/types';
import { objectHasPropertyName } from '@/libs/object-utils';

export const HomeUserTable = (): JSX.Element => {
  const [openDlg, setOpenDlg] = useState<boolean>(false);
  const router = useRouter();
  type Order = 'asc' | 'desc';
  const entitiesSelected: PropertyType[] = useAppSelector(
    convertEntitiesPropertiesToDashBoardTable
  );
  const entitiesConfigState = useAppSelector(getEntityProperties);
  const displayEntitiesName = entitiesConfigState
    ? [
      'status',
      'score',
      ...entitiesConfigState.filter((entityProperty) => {
        if (objectHasPropertyName(entityProperty, 'propertyName')) {
          const entityPropertyBase: EntityPropertyBase =
            entityProperty as EntityPropertyBase;
          return entityPropertyBase.propertyName !== 'icon';
        } else {
          return entityProperty !== 'icon';
        }
      }),
    ]
    : ['status', 'score', 'name'];
  const [entities, setEntities] = useState<PropertyType[] | null>(null);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof PropertyType>('score');
  const isEntitiesConfigInitialized = useAppSelector(
    getEntitiesConfigInitialized
  );
  const selectedModelId = useAppSelector(getSelectedModelId);

  useEffect(() => {
    setEntities(entitiesSelected);
  }, [entities, entitiesSelected]);

  const descendingComparator = <PropertyType,>(
    a: PropertyType,
    b: PropertyType,
    comparatorOrderBy: keyof PropertyType
  ): number => {
    if (b[comparatorOrderBy] < a[comparatorOrderBy]) {
      return -1;
    }
    if (b[comparatorOrderBy] > a[comparatorOrderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = <Key extends keyof PropertyType>(
    comparatorOrder: Order,
    comparatorOrderBy: Key
  ): ((a: PropertyType, b: PropertyType) => number) => {
    return comparatorOrder === 'desc'
      ? (a, b) => descendingComparator(a, b, comparatorOrderBy)
      : (a, b) => -descendingComparator(a, b, comparatorOrderBy);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof PropertyType
  ): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler =
    (property: keyof PropertyType) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  if (!entities || !isEntitiesConfigInitialized) {
    return <CircularProgress />;
  }

  if (entities.length === 0) {
    return <React.Fragment />;
  }

  const propertyToElement: {
    [propertyName: keyof PropertyType]: ({
      row,
      entityIndex,
      values,
    }: {
      row: PropertyType;
      entityIndex: number;
      values?: string[];
    }) => JSX.Element;
  } = {
    name: ({
      row,
      entityIndex,
      values,
    }: {
      row: PropertyType;
      entityIndex: number;
      values?: string[];
    }): JSX.Element => {
      const concatNameValues = values
        ? values
          .map((value: keyof PropertyType) => row[value])
          .filter((rowValue: string) => rowValue)
          .join(' ')
        : '';
      const nameValue: string =
        values &&
          values.length > 0 &&
          concatNameValues &&
          concatNameValues.length > 0
          ? concatNameValues
          : row.name;
      return (
        <StyledTableCell align="center" key={entityIndex}>
          {row.icon ? (
            <UINameChip
              label={nameValue}
              icon={
                <Image
                  src={row.icon}
                  loader={appImageLoader}
                  width={18}
                  height={18}
                  alt={nameValue}
                />
              }
              condition={nameValue === 'Unmask'}
            />
          ) : (
            nameValue
          )}
        </StyledTableCell>
      );
    },
    status: ({
      row,
      entityIndex,
    }: {
      row: PropertyType;
      entityIndex: number;
    }): JSX.Element => (
      <StyledTableCell align="center" key={entityIndex}>
        <UIStatusChip label={row.status} condition={row.status === 'New'} />
      </StyledTableCell>
    ),
    score: ({
      row,
      entityIndex,
    }: {
      row: PropertyType;
      entityIndex: number;
    }): JSX.Element => (
      <StyledTableCell align="center" key={entityIndex}>
        <UIFlexCenterBox>
          <UIScoreChip
            label={roundScoreIntelligently(parseFloat(row.score))}
            bgColor={getScoreColor(
              roundScoreIntelligently(parseFloat(row.score))
            )}
          />
        </UIFlexCenterBox>
      </StyledTableCell>
    ),
  };

  const defaultElement = ({
    row,
    propertyName,
    values,
    entityIndex,
  }: {
    row: PropertyType;
    propertyName: keyof PropertyType;
    values?: (keyof PropertyType)[];
    entityIndex: number;
  }): JSX.Element => {
    const concatNameValues = values
      ? values
        .map((value: keyof PropertyType) => {
          return row[value];
        })
        .filter((rowValue: string) => rowValue)
        .join(' ')
        .trim()
      : '';
    const nameValue: string =
      values &&
        values.length > 0 &&
        concatNameValues &&
        concatNameValues.length > 0
        ? concatNameValues
        : row[propertyName];
    return <StyledTableCell key={entityIndex}>{nameValue}</StyledTableCell>;
  };

  const routePropertyIntelligently = (
    row: PropertyType,
    entityProperty: EntityProperty,
    entityIndex: number
  ): JSX.Element => {
    const propertyName: string = objectHasPropertyName(
      entityProperty,
      'propertyName'
    )
      ? (entityProperty as EntityPropertyBase).propertyName
      : (entityProperty as string);
    const values: string[] | undefined = objectHasPropertyName(
      entityProperty,
      'values'
    )
      ? (entityProperty as EntityPropertyBase).values
      : undefined;
    if (propertyName in propertyToElement) {
      if (values) {
        return propertyToElement[propertyName]({ row, entityIndex, values });
      } else {
        return propertyToElement[propertyName]({ row, entityIndex });
      }
    }
    return defaultElement({ row, propertyName, values, entityIndex });
  };

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            {displayEntitiesName &&
              displayEntitiesName.length > 0 &&
              displayEntitiesName.map(
                (entityProperty: EntityProperty, index: number) => {
                  const entityName: string = objectHasPropertyName(
                    entityProperty,
                    'propertyName'
                  )
                    ? (entityProperty as EntityPropertyBase).propertyName
                    : (entityProperty as string);
                  return (
                    <TableCell key={index}>
                      <TableSortLabel
                        active={orderBy === entityName}
                        direction={order}
                        onClick={createSortHandler(entityName)}
                      >
                        {formatKey(entityName, ['id', 'eid', 'pc'])}
                      </TableSortLabel>
                    </TableCell>
                  );
                }
              )}
          </TableRow>
        </TableHead>
        <TableBody>
          {displayEntitiesName &&
            displayEntitiesName.length > 0 &&
            entities &&
            entities.length > 0 &&
            stableSort<PropertyType>(
              entities,
              getComparator(order, orderBy)
            ).map((row) => {
              const onClickDialog: () => void = () => {
                setOpenDlg(true);
              };
              const onClickEntity: () => void = () => {
                router
                  .push(
                    `/entities/${row.id}?modelId=${selectedModelId}`,
                    `/entities/${row.id}`
                  )
                  .then(noop);
              };
              const onClickRow = row.icon ? onClickDialog : onClickEntity;
              return (
                <TableRow
                  sx={{
                    background: '#ffffff',
                    cursor: 'pointer',
                    '&:hover': { background: '#acacac' },
                  }}
                  key={row.id}
                  onClick={onClickRow}
                >
                  {displayEntitiesName.map(
                    (entityProperty: EntityProperty, entityIndex: number) =>
                      routePropertyIntelligently(
                        row,
                        entityProperty,
                        entityIndex
                      )
                  )}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <HomeJustification open={openDlg} onClose={() => setOpenDlg(false)} />
    </>
  );
};
