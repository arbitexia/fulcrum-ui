/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableSortLabel,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { RiskHistoricalTableDataType } from '@/types';
import { StyledNoBorderCell, StyledBorderCell } from '../ui';
import { riskHistoricalTableData } from '@/_mock';
import { UIDefaultTextField } from '@/components/UI';
import { stableSort } from '@/libs/sort-utils';

const BuildRiskHistoricalTable = (): JSX.Element => {
  type Order = 'asc' | 'desc';
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] =
    useState<keyof RiskHistoricalTableDataType>('value');
  const [tableList, setTableList] = useState<
    RiskHistoricalTableDataType[] | null
  >(null);

  useEffect(() => {
    setTableList(riskHistoricalTableData);
  }, [setTableList]);

  const descendingComparator = <RiskHistoricalTableDataType,>(
    a: RiskHistoricalTableDataType,
    b: RiskHistoricalTableDataType,
    comparatorOrderBy: keyof RiskHistoricalTableDataType
  ): number => {
    if (b[comparatorOrderBy] < a[comparatorOrderBy]) {
      return -1;
    }
    if (b[comparatorOrderBy] > a[comparatorOrderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = <Key extends keyof RiskHistoricalTableDataType>(
    comparatorOrder: Order,
    comparatorOrderBy: Key
  ): ((
    a: RiskHistoricalTableDataType,
    b: RiskHistoricalTableDataType
  ) => number) => {
    return comparatorOrder === 'desc'
      ? (a, b) => descendingComparator(a, b, comparatorOrderBy)
      : (a, b) => -descendingComparator(a, b, comparatorOrderBy);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof RiskHistoricalTableDataType
  ): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler =
    (property: keyof RiskHistoricalTableDataType) =>
    (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  return (
    <>
      <Table size="small" sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <StyledNoBorderCell
              sx={{ fontSize: '14px', fontWeight: '700', paddingLeft: 0 }}
            >
              <TableSortLabel
                active={orderBy === 'value'}
                direction={order}
                onClick={createSortHandler('value')}
                sx={{ paddingLeft: '16px' }}
              >
                Value
              </TableSortLabel>
              <UIDefaultTextField
                id="input-with-icon-textfield"
                placeholder="filter"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
                sx={{
                  mt: 2,
                  width: '170px',
                  input: {
                    color: '#2E2C34',
                    fontSize: 14,
                    '&::placeholder': {
                      fontStyle: 'italic',
                    },
                  },
                }}
              />
            </StyledNoBorderCell>
            <StyledNoBorderCell
              align="right"
              sx={{
                fontSize: '14px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <TableSortLabel
                active={orderBy === 'occurrence'}
                direction={order}
                onClick={createSortHandler('occurrence')}
              >
                Number of Occurrences
              </TableSortLabel>
            </StyledNoBorderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableList &&
            stableSort<RiskHistoricalTableDataType>(
              tableList,
              getComparator(order, orderBy)
            ).map((row) => {
              return (
                <TableRow sx={{ background: '#ffffff' }} key={row.id}>
                  <StyledBorderCell
                    sx={{ fontSize: '14px', paddingLeft: '30px' }}
                  >
                    {row.value}
                  </StyledBorderCell>
                  <StyledBorderCell
                    sx={{ fontSize: '14px', width: '91px', textAlign: 'right' }}
                  >
                    {row.occurrence}
                  </StyledBorderCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
};

export default BuildRiskHistoricalTable;
