/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React from 'react';
import { Box, IconButton, LinearProgress } from '@mui/material';
import { UIFlexWrapBox, UISelect } from '@/components/UI';
import { filterOptionData } from '@/_mock';
import { AddCircleOutline } from '@mui/icons-material';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { RiskIndicatorExcludeItems } from '@/types/models.type';
import { useAppSelector } from '@/hooks';
import { getDataSourcesFields } from '@/redux/slices';
import UIAutocomplete from '@/components/UI/UIAutocomplete';
import { noop } from 'lodash';

const RecordExcludeItem = ({
  id,
  recordItem,
  index,
  textValue,
  setTextValue,
  deleteTextValueAtIndex,
  setValuesLists,
  deleteValueAtIndex,
  lists,
  handleSelectChange,
  handleSyntheticChange,
  handleActionClick,
  readOnly,
  dataSourceId,
}: {
  id: string | null;
  recordItem: RiskIndicatorExcludeItems;
  index: number;
  textValue: string;
  setTextValue: (input: string) => void;
  deleteTextValueAtIndex: (callback: () => void) => void;
  setValuesLists: (input: string[]) => void;
  deleteValueAtIndex: (callback: () => void) => void;
  lists: { id: string; label: string }[];
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
  handleSyntheticChange: ({
    operation,
    targetId,
    listIndex,
    value,
  }: {
    operation: string;
    targetId: string | null;
    listIndex?: number | undefined;
    value: string | string[];
  }) => void;
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
      <UIFlexWrapBox
        key={index}
        sx={{ alignItems: 'center', paddingLeft: index === 0 ? 0 : '227px' }}
      >
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
          defaultValue={recordItem.field || ''}
          width="20em"
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
          defaultValue={recordItem.type || filterOptionData[1].id}
          width="229px"
          disabled={readOnly}
        />
        <UIAutocomplete
          matchItemValues={recordItem.values ?? []}
          textValue={textValue}
          lists={lists}
          setValuesLists={setValuesLists}
          handleChange={(newVal: string[]) => {
            handleSyntheticChange({
              targetId: id,
              operation: 'changeValueDataAtIndex',
              listIndex: index,
              value: newVal as string[],
            });
          }}
          setTextValue={setTextValue}
          separators={[',']}
          listPrefix="@"
          onDoubleClick={noop}
          readOnly={readOnly}
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
            onClick={(event) => {
              deleteTextValueAtIndex(() => {
                deleteValueAtIndex(() => {
                  handleActionClick(event, {
                    operation: 'removeRiskValueExclusionAtIndex',
                    targetId: id,
                    listIndex: index,
                  });
                });
              });
            }}
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
