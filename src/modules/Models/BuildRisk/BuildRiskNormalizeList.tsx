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
import { RiskIndicatorType } from '@/types';
import { UISelectInterface } from '@/types/common.type';
import { useAppDispatch } from '@/hooks';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { riskValueChangeHandler } from '@/redux/slices';
import BuildRiskSettings from '@/modules/Models/BuildRisk/BuildRiskSettings';
import BuildInformationIcon from '@/modules/Models/BuildRisk/BuildInformationIcon';

const BuildRiskNormalizeList = ({
  indicator,
  dataSources,
  riskFields,
  lists,
  onOpenHistory,
  datasourceChange,
  readOnly = false,
}: {
  indicator: RiskIndicatorType | null;
  dataSources: UISelectInterface[];
  riskFields: { [dataSource: string]: UISelectInterface[] };
  lists: { id: string; label: string }[];
  onOpenHistory: () => void;
  datasourceChange: (dataSourceId: string) => void;
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
          <BuildInformationIcon
            title="Historical Data"
            onOpenHistory={onOpenHistory}
            readOnly={readOnly}
          />
          <Typography sx={{ fontSize: '13px', color: '#504F54' }}>
            passthrough the risk score from a source range of
          </Typography>
          <UIDefaultTextField
            sx={{ width: '5em', textAlign: 'right' }}
            inputProps={{ sx: { textAlign: 'right' } }}
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
            sx={{ width: '5em', textAlign: 'right' }}
            inputProps={{ sx: { textAlign: 'right' } }}
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
      <BuildRiskSettings
        indicator={indicator}
        dataSources={dataSources}
        readOnly={readOnly}
        lists={lists}
      />
    </Box>
  );
};

export default BuildRiskNormalizeList;
