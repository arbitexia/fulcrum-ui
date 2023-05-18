/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */

import {
  Avatar,
  Box,
  Typography,
  styled,
  CircularProgress,
} from '@mui/material';
import { PropertyType } from '@/types/entity.type';
import {
  UIContainer,
  UIFlexSpaceBox,
  UIFlexWrapBox,
  UIAvatarArea,
  UISelectBox,
  UISelectItem,
} from '@/components/UI';
import { useEffect, useState } from 'react';
import { EntityProperty, EntityPropertyBase, Model } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  modelsSelector,
  setSelectedModelId,
  getSelectedModelId,
  getEntitiesConfigInitialized,
  getEntityDetailProperties,
} from '@/redux/slices';
import { chunkArray } from '@/libs/array-utils';
import { formatKey } from '@/libs/string-utils';
import { objectHasPropertyName } from '@/libs/object-utils';
import { NOT_AVAILABLE } from '@/redux/slices/entity.slice';

const StyledTextLabel = styled(Typography)({
  fontWeight: '400',
  fontSize: '13px',
  lineHeight: '32px',
  letterSpacing: '0.108333px',
  color: '#39474E',
  opacity: 0.85,
  borderBottom: '1px solid #D0D8DC',
  textTransform: 'capitalize',
});

const StyledTextValue = styled(Typography)({
  paddingLeft: '45px',
  fontWeight: '400',
  fontSize: '13px',
  lineHeight: '32px',
  letterSpacing: '0.108333px',
  color: '#504F54',
  borderBottom: '1px solid #D0D8DC',
});

const UserDetailView = ({
  entityProperties,
}: {
  entityProperties: PropertyType | null;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const modelsSelected = useAppSelector(modelsSelector);
  const selectedModelId: string = useAppSelector(getSelectedModelId);
  const entitiesConfigState = useAppSelector(getEntityDetailProperties);
  const isEntitiesConfigLoaded = useAppSelector(getEntitiesConfigInitialized);
  const displayEntitiesName: EntityProperty[] = entitiesConfigState.filter(
    (entityProperty) => {
      if (objectHasPropertyName(entityProperty, 'propertyName')) {
        const entityPropertyBase: EntityPropertyBase =
          entityProperty as EntityPropertyBase;
        return entityPropertyBase.propertyName !== 'icon';
      } else {
        return entityProperty !== 'icon';
      }
    }
  );
  const [models, setModels] = useState<Model[]>(modelsSelected);

  const propertyKeyArrays = chunkArray(displayEntitiesName, 4);

  useEffect(() => {
    setModels(modelsSelected);
  }, [modelsSelected]);

  if (!isEntitiesConfigLoaded) {
    return <CircularProgress />;
  }

  const missingValPlaceHolder = NOT_AVAILABLE;
  return (
    <Box sx={{ background: '#FFFFFF' }}>
      <Box sx={{ background: '#eceff1' }}>
        <UIContainer>
          <UIFlexWrapBox sx={{ pl: 7, gap: 8, py: 2 }}>
            <UIAvatarArea
              sx={{
                width: '130px',
                height: '130px',
                border: '4px solid #FFFFFF',
                borderRadius: '50%',
                overflow: 'hidden',
              }}
            >
              <Avatar
                src="/images/profile.png"
                sx={{
                  width: '130px',
                  height: '130px',
                }}
              />
            </UIAvatarArea>
            {entityProperties &&
              displayEntitiesName &&
              displayEntitiesName.length > 0 &&
              propertyKeyArrays.length > 0 &&
              propertyKeyArrays.map((propertyKeyArray: EntityProperty[], index) => {
                return (
                  <Box key={index}>
                    <UIFlexSpaceBox sx={{ gap: 0 }}>
                      <Box>
                        {propertyKeyArray.map(
                          (entityProperty: EntityProperty, propertyIndex) => {
                            const style =
                              propertyIndex % 4 === 3
                                ? { borderBottom: '0px' }
                                : null;
                            const entityName: string = objectHasPropertyName(
                              entityProperty,
                              'propertyName'
                            )
                              ? (entityProperty as EntityPropertyBase).propertyName
                              : (entityProperty as string);
                            return (
                              <StyledTextLabel
                                sx={style}
                                key={`${entityName}-${propertyIndex}`}
                              >
                                {formatKey(entityName, ['id', 'eid', 'pc'])}
                              </StyledTextLabel>
                            );
                          }
                        )}
                      </Box>
                      <Box>
                        {propertyKeyArray.map((entityProperty, propertyIndex) => {
                          const key: string = objectHasPropertyName(
                            entityProperty,
                            'propertyName'
                          )
                            ? (entityProperty as EntityPropertyBase).propertyName
                            : (entityProperty as string);
                          const values: string[] | undefined =
                            objectHasPropertyName(entityProperty, 'values')
                              ? (entityProperty as EntityPropertyBase).values
                              : undefined;
                          const concatNameValues = values
                            ? values
                              .map(
                                (value: keyof PropertyType) =>
                                  entityProperties[value]
                              )
                              .filter(
                                (rowValue: string | number | boolean | null) =>
                                  rowValue
                              )
                              .join(' ')
                            : '';
                          const nameValue: string | number | boolean | null =
                            values &&
                              values.length > 0 &&
                              concatNameValues &&
                              concatNameValues.length > 0
                              ? concatNameValues
                              : entityProperties[key];
                          const value = nameValue ?? missingValPlaceHolder;
                          const style =
                            propertyIndex % 4 === 3
                              ? { borderBottom: '0px' }
                              : null;
                          return (
                            <StyledTextValue
                              sx={style}
                              key={`${key}-${value}-${propertyIndex}`}
                            >
                              {value}
                            </StyledTextValue>
                          );
                        }
                        )}
                      </Box>
                    </UIFlexSpaceBox>
                  </Box>
                );
              }
              )}
          </UIFlexWrapBox>
        </UIContainer>
      </Box>
      <UIContainer>
        <UIFlexSpaceBox sx={{ mt: 1 }}>
          {selectedModelId && models && models.length > 0 ? (
            <UIFlexWrapBox sx={{ alignItems: 'center' }}>
              <UISelectBox
                id="demo-simple-select-helper"
                label="status"
                defaultValue={selectedModelId}
                onChange={(event) => {
                  const value = event.target.value;
                  dispatch(setSelectedModelId({ modelId: value as string }));
                }}
                width="310px"
                height="48px"
              >
                {models &&
                  models.map((item: Model, index) => {
                    const { id, name } = item;
                    if (id !== null && name !== null) {
                      return (
                        <UISelectItem
                          key={index}
                          value={id}
                          sx={{ minWidth: '140px' }}
                        >
                          <UIFlexSpaceBox width="100%">
                            <Typography
                              sx={{
                                fontWeight: '400',
                                fontSize: '16px',
                                lineHeight: '20px',
                                color: '#0050BE',
                              }}
                            >
                              {name}
                            </Typography>
                          </UIFlexSpaceBox>
                        </UISelectItem>
                      );
                    }
                    return null;
                  })}
              </UISelectBox>
              <Typography
                sx={{
                  ml: 2.5,
                  fontWeight: '400',
                  fontSize: '13px',
                  lineHeight: '16px',
                  color: '#485A63',
                  opacity: '0.8',
                }}
              >
                Rank: 1 of 31,200 (top 1%)
              </Typography>
            </UIFlexWrapBox>
          ) : (
            <Box></Box>
          )}
          <Typography
            sx={{
              fontWeight: '400',
              fontSize: '13px',
              lineHeight: '16px',
              color: '#485A63',
              opacity: '0.8',
            }}
          >
            Results as of: July 12, 2022 6:12 am
          </Typography>
        </UIFlexSpaceBox>
      </UIContainer>
    </Box>
  );
};

export default UserDetailView;
