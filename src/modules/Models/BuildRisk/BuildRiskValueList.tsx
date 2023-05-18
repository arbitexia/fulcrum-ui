/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ChangeEvent, useMemo, useState } from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { UIFlexWrapBox, UISelect, UIDefaultTextField } from '@/components/UI';
import { RiskIndicatorType, RiskIndicatorValues } from '@/types';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import { EditValueItemProps, UISelectInterface } from '@/types/common.type';
import { roundScore } from '@/libs/math-utils';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { useAppDispatch } from '@/hooks';
import { riskValueChangeHandler, riskValueClickHandler } from '@/redux/slices';
import BuildRiskSettings from '@/modules/Models/BuildRisk/BuildRiskSettings';
import BuildInformationIcon from '@/modules/Models/BuildRisk/BuildInformationIcon';
import UIAutocomplete from '@/components/UI/UIAutocomplete';

const BuildRiskIndicatorValueListObject = (
  id: string | null,
  matchItem: RiskIndicatorValues,
  index: number,
  possibleRiskValues: UISelectInterface[],
  lists: { id: string; label: string }[],
  matchTexts: string[],
  setValuesLists: (input: string[]) => void,
  deleteValuesLists: (callback: () => void) => void,
  textValue: string,
  setTextValue: (input: string) => void,
  deleteTextValue: (callback: () => void) => void,
  onOpenHistory: () => void,
  openEditModalValueProps: (args: EditValueItemProps) => void,
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
  const handleAutocompleteChange = (newVal: string[]): void => {
    handleSyntheticChange({
      targetId: id,
      operation: 'changeRiskIndicatorValuesAtIndex',
      listIndex: index,
      value: newVal as string[],
    });
  };
  return (
    <UIFlexWrapBox key={index} sx={{ alignItems: 'center' }}>
      {index === 0 && (
        <BuildInformationIcon
          title="Historical Data"
          onOpenHistory={onOpenHistory}
          readOnly={false}
        />
      )}
      <UIFlexWrapBox
        sx={{
          paddingLeft: index === 0 ? 0 : '10px',
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
            {index === 0 ? 'matches' : 'or matches'}
          </Typography>
        </UIFlexWrapBox>
        <UIAutocomplete
          matchItemValues={matchItem.values ?? []}
          textValue={textValue}
          lists={lists}
          setValuesLists={setValuesLists}
          handleChange={handleAutocompleteChange}
          setTextValue={setTextValue}
          separators={[',']}
          listPrefix="@"
          onDoubleClick={() => {
            openEditModalValueProps({
              values: matchItem.values ?? [],
              handleChange: handleAutocompleteChange,
            });
          }}
          readOnly={readOnly}
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
            onClick={(event) => {
              deleteTextValue(() => {
                deleteValuesLists(() => {
                  handleActionClick(event, {
                    operation: 'removeRiskValueFromListAtIndex',
                    targetId: id,
                    listIndex: index,
                  });
                });
              });
            }}
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

const BuildRiskValueRisk = ({
  indicator,
  dataSources,
  riskFields,
  possibleRiskValues,
  lists,
  onOpenHistory,
  openEditModalValueProps,
  datasourceChange,
  readOnly = false,
}: {
  indicator: RiskIndicatorType | null;
  dataSources: UISelectInterface[];
  riskFields: { [_dataSource: string]: UISelectInterface[] };
  possibleRiskValues: UISelectInterface[];
  lists: { id: string; label: string }[];
  onOpenHistory: () => void;
  openEditModalValueProps: (args: EditValueItemProps) => void;
  datasourceChange: (datasourceId: string) => void;
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
        })
      );
    } else if (operation && targetId && value) {
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
            width="20em"
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
            width="20em"
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
                valuesLists[index] || matchItem.values,
                setValuesAtIndex(index),
                deleteValueAtIndex(index),
                textValues[index] || matchItem.values.join(','),
                setTextValuesAtIndex(index),
                deleteTextValueAtIndex(index),
                onOpenHistory,
                openEditModalValueProps,
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
              valuesLists[0] || [],
              setValuesAtIndex(0),
              deleteValueAtIndex(0),
              textValues[0] || '',
              setTextValuesAtIndex(0),
              deleteTextValueAtIndex(0),
              onOpenHistory,
              openEditModalValueProps,
              handleSelectChange,
              handleSyntheticChange,
              handleInputChange,
              handleActionClick,
              readOnly
            )}
        </Box>
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

export default BuildRiskValueRisk;
