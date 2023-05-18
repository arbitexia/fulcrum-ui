/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Dan Finkel
 */
import React, { ChangeEvent, useState } from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { UIFlexWrapBox, UISelect, UIDefaultTextField } from '@/components/UI';
import { RiskIndicatorRangeValues, RiskIndicatorType } from '@/types';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import { EditValueItemProps, UISelectInterface } from '@/types/common.type';
import { roundScore } from '@/libs/math-utils';
import { useAppDispatch } from '@/hooks';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { riskValueChangeHandler, riskValueClickHandler } from '@/redux/slices';
import BuildRiskSettings from '@/modules/Models/BuildRisk/BuildRiskSettings';
import BuildInformationIcon from '@/modules/Models/BuildRisk/BuildInformationIcon';
import UIAutocomplete from '@/components/UI/UIAutocomplete';

const BuildRiskIndicatorSummationListObject = (
  id: string | null,
  matchItem: RiskIndicatorRangeValues,
  index: number,
  onOpenHistory: () => void,
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
  ) => void,
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
  ) => void,
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
  ) => void,
  readOnly: boolean
): JSX.Element => {
  return (
    <UIFlexWrapBox key={index} sx={{ gap: 1, alignItems: 'center' }}>
      {index === 0 && (
        <BuildInformationIcon
          title="Historical Data"
          onOpenHistory={onOpenHistory}
          readOnly={readOnly}
        />
      )}
      <UIFlexWrapBox
        sx={{
          paddingLeft: index === 0 ? 0 : '9px',
        }}
      >
        <UIFlexWrapBox
          sx={{
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Typography
            sx={{
              fontSize: '13px',
              color: '#504F54',
              textAlign: 'right',
              paddingTop: '8px',
            }}
          >
            {index === 0 ? 'adds up to between' : 'or adds up to between'}
          </Typography>
        </UIFlexWrapBox>
        <UIDefaultTextField
          sx={{ width: '6em', textAlign: 'right' }}
          inputProps={{ sx: { textAlign: 'right' } }}
          variant="standard"
          defaultValue={matchItem.rangeStart}
          onChange={(event) =>
            handleInputChange(event, {
              operation: 'changeRiskIndicatorRangeStartAtIndex',
              targetId: id,
              listIndex: index,
            })
          }
          disabled={readOnly}
        />
        <Typography
          sx={{ fontSize: '13px', color: '#504F54', paddingTop: '8px' }}
        >
          and
        </Typography>
        <UIDefaultTextField
          sx={{ width: '6em', textAlign: 'right' }}
          inputProps={{ sx: { textAlign: 'right' } }}
          variant="standard"
          defaultValue={matchItem.rangeEnd}
          onChange={(event) =>
            handleInputChange(event, {
              operation: 'changeRiskIndicatorRangeEndAtIndex',
              targetId: id,
              listIndex: index,
            })
          }
          disabled={readOnly}
        />
        <Typography
          sx={{ fontSize: '13px', color: '#504F54', paddingTop: '8px' }}
        >
          then score
        </Typography>
        <UIDefaultTextField
          sx={{ width: '3em', textAlign: 'right' }}
          inputProps={{ sx: { textAlign: 'right' } }}
          variant="standard"
          defaultValue={roundScore(matchItem.weight)}
          onChange={(event) =>
            handleInputChange(event, {
              operation: 'changeRiskIndicatorRangeWeightAtIndex',
              targetId: id,
              listIndex: index,
            })
          }
          disabled={readOnly}
        />
        {!readOnly && (
          <IconButton
            onClick={(event) =>
              handleActionClick(event, {
                operation: 'appendNewRiskRangeList',
                targetId: id,
              })
            }
            sx={{
              paddlingLeft: 0,
              paddingRight: 0,
              paddingBottom: 0,
              paddingTop: '6px',
            }}
          >
            <AddCircleOutline />
          </IconButton>
        )}
        {!readOnly && (
          <IconButton
            onClick={(event) =>
              handleActionClick(event, {
                operation: 'removeRiskValueFromRangeListAtIndex',
                targetId: id,
                listIndex: index,
              })
            }
            sx={{
              paddlingLeft: 0,
              paddingRight: 0,
              paddingBottom: 0,
              paddingTop: '8px',
            }}
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
    </UIFlexWrapBox>
  );
};

const BuildRiskSummationList = ({
  indicator,
  dataSources,
  riskFields,
  lists,
  onOpenHistory,
  openEditModalValueProps,
  datasourceChange,
  readOnly = false,
}: {
  indicator: RiskIndicatorType | null;
  dataSources: UISelectInterface[];
  riskFields: { [dataSource: string]: UISelectInterface[] };
  lists: { id: string; label: string }[];
  onOpenHistory: () => void;
  openEditModalValueProps: (args: EditValueItemProps) => void;
  datasourceChange: (dataSourceId: string) => void;
  readOnly?: boolean;
}): JSX.Element => {
  const dispatch = useAppDispatch();

  const id = (indicator && indicator?.id) || null;
  const valuesToMatch = (indicator && indicator?.values) || [];
  const handleSelectChange = (
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
  ): void => {
    if (readOnly) {
      return;
    }
    const value = event.target.value || null;

    if (operation === 'changeDataSource' && targetId && value) {
      const newRiskFieldList = riskFields[value as string];
      const newRiskFieldValue = newRiskFieldList[0].id;
      datasourceChange(value as string);

      dispatch(
        riskValueChangeHandler({
          operation,
          id: targetId,
          value,
          listIndex,
          riskFieldId: newRiskFieldValue,
          secondRiskFieldId: newRiskFieldValue,
        })
      );
    } else if (operation && targetId && value) {
      dispatch(
        riskValueChangeHandler({ operation, id: targetId, value, listIndex })
      );
    }
  };
  const handleInputChange = (
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
  ): void => {
    if (readOnly) {
      return;
    }
    const value = event.currentTarget.value ?? null;

    if (operation && targetId && value != null) {
      dispatch(
        riskValueChangeHandler({ operation, id: targetId, value, listIndex })
      );
    }
  };

  const handleSyntheticChange = ({
    operation,
    targetId,
    value,
  }: {
    operation: string;
    targetId: string | null;
    value: string | string[];
  }): void => {
    if (readOnly) {
      return;
    }

    if (operation && targetId && value) {
      dispatch(riskValueChangeHandler({ operation, id: targetId, value }));
    }
  };

  const handleActionClick = (
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
  ): void => {
    if (readOnly) {
      return;
    }
    if (targetId) {
      dispatch(riskValueClickHandler({ operation, id: targetId, listIndex }));
    }
  };
  const dataSourceName = indicator?.dataSource || '';
  const dataSourceObject = dataSources.find(
    (dataSource) => dataSource.id === dataSourceName
  );
  const defaultDataSourceObject = dataSources[0];
  const dataSourceValue: string = dataSourceObject
    ? (dataSourceObject.id as string)
    : (defaultDataSourceObject.id as string);
  const fieldName = indicator?.riskField ?? '';
  const fieldObject = riskFields[dataSourceValue].find(
    (riskField) => riskField.id === fieldName
  );
  const defaultValuesToMatch: string[] = valuesToMatch ?? [];
  const fieldValue = fieldObject ? fieldObject.id : '';
  const defaultMatchFieldValue = fieldValue;
  const textValuesStart: string = defaultValuesToMatch.join(',');
  const [textValue, setTextValue] = useState<string>(textValuesStart);
  const [_valuesLists, setValuesLists] =
    useState<string[]>(defaultValuesToMatch);

  const handleAutocompleteChange = (newVal: string[]): void => {
    handleSyntheticChange({
      operation: 'changeRiskFieldSummationValues',
      targetId: id,
      value: newVal as string[],
    });
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
            itemList={dataSources}
            defaultValue={dataSourceValue}
            handleChange={(event) =>
              handleSelectChange(event, {
                targetId: id,
                operation: 'changeDataSource',
              })
            }
            width="164px"
            disabled={readOnly}
          />
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            and Field Name
          </Typography>
          <UISelect
            height="36px"
            itemList={riskFields[dataSourceValue]}
            defaultValue={fieldValue}
            handleChange={(event) =>
              handleSelectChange(event, {
                targetId: id,
                operation: 'changeRiskField',
              })
            }
            width="164px"
            disabled={readOnly}
          />
        </UIFlexWrapBox>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          {indicator &&
            indicator.rangeList &&
            indicator.rangeList.length > 0 &&
            indicator?.rangeList?.map((matchItem, index) => {
              return BuildRiskIndicatorSummationListObject(
                id,
                matchItem,
                index,
                onOpenHistory,
                handleSelectChange,
                handleInputChange,
                handleActionClick,
                readOnly
              );
            })}
          {indicator &&
            (!indicator.rangeList || indicator.rangeList.length <= 0) &&
            BuildRiskIndicatorSummationListObject(
              id,
              { rangeStart: '0', rangeEnd: '0', weight: 0.0 },
              0,
              onOpenHistory,
              handleSelectChange,
              handleInputChange,
              handleActionClick,
              readOnly
            )}
        </Box>
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ marginLeft: '539px', marginTop: '20px' }}>
        <Typography
          sx={{ fontSize: '13px', color: '#504F54', paddingTop: '8px' }}
        >
          when
        </Typography>
        <UISelect
          height="36px"
          itemList={riskFields[dataSourceValue]}
          defaultValue={defaultMatchFieldValue}
          handleChange={(event) =>
            handleSelectChange(event, {
              targetId: id,
              operation: 'changeSecondRiskField',
            })
          }
          width="164px"
          disabled={readOnly}
        />
        <Typography
          sx={{ fontSize: '13px', color: '#504F54', paddingTop: '8px' }}
        >
          matches
        </Typography>
        <UIAutocomplete
          matchItemValues={defaultValuesToMatch ?? []}
          textValue={textValue}
          lists={lists}
          setValuesLists={setValuesLists}
          handleChange={handleAutocompleteChange}
          setTextValue={setTextValue}
          separators={[',']}
          listPrefix="@"
          onDoubleClick={() => {
            openEditModalValueProps({
              values: defaultValuesToMatch ?? [],
              handleChange: handleAutocompleteChange,
            });
          }}
          readOnly={readOnly}
        />
      </UIFlexWrapBox>
      <BuildRiskSettings
        indicator={indicator}
        dataSources={dataSources}
        readOnly={readOnly}
        lists={lists}
      />
    </Box>
  );
};

export default BuildRiskSummationList;
