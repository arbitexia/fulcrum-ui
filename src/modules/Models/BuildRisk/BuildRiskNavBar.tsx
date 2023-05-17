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
import { behaviorData, riskTypeData } from '@/_mock';
import { Box, InputLabel, Typography } from '@mui/material';
import { RiskIndicatorType } from '@/types';
import {
  behaviorTypeToRiskIndicatortype,
  riskIndicatorTypeToTypeData,
} from '@/_mock/models.mock';
import {
  getAccessToken,
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
}: {
  item: RiskIndicatorType | null;
}): JSX.Element => {
  const router = useRouter();
  const id = (item && item.id) || null;
  const stateAccessToken = useAppSelector(getAccessToken);

  const dispatch = useAppDispatch();

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
    const behaviorValue = (event.target.value as number) || null;
    const value = behaviorValue
      ? behaviorTypeToRiskIndicatortype[behaviorValue]
      : 'value';

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
    if (stateAccessToken) {
      dispatchSave({
        accessToken: stateAccessToken,
        attributeJson,
        author: 'Diego Martinez',
        name,
        lastUpdateDate: Date.now(),
      }).then(() => router.push('/configuration/risk').then(noop));
    }
  };

  const { riskTypeId = null, behaviorTypeId = null } = (item &&
    item.attributeType &&
    riskIndicatorTypeToTypeData[item?.attributeType]) || {
    riskTypeId: null,
    behaviorTypeId: null,
  };

  return (
    <UIContainer>
      <Typography variant="h4" sx={{ mr: 4 }}>
        Build a Risk Indicator
      </Typography>
      <UIFlexWrapBox sx={{ alignItems: 'flex-end', mt: 2, gap: 4 }}>
        <Box>
          <InputLabel variant="standard">
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
            sx={{ width: '288px' }}
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
          <InputLabel variant="standard">
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
            sx={{ width: '288px' }}
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
            Type
          </Typography>
          <UISelect
            defaultValue={riskTypeId || -1}
            itemList={riskTypeData}
            handleChange={noop}
            width="236px"
            height="36px"
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
