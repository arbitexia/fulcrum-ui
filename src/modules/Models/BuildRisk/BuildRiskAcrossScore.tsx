/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Typography, Box, IconButton, LinearProgress } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { UIFlexWrapBox, UISelect, UIDefaultTextField } from '@/components/UI';
import {
  overTimeData,
  useData,
  dateData,
  reduceData,
  filterOptionData,
} from '@/_mock';
import { FiltersTableDataType } from '@/types';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import { useAppSelector } from '@/hooks';
import { getDataSourcesFields, getDataSourcesSelect } from '@/redux/slices';

const BuildRiskAcrossScore = ({
  item,
  onOpenHistory,
  readOnly = false,
  dataSourceId = '',
}: {
  item: FiltersTableDataType | undefined;
  onOpenHistory: () => void;
  readOnly?: boolean;
  dataSourceId: string;
}): JSX.Element => {
  const stateResourceData = useAppSelector(getDataSourcesSelect);
  const stateFieldData = useAppSelector(getDataSourcesFields);

  if (!stateResourceData || !stateFieldData) {
    return <LinearProgress />;
  }
  const handleChange = (): void => {
    if (readOnly) {
      return;
    }
    console.log('handleChange');
  };
  const handleActionClick = (): void => {
    if (readOnly) {
      return;
    }
    console.log('handleActionClick');
  };
  return (
    <Box sx={{ mt: 2.5 }}>
      <UIFlexWrapBox>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            If Data Source
          </Typography>
          <UISelect
            height="36px"
            itemList={stateResourceData}
            defaultValue={item?.matchResource || ''}
            handleChange={handleChange}
            width="164px"
            disabled={readOnly}
          />
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            and Field Name
          </Typography>
          <UISelect
            height="36px"
            itemList={stateFieldData[item?.matchResource || ''] ?? []}
            defaultValue={item?.matchField || -1}
            handleChange={handleChange}
            width="164px"
            disabled={readOnly}
          />
        </UIFlexWrapBox>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          {item &&
            item.matchItems.map((matchItem, index) => {
              return (
                <UIFlexWrapBox
                  key={index}
                  sx={{ gap: 1, alignItems: 'center' }}
                >
                  <UIFlexWrapBox
                    sx={{
                      width: '75px',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
                    {index === 0 && (
                      <IconButton
                        sx={{ padding: 0 }}
                        onClick={onOpenHistory}
                        disabled={readOnly}
                      >
                        <Image
                          src="images/icons/info.svg"
                          loader={appImageLoader}
                          width={16}
                          height={16}
                          alt="info"
                        />
                      </IconButton>
                    )}
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: '#504F54',
                        textAlign: 'right',
                      }}
                    >
                      {index === 0 ? 'matches' : 'or matches'}
                    </Typography>
                  </UIFlexWrapBox>

                  <UIDefaultTextField
                    sx={{ width: '48px' }}
                    variant="standard"
                    defaultValue={matchItem.match}
                    disabled={readOnly}
                  />
                  <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
                    then score
                  </Typography>
                  <UIDefaultTextField
                    sx={{ width: '48px' }}
                    variant="standard"
                    defaultValue={matchItem.score}
                    disabled={readOnly}
                  />
                  {!readOnly && (
                    <IconButton onClick={handleActionClick} sx={{ padding: 0 }}>
                      <AddCircleOutline />
                    </IconButton>
                  )}
                  {!readOnly && (
                    <IconButton onClick={handleActionClick} sx={{ padding: 0 }}>
                      <Image
                        src="images/icons/delete.svg"
                        loader={appImageLoader}
                        width={20}
                        height={20}
                        alt="delete"
                      />
                    </IconButton>
                  )}
                </UIFlexWrapBox>
              );
            })}
        </Box>
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ mt: 4, gap: 2, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>Use</Typography>
        <UISelect
          height="36px"
          itemList={useData}
          handleChange={handleChange}
          defaultValue={item?.useData || -1}
          width="164px"
          disabled={readOnly}
        />
        <UISelect
          height="36px"
          itemList={overTimeData}
          handleChange={handleChange}
          defaultValue={item?.useOverTime || -1}
          width="124px"
          disabled={readOnly}
        />
        <UIDefaultTextField
          sx={{ width: '48px' }}
          variant="standard"
          defaultValue={item?.useDateValue || ''}
          disabled={readOnly}
        />
        <UISelect
          height="36px"
          itemList={dateData}
          handleChange={handleChange}
          defaultValue={item?.useDateType || -1}
          width="68px"
          disabled={readOnly}
        />
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ mt: 6, gap: 2, alignItems: 'center' }}>
        <UISelect
          height="36px"
          itemList={reduceData}
          handleChange={handleChange}
          defaultValue={item?.reduceType || -1}
          width="107px"
          disabled={readOnly}
        />
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
          risk score as event ages over
        </Typography>
        <UIDefaultTextField
          sx={{ width: '48px' }}
          variant="standard"
          defaultValue={item?.reduceDateValue || ''}
          disabled={readOnly}
        />
        <UISelect
          height="36px"
          itemList={dateData}
          handleChange={handleChange}
          defaultValue={item?.reduceDateType || -1}
          width="68px"
          disabled={readOnly}
        />
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ mt: 7, gap: 2, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
          Do not use records when Field Name
        </Typography>
        {item &&
          item.recordItems.map((recordItem, index) => {
            return (
              <Box key={index}>
                <UIFlexWrapBox sx={{ alignItems: 'center' }}>
                  <UISelect
                    height="36px"
                    itemList={stateFieldData[dataSourceId]}
                    handleChange={handleChange}
                    defaultValue={recordItem.field}
                    width="164px"
                    disabled={readOnly}
                  />
                  <UISelect
                    height="36px"
                    itemList={filterOptionData}
                    handleChange={handleChange}
                    defaultValue={recordItem.filter}
                    width="229px"
                    disabled={readOnly}
                  />
                  <UIDefaultTextField
                    variant="standard"
                    defaultValue={recordItem.value}
                    sx={{ width: '207px' }}
                    disabled={readOnly}
                  />
                  {!readOnly && (
                    <IconButton onClick={handleActionClick} sx={{ padding: 0 }}>
                      <AddCircleOutline />
                    </IconButton>
                  )}
                  {!readOnly && (
                    <IconButton onClick={handleActionClick} sx={{ padding: 0 }}>
                      <Image
                        src="images/icons/delete.svg"
                        loader={appImageLoader}
                        width={20}
                        height={20}
                        alt="delete"
                      />
                    </IconButton>
                  )}
                </UIFlexWrapBox>
              </Box>
            );
          })}
      </UIFlexWrapBox>
    </Box>
  );
};

export default BuildRiskAcrossScore;
