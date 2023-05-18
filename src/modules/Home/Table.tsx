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
import { noop } from 'lodash';
import Image from 'next/image';
import { CustomJustification } from '@/components/Custom';
import { UIStatusChip, UIScoreChip, UINameChip } from '@/components/UI';
import { appImageLoader } from '@/libs/image-loader';
import { stableSort } from '@/libs/sort-utils';
import { roundScoreIntelligently } from '@/libs/math-utils';
import { getScoreColor } from '@/libs/color-generator';
import { formatKey } from '@/libs/string-utils';
import {
  convertEntitiesPropertiesToDashBoardTable,
  getEntitiesConfigInitialized,
  getEntityProperties,
  getSelectedModelId,
  setNewMasking,
} from '@/redux/slices';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { EntityProperty, EntityPropertyBase, PropertyType } from '@/types';
import { objectHasPropertyName } from '@/libs/object-utils';
import { StyledTableCell } from './ui';
import { getMaxInstanceNumber } from '@/redux/slices/stat.slice';
import { NewMaskingStatusParams } from '@/types/governance.type';

export const HomeUserTable = ({
  accessToken,
}: {
  accessToken: string;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const [openDlg, setOpenDlg] = useState<boolean>(false);
  const router = useRouter();
  type Order = 'asc' | 'desc';
  const entitiesSelected: PropertyType[] = useAppSelector(
    convertEntitiesPropertiesToDashBoardTable
  );
  const entitiesConfigState = useAppSelector(getEntityProperties);
  const isEntitiesConfigInitialized = useAppSelector(
    getEntitiesConfigInitialized
  );
  const selectedModelId = useAppSelector(getSelectedModelId);
  const maxInstanceNumber = useAppSelector(getMaxInstanceNumber);
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
  const [entityId, setEntityId] = useState<string | null>(null);
  const [score, setScore] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof PropertyType>('score');

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

  const submitJustificationFn = (
    selectedItems: string[],
    justificationText: string
  ): void => {
    if (entityId !== null && score !== null) {
      const args: NewMaskingStatusParams = {
        accessToken,
        userId: '',
        entityId,
        status: 'in-review',
        justification: `${selectedItems.join(',')}: ${justificationText}`,
        lastUpdateDate: Date.now(),
        score: (parseInt(score) / 100).toString(),
        modelId: selectedModelId,
        scoringInstance: maxInstanceNumber,
      };
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setNewMasking(args)
      );
    }
  };

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
            .filter((rowValue: string | number | boolean | null) => rowValue)
            .join(' ')
        : '';
      const nameValue: string | number | boolean | null =
        values &&
        values.length > 0 &&
        concatNameValues &&
        concatNameValues.length > 0
          ? concatNameValues
          : row.name;
      const isMaskedNameValue =
        row.maskingStatus === 'in-review' ? 'Sent for approval' : 'Unmask';
      const displayNameValue = row.isMasked ? isMaskedNameValue : nameValue;
      return (
        <StyledTableCell key={entityIndex}>
          {row.icon ? (
            <UINameChip
              label={displayNameValue}
              sx={{ cursor: 'pointer' }}
              icon={
                <Image
                  src={row.icon as string}
                  loader={appImageLoader}
                  width={18}
                  height={18}
                  alt={displayNameValue as string}
                />
              }
              condition={displayNameValue === 'Unmask'}
            />
          ) : (
            displayNameValue
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
    }): JSX.Element => {
      if (row.isMasked) {
        return (
          <StyledTableCell
            key={entityIndex}
            onClick={() => setOpenDlg(true)}
            sx={{ cursor: 'pointer' }}
          >
            <UIStatusChip label={row.status} condition={true} />
          </StyledTableCell>
        );
      }
      return (
        <StyledTableCell key={entityIndex} sx={{ cursor: 'pointer' }}>
          <UIStatusChip label={row.status} condition={row.status === 'New'} />
        </StyledTableCell>
      );
    },
    score: ({
      row,
      entityIndex,
    }: {
      row: PropertyType;
      entityIndex: number;
    }): JSX.Element => (
      <StyledTableCell
        key={entityIndex}
        sx={{ paddingLeft: '25px', cursor: 'pointer' }}
      >
        <UIScoreChip
          label={roundScoreIntelligently(parseFloat(row.score as string))}
          bgColor={getScoreColor(
            roundScoreIntelligently(parseFloat(row.score as string))
          )}
        />
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
          .filter((rowValue: string | number | boolean | null) => rowValue)
          .join(' ')
          .trim()
      : '';
    const nameValue: string | number | boolean | null =
      values &&
      values.length > 0 &&
      concatNameValues &&
      concatNameValues.length > 0
        ? concatNameValues
        : row[propertyName];
    return (
      <StyledTableCell sx={{ cursor: 'pointer' }} key={entityIndex}>
        {nameValue}
      </StyledTableCell>
    );
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
          stableSort<PropertyType>(entities, getComparator(order, orderBy)).map(
            ([row, _]) => {
              const onClickDialog: () => void = () => {
                setEntityId(row.id as string);
                setScore(row.score as string);
                setOpenDlg(true);
              };
              const onClickEntity: () => void = () => {
                router
                  .push(
                    `/entities/${
                      row.id
                    }?modelId=${selectedModelId}&unmaskToken=${encodeURIComponent(
                      row.unmaskToken as string
                    )}`,
                    `/entities/${row.id}`
                  )
                  .then(noop);
              };
              const isJustificationDialog: boolean =
                (row.icon !== null &&
                  row.icon !== undefined &&
                  row.icon.toString().length > 0) ||
                (row.isMasked as boolean);
              const onClickRow = isJustificationDialog
                ? onClickDialog
                : onClickEntity;
              return (
                <TableRow
                  sx={{
                    background: '#ffffff',
                    cursor: 'pointer',
                    '&:hover': { background: '#acacac' },
                  }}
                  key={row.id as string}
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
            }
          )}
      </TableBody>
      <CustomJustification
        open={openDlg}
        onClose={() => {
          setEntityId(null);
          setScore(null);
          setOpenDlg(false);
        }}
        submitFn={submitJustificationFn}
      />
    </Table>
  );
};
