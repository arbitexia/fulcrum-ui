/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
} from '@mui/material';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import { StyledNoBorderCell, StyledBorderCell } from './ui';
import { stableSort } from '@/libs/sort-utils';
import { UIFlexCenterBox, UIFlexWrapBox } from '@/components/UI';
import { ConfigurationTableType } from '@/types/models.type';

const ConfigurationTable = ({
  data,
  url,
  actions,
  onActionClick,
}: {
  data: ConfigurationTableType[];
  url: string;
  actions: string[];
  onActionClick: (url: string, action: string, id: number | string) => void;
}): JSX.Element => {
  type Order = 'asc' | 'desc';
  const firstItem = data && data.length > 0 && data[0];

  const nameOrderKey: string =
    firstItem && 'listId' in firstItem ? 'listId' : 'name';
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ConfigurationTableType>(
    nameOrderKey as keyof ConfigurationTableType
  );
  const [tableList, setTableList] = useState<ConfigurationTableType[] | null>(
    null
  );

  const onAction = (action: string, id: number | string): void => {
    onActionClick(url, action, id);
  };

  useEffect(() => {
    setTableList(data);
  }, [data]);

  const descendingComparator = <ModelsTableDataType, Model, RiskIndicatorType>(
    a: ModelsTableDataType | Model | RiskIndicatorType,
    b: ModelsTableDataType | Model | RiskIndicatorType,
    comparatorOrderBy: keyof (ModelsTableDataType | Model | RiskIndicatorType)
  ): number => {
    if (b[comparatorOrderBy] < a[comparatorOrderBy]) {
      return -1;
    }
    if (b[comparatorOrderBy] > a[comparatorOrderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = <Key extends keyof ConfigurationTableType>(
    comparatorOrder: Order,
    comparatorOrderBy: Key
  ): ((a: ConfigurationTableType, b: ConfigurationTableType) => number) => {
    return comparatorOrder === 'desc'
      ? (a, b) => descendingComparator(a, b, comparatorOrderBy)
      : (a, b) => -descendingComparator(a, b, comparatorOrderBy);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ConfigurationTableType
  ): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler =
    (property: keyof ConfigurationTableType) =>
      (event: React.MouseEvent<unknown>) => {
        handleRequestSort(event, property);
      };

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledNoBorderCell>
              <TableSortLabel
                active={orderBy === nameOrderKey}
                direction={order}
                onClick={createSortHandler(
                  nameOrderKey as keyof ConfigurationTableType
                )}
              >
                Name
              </TableSortLabel>
            </StyledNoBorderCell>
            <StyledNoBorderCell>Description</StyledNoBorderCell>
            <StyledNoBorderCell>
              <TableSortLabel
                active={orderBy === 'owner'}
                direction={order}
                onClick={createSortHandler('owner')}
              >
                Owner
              </TableSortLabel>
            </StyledNoBorderCell>
            <StyledNoBorderCell>
              <TableSortLabel
                active={orderBy === 'lastUpdate'}
                direction={order}
                onClick={createSortHandler('lastUpdate')}
              >
                Last Update
              </TableSortLabel>
            </StyledNoBorderCell>
            {tableList && tableList[0]?.status && (
              <StyledNoBorderCell align="center">
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={order}
                  onClick={createSortHandler('status')}
                >
                  Scoring Status
                </TableSortLabel>
              </StyledNoBorderCell>
            )}
            <StyledNoBorderCell>Actions</StyledNoBorderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableList &&
            stableSort<ConfigurationTableType>(
              tableList,
              getComparator(order, orderBy)
            ).map((row) => {
              const rowKey = 'id' in row ? row.id : row.listId;
              return (
                <TableRow
                  sx={{
                    background: '#ffffff',
                    '&:hover': { background: '#acacac' },
                  }}
                  key={rowKey}
                >
                  <StyledBorderCell
                    sx={{ height: '50px', fontWeight: 700, fontSize: '14px' }}
                  >
                    {row && 'listId' in row ? row.listId : row.name}
                  </StyledBorderCell>
                  <StyledBorderCell sx={{ fontSize: '13px' }}>
                    {row.description || ''}
                  </StyledBorderCell>
                  <StyledBorderCell sx={{ fontSize: '14px' }}>
                    {row.owner || ''}
                  </StyledBorderCell>
                  <StyledBorderCell sx={{ fontSize: '14px' }}>
                    {row.lastUpdate || ''}
                  </StyledBorderCell>
                  {row.status && (
                    <StyledBorderCell>
                      <UIFlexCenterBox>
                        <UIFlexWrapBox
                          sx={{
                            width: 90,
                            alignItems: 'center',
                          }}
                        >
                          <Box
                            sx={{
                              content: '""',
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background:
                                row.status === 'Active' ? '#00AC65' : '#C62828',
                            }}
                          ></Box>
                          {row.status}
                        </UIFlexWrapBox>
                      </UIFlexCenterBox>
                    </StyledBorderCell>
                  )}
                  <StyledBorderCell>
                    {actions.map((item, index) => {
                      return (
                        <IconButton
                          disableRipple
                          key={index}
                          onClick={() => {
                            if (row) {
                              if ('listId' in row && row.listId) {
                                onAction(item, row.listId);
                              } else if ('id' in row && row.id) {
                                onAction(item, row.id);
                              }
                            }
                          }}
                        >
                          <Image
                            src={`images/icons/${item}.svg`}
                            loader={appImageLoader}
                            width={20}
                            height={20}
                            alt={item}
                          />
                        </IconButton>
                      );
                    })}
                  </StyledBorderCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
};

export default ConfigurationTable;
