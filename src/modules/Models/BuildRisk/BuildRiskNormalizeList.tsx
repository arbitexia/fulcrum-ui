/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Dan Finkel
 */
import React, { ChangeEvent } from 'react';
import { Typography, Box } from '@mui/material';
import { UIFlexWrapBox, UISelect, UIDefaultTextField } from '@/components/UI';
import { overTimeData, useData, dateData, reduceData } from '@/_mock';
import { RiskIndicatorType } from '@/types';
import { UISelectInterface } from '@/types/common.type';
import { useAppDispatch } from '@/hooks';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { riskValueChangeHandler, riskValueClickHandler } from '@/redux/slices';
import RecordExcludeItem from '@/modules/Models/BuildRisk/RecordExcludeItem';

const BuildRiskNormalizeList = ({
  indicator,
  dataSources,
  riskFields,
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
            passthrough the risk score from a source range of
          </Typography>
          <UIDefaultTextField
            sx={{ width: '72px' }}
            variant="standard"
            defaultValue={indicator?.min || ''}
            onChange={(event) =>
              handleInputChange(event, {
                operation: 'changeRiskFieldNormalizeMin',
                targetId: id,
              })
            }
            disabled={readOnly}
          />
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            to
          </Typography>
          <UIDefaultTextField
            sx={{ width: '72px' }}
            variant="standard"
            defaultValue={indicator?.max || ''}
            onChange={(event) =>
              handleInputChange(event, {
                operation: 'changeRiskFieldNormalizeMax',
                targetId: id,
              })
            }
            disabled={readOnly}
          />
        </UIFlexWrapBox>
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

export default BuildRiskNormalizeList;
