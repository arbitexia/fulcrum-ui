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
  TableSortLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import { StyledBorderCell } from './ui';
import { stableSort } from '@/libs/sort-utils';
import { UIFlexWrapBox, UINoBorderCell, UIIOSSwitch } from '@/components/UI';
import {
  ConfigurationTableType,
  Model,
  NewModelParams,
} from '@/types/models.type';
import { formatKey } from '@/libs/string-utils';
import { formatDate } from '@/libs/time-utils';
import { noop } from 'lodash';
import { modifyModel } from '@/redux/slices';
import { useAppDispatch } from '@/hooks';

const ConfigurationTable = ({
  data,
  url,
  actions,
  onActionClick,
  accessToken,
}: {
  data: ConfigurationTableType[];
  url: string;
  actions: string[];
  onActionClick: (
    url: string,
    action: string,
    id: number | string,
    name?: string
  ) => void;
  accessToken: string;
}): JSX.Element => {
  const dispatch = useAppDispatch();
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

  const onAction = (
    action: string,
    id: number | string,
    name?: string
  ): void => {
    onActionClick(url, action, id, name);
  };

  useEffect(() => {
    setTableList(data);
  }, [data]);

  const dispatchModify = (args: NewModelParams): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        modifyModel(args)
      );
      resolve();
    });
  };

  const changeList = (
    index: number,
    newTableItem: ConfigurationTableType
  ): void => {
    setTableList((prevTableList: ConfigurationTableType[] | null) => {
      if (prevTableList !== null) {
        const newTableList: ConfigurationTableType[] = [...prevTableList];
        newTableList[index] = newTableItem;
        return newTableList;
      }
      return null;
    });
  };

  const handleSave: (model: Model, index: number) => void = (
    model: Model,
    index: number
  ) => {
    const modelId = (model && model?.id) ?? 'NEW';
    const oldActiveFlag = model.active ?? false;
    const newModel =
      modelId && modelId === 'NEW'
        ? { ...model, id: null, active: !oldActiveFlag }
        : { ...model, active: !oldActiveFlag };
    const author = (model && model.owner) ?? '';
    const modelJson = JSON.stringify(newModel);
    if (accessToken) {
      dispatchModify({
        accessToken,
        modelJson,
        author,
        modelId: modelId === 'NEW' ? '' : modelId,
        lastUpdateDate: Date.now(),
        active: !oldActiveFlag,
      })
        .then(() => changeList(index, newModel))
        .then(noop);
    }
  };

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
    <Table size="small">
      <TableHead>
        <TableRow>
          <UINoBorderCell>
            <TableSortLabel
              active={orderBy === nameOrderKey}
              direction={order}
              onClick={createSortHandler(
                nameOrderKey as keyof ConfigurationTableType
              )}
            >
              Name
            </TableSortLabel>
          </UINoBorderCell>
          <UINoBorderCell>Description</UINoBorderCell>
          <UINoBorderCell>
            <TableSortLabel
              active={orderBy === 'owner'}
              direction={order}
              onClick={createSortHandler('owner')}
            >
              Owner
            </TableSortLabel>
          </UINoBorderCell>
          <UINoBorderCell>
            <TableSortLabel
              active={orderBy === 'lastUpdate'}
              direction={order}
              onClick={createSortHandler('lastUpdate')}
            >
              Last Update
            </TableSortLabel>
          </UINoBorderCell>
          {tableList &&
            (tableList[0]?.active === true ||
              tableList[0]?.active === false) && (
              <UINoBorderCell align="center">
                <TableSortLabel
                  active={orderBy === 'active'}
                  direction={order}
                  onClick={createSortHandler('active')}
                >
                  Active
                </TableSortLabel>
              </UINoBorderCell>
            )}
          <UINoBorderCell>Actions</UINoBorderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tableList &&
          stableSort<ConfigurationTableType>(
            tableList,
            getComparator(order, orderBy)
          ).map(([row, _], rowIndex) => {
            const listIdKey = 'listId' in row ? row.listId : rowIndex;
            const rowKey = 'id' in row ? row.id : listIdKey;
            return (
              <TableRow
                sx={{
                  maxHeight: '50px',
                  background: '#ffffff',
                  '&:hover': { background: '#eceff1' },
                }}
                key={rowKey}
              >
                <StyledBorderCell
                  sx={{
                    height: '50px',
                    fontWeight: 400,
                    fontSize: '14px',
                    maxHeight: '50px',
                    maxWidth: '250px',
                    whiteSpace: 'nowrap',
                    overflowX: 'scroll',
                    overflowY: 'hidden',
                  }}
                >
                  {row && 'listId' in row ? row.listId : row.name}
                </StyledBorderCell>
                <StyledBorderCell
                  sx={{
                    fontSize: '13px',
                    maxHeight: '50px',
                    maxWidth: '600px',
                    whiteSpace: 'nowrap',
                    overflowX: 'scroll',
                    overflowY: 'hidden',
                  }}
                >
                  {row.description || ''}
                </StyledBorderCell>
                <StyledBorderCell
                  sx={{
                    fontSize: '14px',
                    maxHeight: '50px',
                    overflowX: 'scroll',
                    overflowY: 'hidden',
                  }}
                >
                  {row.owner || ''}
                </StyledBorderCell>
                {row.lastUpdate && (
                  <StyledBorderCell sx={{ fontSize: '14px' }}>
                    {formatDate(new Date(row.lastUpdate))}
                  </StyledBorderCell>
                )}
                {!row.lastUpdate && (
                  <StyledBorderCell sx={{ fontSize: '14px' }}>
                    {''}
                  </StyledBorderCell>
                )}
                {(row.active === true || row.active === false) && (
                  <StyledBorderCell>
                    <UIFlexWrapBox>
                      <UIIOSSwitch
                        sx={{ marginLeft: '20px' }}
                        size="small"
                        checked={row.active}
                        onChange={() => handleSave(row as Model, rowIndex)}
                      />
                    </UIFlexWrapBox>
                  </StyledBorderCell>
                )}
                <StyledBorderCell>
                  {actions.map((item, actionIndex) => {
                    return (
                      <Tooltip
                        title={formatKey(item)}
                        key={actionIndex}
                        placement="bottom"
                        style={{ cursor: 'pointer' }}
                      >
                        <IconButton
                          disableRipple
                          onClick={() => {
                            if (row) {
                              if ('listId' in row && row.listId) {
                                onAction(item, row.listId, row.listId);
                              } else if ('id' in row && row.id) {
                                onAction(item, row.id, row.name);
                              } else if ('filterId' in row && row.filterId) {
                                onAction(item, row.filterId, row.name);
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
                      </Tooltip>
                    );
                  })}
                </StyledBorderCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};

export default ConfigurationTable;
