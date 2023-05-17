/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { Box, IconButton, LinearProgress } from '@mui/material';
import { UIDefaultTextField, UIFlexWrapBox, UISelect } from '@/components/UI';
import { filterOptionData } from '@/_mock';
import { AddCircleOutline } from '@mui/icons-material';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import React, { ChangeEvent } from 'react';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { RiskIndicatorExcludeItems } from '@/types/models.type';
import { useAppSelector } from '@/hooks';
import { getDataSourcesFields } from '@/redux/slices';

const RecordExcludeItem = ({
  id,
  recordItem,
  index,
  handleSelectChange,
  handleInputChange,
  handleActionClick,
  readOnly,
  dataSourceId,
}: {
  id: string | null;
  recordItem: RiskIndicatorExcludeItems;
  index: number;
  handleSelectChange: (
    event: SelectChangeEvent<unknown>,
    {
      operation,
      targetId,
      listIndex,
    }: {
      operation: string;
      targetId: string | null;
      listIndex?: number | undefined;
    }
  ) => void;
  handleInputChange: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    {
      operation,
      targetId,
      listIndex,
    }: {
      operation: string;
      targetId: string | null;
      listIndex?: number | undefined;
    }
  ) => void;
  handleActionClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    {
      operation,
      targetId,
      listIndex,
    }: {
      operation: string;
      targetId: string | null;
      listIndex?: number | undefined;
    }
  ) => void;
  readOnly: boolean;
  dataSourceId: string;
}): JSX.Element => {
  const stateFieldData = useAppSelector(getDataSourcesFields);

  if (!stateFieldData) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <UIFlexWrapBox key={index} sx={{ alignItems: 'center' }}>
        <UISelect
          height="36px"
          itemList={stateFieldData[dataSourceId]}
          handleChange={(event) =>
            handleSelectChange(event, {
              operation: 'changeExcludeItemsFieldAtIndex',
              targetId: id,
              listIndex: index,
            })
          }
          defaultValue={recordItem.field}
          width="164px"
          disabled={readOnly}
        />
        <UISelect
          height="36px"
          itemList={filterOptionData}
          handleChange={(event) =>
            handleSelectChange(event, {
              operation: 'changeFilterOptionDataAtIndex',
              targetId: id,
              listIndex: index,
            })
          }
          defaultValue={recordItem.type}
          width="229px"
          disabled={readOnly}
        />
        <UIDefaultTextField
          variant="standard"
          defaultValue={recordItem.values}
          onChange={(event) =>
            handleInputChange(event, {
              operation: 'changeValueDataAtIndex',
              targetId: id,
              listIndex: index,
            })
          }
          sx={{ width: '207px' }}
          disabled={readOnly}
        />
        {!readOnly && (
          <IconButton
            onClick={(event) =>
              handleActionClick(event, {
                operation: 'addRiskValueExclusion',
                targetId: id,
              })
            }
            sx={{ padding: 0 }}
          >
            <AddCircleOutline />
          </IconButton>
        )}
        {!readOnly && (
          <IconButton
            onClick={(event) =>
              handleActionClick(event, {
                operation: 'removeRiskValueExclusionAtIndex',
                targetId: id,
                listIndex: index,
              })
            }
            sx={{ padding: 0 }}
          >
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
};

export default RecordExcludeItem;
