/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import React, { ChangeEvent } from 'react';
import {
  UIContainer,
  UIDefaultTextField,
  UIFlexWrapBox,
  UISelect,
  UIDefaultButton,
} from '@/components/UI';
import { behaviorData } from '@/_mock';
import { Box, InputLabel, Typography } from '@mui/material';
import { RiskIndicatorType } from '@/types';
import {
  behaviorTypeToRiskIndicatortype,
  riskIndicatorTypeToTypeData,
} from '@/_mock/models.mock';
import {
  getDataSourcesFields,
  getDataSourcesSelect,
  riskValueChangeHandler,
  saveAttribute,
} from '@/redux/slices';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { noop } from 'lodash';
import { useRouter } from 'next/router';
import { NewAttributeParams } from '@/types/models.type';

const BuildRiskNavbar = ({
  item,
  accessToken = null,
}: {
  item: RiskIndicatorType | null;
  accessToken: string | null;
}): JSX.Element => {
  const router = useRouter();
  const id = (item && item.id) || null;

  const dispatch = useAppDispatch();
  const stateResourceData = useAppSelector(getDataSourcesSelect);
  const stateFieldData = useAppSelector(getDataSourcesFields);
  const defaultDataSourceId =
    stateResourceData && stateResourceData.length > 0
      ? stateResourceData[0].id
      : undefined;

  const defaultRiskFieldId =
    defaultDataSourceId &&
    stateFieldData &&
    stateFieldData[defaultDataSourceId].length > 0
      ? stateFieldData[defaultDataSourceId][0].id
      : undefined;

  const handleSelectChange = (
    event: SelectChangeEvent<unknown>,
    {
      operation,
      targetId,
      listIndex,
      dataSourceId,
      riskFieldId,
      secondRiskFieldId,
    }: {
      operation: string;
      targetId: string | null;
      listIndex?: number | undefined;
      dataSourceId?: string | undefined;
      riskFieldId?: string | undefined;
      secondRiskFieldId?: string | undefined;
    }
  ): void => {
    const behaviorValue = (event.target.value as number) || null;
    const value = behaviorValue
      ? behaviorTypeToRiskIndicatortype[behaviorValue]
      : 'value';

    if (operation && targetId && value) {
      dispatch(
        riskValueChangeHandler({
          operation,
          id: targetId,
          value,
          listIndex,
          dataSourceId,
          riskFieldId,
          secondRiskFieldId,
        })
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
    const value = event.currentTarget.value ?? null;

    if (operation && targetId && value != null) {
      dispatch(
        riskValueChangeHandler({ operation, id: targetId, value, listIndex })
      );
    }
  };

  const dispatchSave = (args: NewAttributeParams): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        saveAttribute(args)
      );
      resolve();
    });
  };

  const handleSave: () => void = () => {
    const itemId = item && item.id;
    const name = (item && item.name) ?? '';
    const riskItem = itemId && itemId === 'NEW' ? { ...item, id: null } : item;
    const attributeJson = JSON.stringify(riskItem);
    if (accessToken) {
      dispatchSave({
        accessToken,
        attributeJson,
        author: 'Diego Martinez',
        name,
        lastUpdateDate: Date.now(),
      }).then(() => router.push('/configuration/risk').then(noop));
    }
  };

  const { behaviorTypeId = null } = (item &&
    item.attributeType &&
    riskIndicatorTypeToTypeData[item?.attributeType]) || {
    behaviorTypeId: null,
  };

  return (
    <UIContainer
      disableGutters
      sx={{ paddingTop: '27px', paddingLeft: '36px' }}
    >
      <Typography variant="h4" sx={{ mr: 4 }}>
        Build a Risk Indicator
      </Typography>
      <UIFlexWrapBox sx={{ alignItems: 'flex-end', mt: 2, gap: 4 }}>
        <Box>
          <InputLabel variant="standard" htmlFor="risk-indicator-input-helper">
            <Typography
              sx={{
                mb: 1,
                fontWeight: '400',
                fontSize: '13px',
                lineHeight: '20px',
                color: '#504F54',
              }}
            >
              Risk Indicator Name
            </Typography>
          </InputLabel>
          <UIDefaultTextField
            defaultValue={item?.name || ''}
            sx={{ width: '432px' }}
            id="risk-indicator-input-helper"
            variant="standard"
            onChange={(event) =>
              handleInputChange(event, {
                operation: 'changeRiskIndicatorName',
                targetId: id,
              })
            }
          />
        </Box>
        <Box>
          <InputLabel variant="standard" htmlFor="desc-input-helper">
            <Typography
              sx={{
                mb: 1,
                fontWeight: '400',
                fontSize: '13px',
                lineHeight: '20px',
                color: '#504F54',
              }}
            >
              Description
            </Typography>
          </InputLabel>
          <UIDefaultTextField
            defaultValue={item?.description || ''}
            id="desc-input-helper"
            sx={{ width: '576px' }}
            variant="standard"
            onChange={(event) =>
              handleInputChange(event, {
                operation: 'changeRiskIndicatorDescription',
                targetId: id,
              })
            }
          />
        </Box>
        <Box>
          <Typography
            sx={{
              mb: 1,
              fontWeight: '400',
              fontSize: '13px',
              lineHeight: '20px',
              color: '#504F54',
            }}
          >
            Behavior
          </Typography>
          <UISelect
            defaultValue={behaviorTypeId || -1}
            itemList={behaviorData}
            handleChange={(event) =>
              handleSelectChange(event, {
                targetId: id,
                operation: 'changeRiskType',
                dataSourceId: defaultDataSourceId,
                riskFieldId: defaultRiskFieldId,
                secondRiskFieldId: defaultRiskFieldId,
              })
            }
            width="236px"
            height="36px"
          />
        </Box>
        <UIDefaultButton sx={{ fontWeight: 400 }} onClick={handleSave}>
          Save
        </UIDefaultButton>
      </UIFlexWrapBox>
    </UIContainer>
  );
};

export default BuildRiskNavbar;
