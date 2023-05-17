/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
} from '@mui/material';
import { UIContainer, UIFlexSpaceBox } from '@/components/UI';
import { RiskTableRow } from './RiskTableRow';
import { StyledHeader } from './ui';
import { RiskChartView } from './RiskChartView';
import { stableSort } from '@/libs/sort-utils';
import { useAppSelector } from '@/hooks';
import { Attribute } from '@/types/scoring.type';
import { scoredCategoriesTreeListSelector } from '@/redux/slices/entity.slice';

const UserDetailRiskView = ({
  entityId,
  onScrollToBasis,
}: {
  entityId: string;
  onScrollToBasis: (attributeId: string) => void;
}): JSX.Element => {
  const categoriesSelected: Attribute[] = useAppSelector(
    scoredCategoriesTreeListSelector(entityId)
  );
  type Order = 'asc' | 'desc';
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Attribute>('name');
  const [selectedRow, setSelectedRow] = useState<number>(-1);

  const descendingComparator = (
    a: Attribute,
    b: Attribute,
    comparatorOrderBy: keyof Attribute
  ): number => {
    if (
      a != null &&
      b != null &&
      comparatorOrderBy != null &&
      b[comparatorOrderBy] &&
      a[comparatorOrderBy]
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (b[comparatorOrderBy] < a[comparatorOrderBy]) {
        return -1;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (b[comparatorOrderBy] > a[comparatorOrderBy]) {
        return 1;
      }
    }
    return 0;
  };

  const getComparator = <Key extends keyof Attribute>(
    comparatorOrder: Order,
    comparatorOrderBy: Key
  ): ((a: Attribute, b: Attribute) => number) => {
    return comparatorOrder === 'desc'
      ? (a, b) => descendingComparator(a, b, comparatorOrderBy)
      : (a, b) => -descendingComparator(a, b, comparatorOrderBy);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Attribute
  ): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler =
    (property: keyof Attribute) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  return (
    <Box sx={{ background: '#FFFFFF' }}>
      <UIContainer>
        <StyledHeader>Risk Indicators</StyledHeader>
        <UIFlexSpaceBox sx={{ alignItems: 'flex-start' }}>
          <Box width="50%">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={order}
                      onClick={createSortHandler('name')}
                    >
                      Risk Indicator
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'score'}
                      direction={order}
                      onClick={createSortHandler('score')}
                    >
                      Risk Score
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoriesSelected &&
                  categoriesSelected.length > 0 &&
                  stableSort<Attribute>(
                    categoriesSelected,
                    getComparator(order, orderBy)
                  ).map((row, index) => (
                    <RiskTableRow
                      key={index}
                      row={row}
                      index={index}
                      onScrollToBasis={onScrollToBasis}
                      selectedRow={selectedRow}
                      setSelectedRow={setSelectedRow}
                    />
                  ))}
              </TableBody>
            </Table>
          </Box>
          <Box sx={{ width: '50%', marginTop: '7px' }}>
            <RiskChartView selectedRisk={selectedRow} />
          </Box>
        </UIFlexSpaceBox>
      </UIContainer>
    </Box>
  );
};

export default UserDetailRiskView;
