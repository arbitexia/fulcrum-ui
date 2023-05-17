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
import {
  overTimeData,
  useData,
  dateData,
  reduceData,
  outlierScoringTypes,
  outlierTimeUnits,
  outlierHours,
  outlierGeneralTimePeriods,
} from '@/_mock';
import { RiskIndicatorRangeValues, RiskIndicatorType } from '@/types';
import Image from 'next/image';
import { appImageLoader } from '@/libs/image-loader';
import { UISelectInterface } from '@/types/common.type';
import { roundScore } from '@/libs/math-utils';
import { useAppDispatch } from '@/hooks';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { riskValueChangeHandler, riskValueClickHandler } from '@/redux/slices';
import RecordExcludeItem from '@/modules/Models/BuildRisk/RecordExcludeItem';

const BuildRiskIndicatorOutlierValueListObject = (
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
          width: '90px',
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
          {index === 0 ? 'between' : 'or between'}
        </Typography>
      </UIFlexWrapBox>
      <UIDefaultTextField
        sx={{ width: '48px' }}
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
      <Typography sx={{ fontSize: '13px', color: '#504F54' }}>and</Typography>
      <UIDefaultTextField
        sx={{ width: '48px' }}
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
      <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
        then score
      </Typography>
      <UIDefaultTextField
        sx={{ width: '48px' }}
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
          sx={{ padding: 0 }}
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

const BuildRiskOutlierValueList = ({
  indicator,
  dataSources,
  riskFields,
  onOpenHistory,
  readOnly = false,
}: {
  indicator: RiskIndicatorType | null;
  dataSources: UISelectInterface[];
  riskFields: { [dataSource: string]: UISelectInterface[] };
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
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            are summed up over a time period of
          </Typography>
          <UISelect
            height="36px"
            itemList={outlierGeneralTimePeriods}
            handleChange={(event) =>
              handleSelectChange(event, {
                operation: 'changeOutlierPeriodInMillis',
                targetId: id,
              })
            }
            defaultValue={indicator?.periodInMillis || -1}
            width="136px"
            disabled={readOnly}
          />
        </UIFlexWrapBox>
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ mt: 4, gap: 2, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
          And the result has a significance of deviation from the average{' '}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          {indicator &&
            indicator.rangeList &&
            indicator.rangeList.length > 0 &&
            indicator?.rangeList?.map((matchItem, index) => {
              return BuildRiskIndicatorOutlierValueListObject(
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
            BuildRiskIndicatorOutlierValueListObject(
              id,
              { rangeStart: 0, rangeEnd: 0, weight: 0.0 },
              0,
              onOpenHistory,
              handleSelectChange,
              handleInputChange,
              handleActionClick,
              readOnly
            )}
        </Box>
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ mt: 4, gap: 2, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
          Use scoring type
        </Typography>
        <UISelect
          height="36px"
          itemList={outlierScoringTypes}
          handleChange={(event) =>
            handleSelectChange(event, {
              operation: 'changeOutlierScoringType',
              targetId: id,
            })
          }
          defaultValue={indicator?.scoringType || -1}
          width="164px"
          disabled={readOnly}
        />
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ mt: 4, gap: 2, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
          Units
        </Typography>
        <UISelect
          height="36px"
          itemList={outlierTimeUnits}
          handleChange={(event) =>
            handleSelectChange(event, {
              operation: 'changeOutlierUnitInMillis',
              targetId: id,
            })
          }
          defaultValue={indicator?.unitInMillis || -1}
          width="164px"
          disabled={readOnly}
        />
      </UIFlexWrapBox>
      <UIFlexWrapBox sx={{ mt: 4, gap: 2, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
          Off-hours from
        </Typography>
        <UISelect
          height="36px"
          itemList={outlierHours}
          handleChange={(event) =>
            handleSelectChange(event, {
              operation: 'changeOutlierUnitWeightingStart',
              targetId: id,
            })
          }
          defaultValue={indicator?.unitWeightingStart || -1}
          width="164px"
          disabled={readOnly}
        />
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
          Off-hours to
        </Typography>
        <UISelect
          height="36px"
          itemList={outlierHours}
          handleChange={(event) =>
            handleSelectChange(event, {
              operation: 'changeOutlierUnitWeightingStop',
              targetId: id,
            })
          }
          defaultValue={indicator?.unitWeightingStop || -1}
          width="164px"
          disabled={readOnly}
        />
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
          Scoring Weight: Off-hours
        </Typography>
        <UIDefaultTextField
          sx={{ width: '48px' }}
          variant="standard"
          defaultValue={indicator?.unitWeightingMultiplier || 1}
          onChange={(event) =>
            handleInputChange(event, {
              operation: 'changeOutlierUnitWeightingMultiplier',
              targetId: id,
            })
          }
          disabled={readOnly}
        />
        <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
          Weekends
        </Typography>
        <UIDefaultTextField
          sx={{ width: '48px' }}
          variant="standard"
          defaultValue={indicator?.periodWeightingMultiplier || 1}
          onChange={(event) =>
            handleInputChange(event, {
              operation: 'changeOutlierPeriodWeightingMultiplier',
              targetId: id,
            })
          }
          disabled={readOnly}
        />
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
                dataSourceId={dataSourceValue ?? ''}
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
              dataSourceId={dataSourceValue ?? ''}
            />
          )}
      </UIFlexWrapBox>
    </Box>
  );
};

export default BuildRiskOutlierValueList;
