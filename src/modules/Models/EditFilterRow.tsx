/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Typography, IconButton, SelectChangeEvent } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { UIFlexWrapBox, UISelect, UIDefaultTextField } from '@/components/UI';
import { FilterAttributeType } from '@/types';
import { filterFieldData, filterOptionData } from '@/_mock';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';

export const EditFilterRow = ({
  attribute,
  index,
  handleSelectChange,
  handleInputChange,
  handleActionClick,
}: {
  attribute: FilterAttributeType;
  index: number;
  handleSelectChange: (
    event: SelectChangeEvent<unknown>,
    {
      operation,
      listIndex,
    }: {
      operation: string;
      listIndex?: number | undefined;
    }
  ) => void;
  handleInputChange: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    {
      operation,
      listIndex,
    }: {
      operation: string;
      listIndex?: number | undefined;
    }
  ) => void;
  handleActionClick: (listIndex: number) => void;
}): JSX.Element => {
  const [data, setData] = useState<FilterAttributeType | null>(null);
  useEffect(() => {
    setData(attribute);
  }, [attribute]);

  return (
    <UIFlexWrapBox sx={{ gap: 1.5, alignItems: 'center' }}>
      {/*<Box sx={{ width: '74px' }}>*/}
      {/*  {index != 0 && (*/}
      {/*    <UISelect*/}
      {/*      itemList={[*/}
      {/*        { id: 1, name: 'AND' },*/}
      {/*        { id: 2, name: 'OR' },*/}
      {/*      ]}*/}
      {/*      value={item.operator}*/}
      {/*      handleChange={(e) =>*/}
      {/*        handleSelectChange(index, 'operator', e.target.value as number)*/}
      {/*      }*/}
      {/*      width="68px"*/}
      {/*    />*/}
      {/*  )}*/}
      {/*</Box>*/}
      {/*<Typography sx={{ fontSize: '13px', color: '#504F54' }}>*/}
      {/*  If Data Source*/}
      {/*</Typography>*/}
      {/*<UISelect*/}
      {/*  itemList={stateResourceData}*/}
      {/*  value={item.resource}*/}
      {/*  handleChange={(e) =>*/}
      {/*      handleSelectChange(index, 'resource', e.target.value as number)*/}
      {/*  }*/}
      {/*  width="164px"*/}
      {/*/>*/}
      {data && (
        <>
          <Box sx={{ width: '95px', textAlign: 'right' }}>
            <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
              {index != 0 ? 'and' : 'If'} Field Name
            </Typography>
          </Box>
          <UISelect
            itemList={filterFieldData}
            defaultValue={''}
            value={data.field}
            handleChange={(e) =>
              handleSelectChange(e, {
                operation: 'changeFilterAttributeField',
                listIndex: index,
              })
            }
            width="164px"
          />
          <UISelect
            itemList={filterOptionData}
            defaultValue={''}
            value={data.option}
            handleChange={(e) =>
              handleSelectChange(e, {
                operation: 'changeFilterAttributeOption',
                listIndex: index,
              })
            }
            width="207px"
          />
          <UIDefaultTextField
            defaultValue={data.value}
            variant="standard"
            onChange={(e) =>
              handleInputChange(e, {
                operation: 'changeFilterAttributeValue',
                listIndex: index,
              })
            }
            sx={{ width: '207px' }}
          />
          <IconButton onClick={() => handleActionClick(index)}>
            {index != 0 ? (
              <Image
                src="images/icons/delete.svg"
                loader={appImageLoader}
                width={18}
                height={18}
                alt="delete"
              />
            ) : (
              <AddCircleOutline />
            )}
          </IconButton>
        </>
      )}
    </UIFlexWrapBox>
  );
};
