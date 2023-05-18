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
  Button,
} from '@mui/material';
import {
  UIContainer,
  UIFlexWrapBox,
  UIFlexSpaceBox,
  UITabPanel,
} from '@/components/UI';
import { RiskTableRow } from './RiskTableRow';
import { StyledHeader, StyledTabText } from './ui';
import { RiskChartView } from './RiskChartView';
import { stableSort } from '@/libs/sort-utils';
import { useAppSelector } from '@/hooks';
import { Attribute } from '@/types/scoring.type';
import { scoredCategoriesTreeListSelector } from '@/redux/slices/entity.slice';
import SpiderChart from './SpiderChart';
import { getPeerCompareData } from '@/redux/slices/stat.slice';
import {
  getPeerGroupHash,
  getPeerGroupHashCallFailedForModelId,
} from '@/redux/slices/scoring.slice';

const UserDetailRiskView = ({
  entityId,
  modelId,
  modelInstance,
  onScrollToBasis,
  accessToken = null,
}: {
  entityId: string;
  modelId: string;
  modelInstance: number;
  onScrollToBasis: (attributeId: string) => void;
  accessToken: string | null;
}): JSX.Element => {
  const categoriesSelected: Attribute[] = useAppSelector(
    scoredCategoriesTreeListSelector(entityId)
  );
  const peerGroupHashCallFailed = useAppSelector(
    getPeerGroupHashCallFailedForModelId(modelId)
  );
  type Order = 'asc' | 'desc';
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Attribute>('name');
  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const [originalIndexRow, setOriginalIndexRow] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<'overTime' | 'peerCompare'>(
    'overTime'
  );
  const peerGroupHash = useAppSelector(getPeerGroupHash);
  const peerCompareChartData = useAppSelector(
    getPeerCompareData(entityId, modelId, peerGroupHash ?? 0, originalIndexRow)
  );

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
      const aValue: Attribute[keyof Attribute] = a[comparatorOrderBy];
      const bValue: Attribute[keyof Attribute] = b[comparatorOrderBy];
      if (aValue && bValue) {
        if (bValue < aValue) {
          return -1;
        }
        if (bValue > aValue) {
          return 1;
        }
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
                  ).map(([row, originalIndex], index) => (
                    <RiskTableRow
                      key={index}
                      entityId={entityId}
                      row={row}
                      index={index}
                      onScrollToBasis={onScrollToBasis}
                      selectedRow={selectedRow}
                      setSelectedRow={setSelectedRow}
                      originalIndex={originalIndex}
                      setOriginalIndex={setOriginalIndexRow}
                      modelId={modelId}
                      modelInstance={modelInstance}
                      accessToken={accessToken}
                    />
                  ))}
              </TableBody>
            </Table>
          </Box>
          <UIFlexWrapBox sx={{ width: '50%', marginTop: '7px' }}>
            <Button onClick={() => setActiveTab('overTime')} variant="text">
              <StyledTabText
                sx={{
                  color: activeTab === 'overTime' ? '#C62828' : '#283238',
                  borderBottom:
                    activeTab === 'overTime' ? 'solid 1px #C62828' : 'none',
                }}
              >
                Risk Indicators Over Time
              </StyledTabText>
            </Button>
            {!peerGroupHashCallFailed && peerGroupHash !== null && (
              <Button onClick={() => setActiveTab('peerCompare')}>
                <StyledTabText
                  sx={{
                    color: activeTab === 'peerCompare' ? '#C62828' : '#283238',
                    borderBottom:
                      activeTab === 'peerCompare'
                        ? 'solid 1px #C62828'
                        : 'none',
                  }}
                >
                  Peer Compare
                </StyledTabText>
              </Button>
            )}
            <Box sx={{ width: '100%', height: '100%', marginTop: '7px' }}>
              {activeTab === 'overTime' && (
                <UITabPanel value={0} index={0}>
                  <RiskChartView
                    entityId={entityId}
                    selectedCategory={originalIndexRow}
                  />
                </UITabPanel>
              )}
              {activeTab === 'peerCompare' &&
                !peerGroupHashCallFailed &&
                peerGroupHash !== null &&
                peerCompareChartData && (
                  <UITabPanel value={1} index={1}>
                    <SpiderChart chartData={peerCompareChartData} />
                  </UITabPanel>
                )}
            </Box>
          </UIFlexWrapBox>
        </UIFlexSpaceBox>
      </UIContainer>
    </Box>
  );
};

export default UserDetailRiskView;
