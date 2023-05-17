/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Box, Typography, IconButton, LinearProgress } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { UIFlexWrapBox, UISelect, UIDefaultTextField } from '@/components/UI';
import { FiltersDataType } from '@/types';
import { filterOptionData } from '@/_mock';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import { getDataSourcesFields, getDataSourcesSelect } from '@/redux/slices';
import { useAppSelector } from '@/hooks';

export const EditFilterRow = ({
  item,
  index,
  handleChange,
  handleActionClick,
  dataSourceId = '',
}: {
  item: FiltersDataType;
  index: number;
  handleChange: (
    index: number,
    filter: keyof FiltersDataType,
    value: string | number
  ) => void;
  handleActionClick: () => void;
  dataSourceId: string;
}): JSX.Element => {
  const stateResourceData = useAppSelector(getDataSourcesSelect);
  const stateFieldData = useAppSelector(getDataSourcesFields);

  if (!stateResourceData || !stateFieldData) {
    return <LinearProgress />;
  }

  return (
    <UIFlexWrapBox sx={{ gap: 1.5, alignItems: 'center' }}>
      <Box sx={{ width: '74px' }}>
        {index != 0 && (
          <UISelect
            itemList={[
              { id: 1, name: 'AND' },
              { id: 2, name: 'OR' },
            ]}
            value={item.operator}
            handleChange={(e) =>
              handleChange(index, 'operator', e.target.value as number)
            }
            width="68px"
          />
        )}
      </Box>
      <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
        If Data Source
      </Typography>
      <UISelect
        itemList={stateResourceData}
        value={item.resource}
        handleChange={(e) =>
          handleChange(index, 'resource', e.target.value as number)
        }
        width="164px"
      />
      <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
        and Field Name
      </Typography>
      <UISelect
        itemList={stateFieldData[dataSourceId]}
        value={item.field}
        handleChange={(e) =>
          handleChange(index, 'field', e.target.value as number)
        }
        width="164px"
      />
      <UISelect
        itemList={filterOptionData}
        value={item.filter}
        handleChange={(e) =>
          handleChange(index, 'filter', e.target.value as number)
        }
        width="207px"
      />
      <UIDefaultTextField
        value={item.key}
        variant="standard"
        onChange={(e) => handleChange(index, 'key', e.target.value as string)}
        sx={{ width: '207px' }}
      />
      <IconButton onClick={handleActionClick}>
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
    </UIFlexWrapBox>
  );
};
