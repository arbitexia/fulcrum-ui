/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { AddCircleOutline } from '@mui/icons-material';
import { UIFlexWrapBox, UISelect, UIDefaultTextField } from '@/components/UI';
import { overTimeData, useData, dateData, reduceData } from '@/_mock';
import { RiskIndicatorType, RiskIndicatorValues } from '@/types';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import { UISelectInterface } from '@/types/common.type';
import { roundScore } from '@/libs/math-utils';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { useAppDispatch } from '@/hooks';
import { riskValueChangeHandler, riskValueClickHandler } from '@/redux/slices';
import RecordExcludeItem from '@/modules/Models/BuildRisk/RecordExcludeItem';

const BuildRiskIndicatorValueListObject = (
  id: string | null,
  matchItem: RiskIndicatorValues,
  index: number,
  possibleRiskValues: UISelectInterface[],
  lists: { id: string; label: string }[],
  matchTexts: string[],
  setValuesLists: (input: string[]) => void,
  textValue: string,
  setTextValue: (input: string) => void,
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
  }) => void,
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
  const matchTextHasList = matchTexts
    ? matchTexts.filter((text) => text && text[0] === '@').length > 0
    : false;
  return (
    <UIFlexWrapBox key={index} sx={{ gap: 1, alignItems: 'center' }}>
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
      <Autocomplete
        sx={{ height: '36px' }}
        value={matchItem.values ?? []}
        inputValue={textValue}
        options={matchTextHasList ? lists : []}
        multiple
        renderTags={() => null}
        renderInput={(params) => (
          <UIDefaultTextField
            {...params}
            sx={{ height: '36px', paddingLeft: '2px' }}
            variant="standard"
          />
        )}
        renderOption={(props, option) => {
          const optionId = typeof option === 'string' ? option : option.id;
          const optionLabel =
            typeof option === 'string' ? option : option.label;
          return (
            <li {...props} id={optionId}>
              {optionLabel}
            </li>
          );
        }}
        onInputChange={(event, value: string) => {
          const realValue =
            event.type === 'click' ? event.currentTarget.id : value;
          const options = realValue.split(',');
          const split = options
            .map((val) => val.trim())
            .filter((val) => val && val.length > 0);
          setValuesLists(split);
          if (options.length > 1) {
            handleSyntheticChange({
              targetId: id,
              operation: 'changeRiskIndicatorValuesAtIndex',
              listIndex: index,
              value: split as string[],
            });
          } else {
            const newVal = [...matchItem.values];
            const newValLastIndex = newVal.length - 1;
            if (newValLastIndex >= 0) {
              newVal[newValLastIndex] = realValue;
            } else {
              newVal[0] = realValue;
            }
            handleSyntheticChange({
              targetId: id,
              operation: 'changeRiskIndicatorValuesAtIndex',
              listIndex: index,
              value: newVal as string[],
            });
          }
          setTextValue(realValue);
        }}
        freeSolo
        disabled={readOnly}
      />
      <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
        then score
      </Typography>
      <UIDefaultTextField
        sx={{ width: '48px' }}
        variant="standard"
        value={roundScore(matchItem.weight)}
        onChange={(event) =>
          handleInputChange(event, {
            operation: 'changeRiskIndicatorValueListWeightAtIndex',
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
              operation: 'appendNewRiskValueList',
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
              operation: 'removeRiskValueFromListAtIndex',
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
  );
};

const BuildRiskValueRisk = ({
  indicator,
  dataSources,
  riskFields,
  possibleRiskValues,
  lists,
  onOpenHistory,
  readOnly = false,
}: {
  indicator: RiskIndicatorType | null;
  dataSources: UISelectInterface[];
  riskFields: { [_dataSource: string]: UISelectInterface[] };
  possibleRiskValues: UISelectInterface[];
  lists: { id: string; label: string }[];
  onOpenHistory: () => void;
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
  const fieldValue = fieldObject ? fieldObject.id : '';
  const indicatorValueList = useMemo(() => {
    return indicator?.valueList ?? [];
  }, [indicator]);
  const valuesListStart =
    indicatorValueList.length > 0
      ? indicatorValueList.map((matchItem) => matchItem.values)
      : [[]];
  const [valuesLists, setValuesLists] = useState(valuesListStart);

  useEffect(() => {
    const newValuesList =
      indicatorValueList.length > 0
        ? indicatorValueList.map((matchItem) => matchItem.values)
        : [[]];
    setValuesLists(newValuesList);
  }, [indicatorValueList]);

  const setValuesAtIndex =
    (index: number) =>
    (value: string[]): void => {
      setValuesLists((prevState: string[][]) => {
        const newState = [...prevState];
        newState[index] = value;
        return newState;
      });
    };
  const textValuesStart: string[] =
    indicatorValueList.length > 0
      ? indicatorValueList.map((matchItem) => matchItem.values.join(','))
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

  return (
    <Box sx={{ mt: 2.5 }}>
      <UIFlexWrapBox>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            If Data Source
          </Typography>
          <UISelect
            id="risk-indicator-value-datasource"
            labelId="risk-indicator-value-datasource-label"
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
            indicator.valueList &&
            indicator.valueList.length > 0 &&
            indicator?.valueList?.map((matchItem, index) => {
              return BuildRiskIndicatorValueListObject(
                id,
                matchItem,
                index,
                possibleRiskValues,
                lists,
                valuesLists[index],
                setValuesAtIndex(index),
                textValues[index],
                setTextValuesAtIndex(index),
                onOpenHistory,
                handleSelectChange,
                handleSyntheticChange,
                handleInputChange,
                handleActionClick,
                readOnly
              );
            })}
          {indicator &&
            (!indicator.valueList || indicator.valueList.length <= 0) &&
            BuildRiskIndicatorValueListObject(
              id,
              { values: [], weight: 0.0 },
              0,
              possibleRiskValues,
              lists,
              valuesLists[0],
              setValuesAtIndex(0),
              textValues[0],
              setTextValuesAtIndex(0),
              onOpenHistory,
              handleSelectChange,
              handleSyntheticChange,
              handleInputChange,
              handleActionClick,
              readOnly
            )}
        </Box>
      </UIFlexWrapBox>
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
          defaultValue={indicator?.useData || -1}
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
          defaultValue={indicator?.useOverTime || -1}
          width="124px"
          disabled={readOnly}
        />
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
        <UISelect
          height="36px"
          itemList={dateData}
          handleChange={(event) =>
            handleSelectChange(event, {
              operation: 'changeUseDateType',
              targetId: id,
            })
          }
          defaultValue={indicator?.useDateType || -1}
          width="68px"
          disabled={readOnly}
        />
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
          defaultValue={indicator?.reduceType || -1}
          width="107px"
          disabled={readOnly}
        />
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
          risk score as event ages over
        </Typography>
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
        <UISelect
          height="36px"
          itemList={dateData}
          handleChange={(event) =>
            handleSelectChange(event, {
              operation: 'changeReduceDateType',
              targetId: id,
            })
          }
          defaultValue={indicator?.reduceDateType || -1}
          width="68px"
          disabled={readOnly}
        />
      </UIFlexWrapBox>
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
                handleSelectChange={handleSelectChange}
                handleInputChange={handleInputChange}
                handleActionClick={handleActionClick}
                readOnly={readOnly}
                dataSourceId={dataSourceValue}
              />
            );
          })}
        {indicator &&
          (!indicator.featureFilter || indicator.featureFilter.length <= 0) && (
            <RecordExcludeItem
              id={id}
              recordItem={{ field: '', feature: '', type: '', values: [] }}
              index={0}
              handleSelectChange={handleSelectChange}
              handleInputChange={handleInputChange}
              handleActionClick={handleActionClick}
              readOnly={readOnly}
              dataSourceId={dataSourceValue}
            />
          )}
      </UIFlexWrapBox>
    </Box>
  );
};

export default BuildRiskValueRisk;
