/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Dan Finkel
 */
import React, { ChangeEvent } from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { UIFlexWrapBox, UISelect, UIDefaultTextField } from '@/components/UI';
import { RiskIndicatorRangeValues, RiskIndicatorType } from '@/types';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import { UISelectInterface } from '@/types/common.type';
import { roundScore } from '@/libs/math-utils';
import { useAppDispatch } from '@/hooks';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { riskValueChangeHandler, riskValueClickHandler } from '@/redux/slices';
import BuildRiskSettings from '@/modules/Models/BuildRisk/BuildRiskSettings';
import BuildInformationIcon from '@/modules/Models/BuildRisk/BuildInformationIcon';

const BuildRiskIndicatorDiscrepancyListObject = (
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
      <UIFlexWrapBox
        sx={{
          paddingLeft: index === 0 ? 0 : '40px',
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
            {index === 0 ? 'days and' : 'or'}
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
          to
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
          discrepancies occur, then score
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
              paddingLeft: 0,
              paddingRight: 0,
              paddingBottom: 0,
              paddingTop: '8px',
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
              paddingLeft: 0,
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

const BuildRiskDiscrepancyList = ({
  indicator,
  dataSources,
  riskFields,
  lists,
  onOpenHistory,
  onOpenHistory2,
  datasourceChange,
  readOnly = false,
}: {
  indicator: RiskIndicatorType | null;
  dataSources: UISelectInterface[];
  riskFields: { [dataSource: string]: UISelectInterface[] };
  lists: { id: string; label: string }[];
  datasourceChange: (dataSourceId: string) => void;
  onOpenHistory: () => void;
  onOpenHistory2: () => void;
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
    } else if (operation === 'changeSecondDataSource' && targetId && value) {
      const newRiskFieldList = riskFields[value as string];
      const newRiskFieldValue = newRiskFieldList[0].id;
      datasourceChange(value as string);
      dispatch(
        riskValueChangeHandler({
          operation,
          id: targetId,
          value,
          listIndex,
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

  const dataSourceName2 = indicator?.dataSource2 || '';
  const dataSourceObject2 = dataSources.find(
    (dataSource) => dataSource.id === dataSourceName2
  );
  const defaultDataSourceObject2 = dataSources[0];
  const dataSourceValue2: string = dataSourceObject2
    ? (dataSourceObject2.id as string)
    : (defaultDataSourceObject2.id as string);

  const fieldName2 = indicator?.riskField2 ?? '';
  const fieldObject2 = riskFields[dataSourceValue2].find(
    (riskField) => riskField.id === fieldName2
  );
  const fieldValue2 = fieldObject2 ? fieldObject2.id : '';

  const windowInDays = indicator?.windowInDays ?? 0;
  return (
    <Box sx={{ mt: 2.5 }}>
      <UIFlexWrapBox sx={{ mt: 4, gap: 2, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
          For Data Source
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
          value={fieldValue}
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
        <BuildInformationIcon
          title="Historical Data"
          onOpenHistory={onOpenHistory}
          readOnly={readOnly}
        />
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ mt: 4, gap: 2, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
          and Data Source
        </Typography>
        <UISelect
          height="36px"
          itemList={dataSources}
          value={dataSourceValue2}
          defaultValue={dataSourceValue2}
          handleChange={(event) =>
            handleSelectChange(event, {
              targetId: id,
              operation: 'changeSecondDataSource',
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
          itemList={riskFields[dataSourceValue2]}
          value={fieldValue2}
          defaultValue={fieldValue2}
          handleChange={(event) =>
            handleSelectChange(event, {
              targetId: id,
              operation: 'changeSecondRiskField',
            })
          }
          width="164px"
          disabled={readOnly}
        />
        <BuildInformationIcon
          title="Historical Data"
          onOpenHistory={onOpenHistory2}
          readOnly={readOnly}
        />
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ mt: 4, gap: 2 }}>
        <UIFlexWrapBox sx={{ alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            When there is a time discrepancy within plus or minus
          </Typography>
          <UIDefaultTextField
            sx={{ width: '6em', textAlign: 'right' }}
            inputProps={{ sx: { textAlign: 'right' } }}
            variant="standard"
            defaultValue={windowInDays}
            onChange={(event) =>
              handleInputChange(event, {
                operation: 'changeRiskFieldDiscrepancyWindowInDays',
                targetId: id,
              })
            }
            disabled={readOnly}
          />
        </UIFlexWrapBox>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          {indicator &&
            indicator.rangeList &&
            indicator.rangeList.length > 0 &&
            indicator?.rangeList?.map((matchItem, index) => {
              return BuildRiskIndicatorDiscrepancyListObject(
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
            BuildRiskIndicatorDiscrepancyListObject(
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
      <BuildRiskSettings
        indicator={indicator}
        dataSources={dataSources}
        readOnly={readOnly}
        lists={lists}
      />
    </Box>
  );
};

export default BuildRiskDiscrepancyList;
