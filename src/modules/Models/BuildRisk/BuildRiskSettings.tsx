/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ChangeEvent, useMemo, useState } from 'react';
import { Typography, Box } from '@mui/material';
import {
  UIFlexWrapBox,
  UISelect,
  UIDefaultTextField,
  UIDefaultDatePicker,
} from '@/components/UI';
import { overTimeData, useData, dateData, reduceData } from '@/_mock';
import { RiskIndicatorType } from '@/types';
import { UISelectInterface } from '@/types/common.type';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { useAppDispatch } from '@/hooks';
import { riskValueChangeHandler, riskValueClickHandler } from '@/redux/slices';
import RecordExcludeItem from '@/modules/Models/BuildRisk/RecordExcludeItem';
import { Moment } from 'moment/moment';

const BuildRiskSettings = ({
  indicator,
  dataSources,
  lists,
  hideExclusions = false,
  readOnly = false,
}: {
  indicator: RiskIndicatorType | null;
  dataSources: UISelectInterface[];
  lists: { id: string; label: string }[];
  hideExclusions?: boolean;
  readOnly?: boolean;
}): JSX.Element => {
  const dispatch = useAppDispatch();

  const id = (indicator && indicator?.id) || null;

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

    if (operation && targetId && value) {
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
    listIndex,
    value,
  }: {
    operation: string;
    targetId: string | null;
    listIndex?: number | undefined;
    value: string | string[];
  }): void => {
    if (readOnly) {
      return;
    }

    if (operation && targetId && value) {
      dispatch(
        riskValueChangeHandler({ operation, id: targetId, value, listIndex })
      );
    }
  };

  const handleDateChange = (
    date: unknown,
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

    const momentDate = date as Moment;

    if (operation && targetId && date != null) {
      dispatch(
        riskValueChangeHandler({
          operation,
          id: targetId,
          value: momentDate.toISOString(),
          listIndex,
        })
      );
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
  const featureFilterValueList = useMemo(() => {
    return indicator?.featureFilter ?? [];
  }, [indicator]);
  const valuesListStart =
    featureFilterValueList.length > 0
      ? featureFilterValueList.map((matchItem) => matchItem.values)
      : [[]];
  const [_valuesLists, setValuesLists] = useState(valuesListStart);

  const setValuesAtIndex =
    (index: number) =>
    (value: string[]): void => {
      setValuesLists((prevState: string[][]) => {
        const newState = [...prevState];
        newState[index] = value;
        return newState;
      });
    };

  const deleteValueAtIndex =
    (index: number) =>
    (callback: () => void): void => {
      setValuesLists((prevState: string[][]) => {
        const newState = prevState.filter((item, previousIndex) => {
          return previousIndex !== index;
        });
        if (!newState || newState.length === 0) {
          return [[]];
        }
        return newState;
      });
      callback();
    };

  const textValuesStart: string[] =
    featureFilterValueList.length > 0
      ? featureFilterValueList.map((matchItem) => matchItem.values.join(','))
      : [''];
  const [textValues, setTextValues] = useState<string[]>(textValuesStart);

  const setTextValuesAtIndex =
    (index: number) =>
    (value: string): void => {
      setTextValues((prevState: string[]) => {
        const newState = [...prevState];
        newState[index] = value;
        return newState;
      });
    };

  const deleteTextValueAtIndex =
    (index: number) =>
    (callback: () => void): void => {
      setTextValues((prevState: string[]) => {
        const newState = prevState.filter((item, previousIndex) => {
          return previousIndex !== index;
        });
        if (!newState || newState.length === 0) {
          return [''];
        }
        return newState;
      });
      callback();
    };

  return (
    <Box sx={{ mt: 2.5 }}>
      <UIFlexWrapBox sx={{ mt: 4, gap: 2, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>Use</Typography>
        <UISelect
          height="36px"
          itemList={useData}
          handleChange={(event) =>
            handleSelectChange(event, {
              operation: 'changeUseData',
              targetId: id,
            })
          }
          defaultValue={indicator?.useData || useData[0].id}
          width="164px"
          disabled={readOnly}
        />
        <UISelect
          height="36px"
          itemList={overTimeData}
          handleChange={(event) =>
            handleSelectChange(event, {
              operation: 'changeUseOverTime',
              targetId: id,
            })
          }
          defaultValue={indicator?.useOverTime}
          width="124px"
          disabled={readOnly}
        />
        {indicator?.useOverTime === overTimeData[0].id && (
          <UIDefaultTextField
            sx={{ width: '48px' }}
            variant="standard"
            defaultValue={indicator?.useDateValue || ''}
            onChange={(event) =>
              handleInputChange(event, {
                operation: 'changeUseDateValue',
                targetId: id,
              })
            }
            disabled={readOnly}
          />
        )}
        {indicator?.useOverTime === overTimeData[0].id && (
          <UISelect
            height="36px"
            itemList={dateData}
            handleChange={(event) =>
              handleSelectChange(event, {
                operation: 'changeUseDateType',
                targetId: id,
              })
            }
            defaultValue={indicator?.useDateType || dateData[0].id}
            width="68px"
            disabled={readOnly}
          />
        )}
        {indicator?.useOverTime === overTimeData[2].id && (
          <UIDefaultDatePicker
            sx={{ height: '36px' }}
            value={indicator?.useStartDate}
            defaultValue={indicator?.useStartDate || ''}
            onChange={(date) =>
              handleDateChange(date, {
                operation: 'changeUseStartDate',
                targetId: id,
              })
            }
            disabled={readOnly}
          />
        )}
        {indicator?.useOverTime === overTimeData[2].id && (
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            and
          </Typography>
        )}
        {indicator?.useOverTime === overTimeData[2].id && (
          <UIDefaultDatePicker
            sx={{ height: '36px' }}
            value={indicator?.useEndDate}
            defaultValue={indicator?.useEndDate || ''}
            onChange={(date) =>
              handleDateChange(date, {
                operation: 'changeUseEndDate',
                targetId: id,
              })
            }
            disabled={readOnly}
          />
        )}
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ mt: 6, gap: 2, alignItems: 'center' }}>
        <UISelect
          height="36px"
          itemList={reduceData}
          handleChange={(event) =>
            handleSelectChange(event, {
              operation: 'changeReduceType',
              targetId: id,
            })
          }
          defaultValue={indicator?.reduceType || reduceData[1].id}
          width="107px"
          disabled={readOnly}
        />
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
          risk score as event ages{' '}
          {indicator?.reduceType !== reduceData[1].id ? 'over' : ''}
        </Typography>
        {indicator?.reduceType !== reduceData[1].id && (
          <UIDefaultTextField
            sx={{ width: '48px' }}
            variant="standard"
            defaultValue={indicator?.reduceDateValue || ''}
            onChange={(event) =>
              handleInputChange(event, {
                operation: 'changeReduceDateValue',
                targetId: id,
              })
            }
            disabled={readOnly}
          />
        )}
        {indicator?.reduceType !== reduceData[1].id && (
          <UISelect
            height="36px"
            itemList={dateData}
            handleChange={(event) =>
              handleSelectChange(event, {
                operation: 'changeReduceDateType',
                targetId: id,
              })
            }
            defaultValue={indicator?.reduceDateType || dateData[0].id}
            width="68px"
            disabled={readOnly}
          />
        )}
      </UIFlexWrapBox>
      {!hideExclusions && (
        <UIFlexWrapBox sx={{ mt: 7, gap: 2, alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            Do not use records when Field Name
          </Typography>
          {indicator &&
            indicator.featureFilter &&
            indicator.featureFilter.length > 0 &&
            indicator.featureFilter.map((recordItem, index) => {
              return (
                <RecordExcludeItem
                  key={index}
                  id={id}
                  recordItem={recordItem}
                  index={index}
                  lists={lists}
                  textValue={textValues[index] || recordItem.values.join(',')}
                  setTextValue={setTextValuesAtIndex(index)}
                  deleteTextValueAtIndex={deleteTextValueAtIndex(index)}
                  setValuesLists={setValuesAtIndex(index)}
                  deleteValueAtIndex={deleteValueAtIndex(index)}
                  handleSelectChange={handleSelectChange}
                  handleSyntheticChange={handleSyntheticChange}
                  handleActionClick={handleActionClick}
                  readOnly={readOnly}
                  dataSourceId={dataSourceValue}
                />
              );
            })}
          {indicator &&
            (!indicator.featureFilter ||
              indicator.featureFilter.length <= 0) && (
              <RecordExcludeItem
                id={id}
                recordItem={{ field: '', feature: '', type: '', values: [] }}
                index={0}
                lists={lists}
                textValue={textValues[0] || ''}
                setTextValue={setTextValuesAtIndex(0)}
                deleteTextValueAtIndex={deleteTextValueAtIndex(0)}
                setValuesLists={setValuesAtIndex(0)}
                deleteValueAtIndex={deleteValueAtIndex(0)}
                handleSelectChange={handleSelectChange}
                handleSyntheticChange={handleSyntheticChange}
                handleActionClick={handleActionClick}
                readOnly={readOnly}
                dataSourceId={dataSourceValue}
              />
            )}
        </UIFlexWrapBox>
      )}
    </Box>
  );
};

export default BuildRiskSettings;
