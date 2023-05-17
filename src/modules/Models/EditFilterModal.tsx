/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import {
  UIDefaultDialog,
  UIFlexWrapBox,
  UIModalButton,
  UIDefaultTextField,
} from '@/components/UI';
import { EditFilterRow } from './EditFilterRow';
import {
  DefaultModalProps,
  FiltersDataType,
  ModelsTableDataType,
} from '@/types';
import { filtersTableData } from '@/_mock';

interface EditFilterModalProps extends DefaultModalProps {
  id: number | string | null;
  dataSourceValue: string;
}

const newItemDataTypeAssigners: {
  [field in keyof FiltersDataType]: (
    item: FiltersDataType,
    value: number | string
  ) => FiltersDataType;
} = {
  id: (item: FiltersDataType, value: number | string) => {
    item.id = value as number;
    return item;
  },
  operator: (item: FiltersDataType, value: number | string) => {
    item.operator = value as number;
    return item;
  },
  resource: (item: FiltersDataType, value: number | string) => {
    item.resource = value as number;
    return item;
  },
  field: (item: FiltersDataType, value: number | string) => {
    item.field = value as number;
    return item;
  },
  filter: (item: FiltersDataType, value: number | string) => {
    item.filter = value as number;
    return item;
  },
  key: (item: FiltersDataType, value: number | string) => {
    item.key = value as string;
    return item;
  },
};

export const EditFilterModal = ({
  open,
  onClose,
  id,
  dataSourceValue,
}: EditFilterModalProps): JSX.Element => {
  const initValue = {
    id: 1,
    operator: 1,
    resource: 1,
    field: 1,
    filter: 1,
    key: '',
  };
  const [currentFilter, setCurrentFilter] = useState<
    ModelsTableDataType | undefined
  >(filtersTableData.find((item) => item.id === id));
  const [filterItems, setFilterItems] = useState(
    filtersTableData.find((item) => item.id === id)?.items
  );
  useEffect(() => {
    setCurrentFilter(filtersTableData.find((item) => item.id === id));
    setFilterItems(filtersTableData.find((item) => item.id === id)?.items);
  }, [id]);
  const handleChange = (
    filterId: number,
    field: keyof FiltersDataType,
    value: string | number
  ): void => {
    setCurrentFilter((prevState) => {
      const returnV = prevState;
      if (returnV?.items) {
        returnV.items = returnV?.items?.map((item: FiltersDataType, index) => {
          const {
            id: newItemId,
            operator: newItemOperator,
            resource: newItemResource,
            field: newItemField,
            filter: newItemFilter,
            key: newItemKey,
          } = item;
          const newItem: FiltersDataType = {
            id: newItemId,
            operator: newItemOperator,
            resource: newItemResource,
            field: newItemField,
            filter: newItemFilter,
            key: newItemKey,
          };
          if (filterId === index && field in newItemDataTypeAssigners) {
            const typeAssigner = newItemDataTypeAssigners[field];
            return typeAssigner(newItem, value);
          }
          return newItem;
        });
      }
      setFilterItems(returnV?.items);
      return returnV;
    });
  };
  const handleActionClick = (): void => {
    setCurrentFilter((prevState) => {
      const returnV = prevState;
      if (returnV?.items) returnV.items = [initValue, ...returnV.items];
      setFilterItems(returnV?.items);
      return returnV;
    });
  };
  return (
    <UIDefaultDialog
      open={open}
      onClose={onClose}
      title="Edit Filter"
      modalWidth="1210px"
    >
      <UIFlexWrapBox sx={{ p: 2, gap: 3, flexDirection: 'column' }}>
        <UIFlexWrapBox sx={{ gap: 5, alignItems: 'flex-end' }}>
          <Box>
            <Typography sx={{ fontSize: '13px', color: '#504F54', mb: 1.5 }}>
              Filter Name
            </Typography>
            <UIDefaultTextField
              value={currentFilter?.name}
              variant="standard"
              sx={{ width: '288px' }}
            />
          </Box>

          <Box sx={{ fontSize: '13px', color: '#504F54' }}>
            <Typography sx={{ fontSize: '13px', color: '#504F54', mb: 1.5 }}>
              Description
            </Typography>
            <UIDefaultTextField
              value={currentFilter?.description}
              variant="standard"
              sx={{ width: '583px' }}
            />
          </Box>
          <UIModalButton>Save</UIModalButton>
        </UIFlexWrapBox>
        {filterItems ? (
          filterItems.map((item, index) => (
            <EditFilterRow
              key={index}
              index={index}
              item={item}
              handleActionClick={handleActionClick}
              handleChange={handleChange}
              dataSourceId={dataSourceValue}
            />
          ))
        ) : (
          <EditFilterRow
            item={initValue}
            index={0}
            handleActionClick={handleActionClick}
            handleChange={handleChange}
            dataSourceId={dataSourceValue}
          />
        )}
      </UIFlexWrapBox>
    </UIDefaultDialog>
  );
};
