/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { AttributesType, DefaultModalProps } from '@/types';
import { Box, Grid } from '@mui/material';
import {
  UIDefaultDialog,
  UIFlexColumnBox,
  UIModalButton,
  UISelect,
} from '@/components/UI';
import { NotificationItem, NotificationTextField } from './ui';
import { notificationTypes, SCORE_THRESHOLD } from '@/_mock/notification.mock';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/hooks';
import {
  getActiveModelistSelector,
  getSelectedModelId,
  modelCategoriesByIdSelector,
} from '@/redux/slices/model.slice';
import { UISelectInterface } from '@/types/common.type';
import { roundScore } from '@/libs/math-utils';

interface NewNotificationParams extends DefaultModalProps {
  onSubmit: ({
    notificationId,
    notificationType,
    modelId,
    categoryName,
    threshold,
  }: {
    notificationId: string | null;
    notificationType: string;
    modelId: string;
    categoryName: string;
    threshold: number;
  }) => void;
  inputNotificationId: string | null;
  inputNotificationType: string | null;
  inputModelId: string | null;
  inputCategoryName: string | null;
  inputThreshold: number | null;
  useInputs: boolean;
  setUseInputs: (value: boolean) => void;
}

export const NewNotificationModal = ({
  open,
  onClose,
  onSubmit,
  inputNotificationId,
  inputNotificationType,
  inputModelId,
  inputCategoryName,
  inputThreshold,
  useInputs = false,
  setUseInputs,
}: NewNotificationParams): JSX.Element => {
  const modelsList = useAppSelector(getActiveModelistSelector).items;
  const firstModelId = useAppSelector(getSelectedModelId);
  const defaultModelId = inputModelId ?? firstModelId;
  const defaultNotificationType = inputNotificationType ?? SCORE_THRESHOLD;
  const [notificationType, setNotificationType] = useState<string>(
    defaultNotificationType
  );
  const defaultNotificationId = inputNotificationId ?? '';
  const [notificationId, setNotificationId] = useState<string>(
    defaultNotificationId
  );
  const [modelId, setModelId] = useState<string>(defaultModelId);
  const [prevModelId, setPrevModelId] = useState<string>(modelId);
  const categoriesListSelected: AttributesType[] = useAppSelector(
    modelCategoriesByIdSelector(modelId)
  );
  const categoriesUIInterfaceIncoming: UISelectInterface[] = useMemo(
    () =>
      categoriesListSelected.map((category) => ({
        id: category.name,
        name: category.name,
      })),
    [categoriesListSelected]
  );
  const categoriesUIInterface: UISelectInterface[] = useMemo(
    () => [{ id: '', name: 'All' }, ...categoriesUIInterfaceIncoming],
    [categoriesUIInterfaceIncoming]
  );
  const defaultCategoryName =
    inputCategoryName ??
    (categoriesUIInterface ? (categoriesUIInterface[0].id as string) : '');
  const [categoriesList, setCategoriesList] = useState<UISelectInterface[]>(
    categoriesUIInterface
  );
  const [categoryName, setCategoryName] = useState<string>(defaultCategoryName);
  const [needCategoryNameChange, setNeedCategoryNameChange] =
    useState<boolean>(false);
  const defaultThreshold = inputThreshold ?? 0;
  const [threshold, setThreshold] = useState<number>(defaultThreshold);

  useEffect(() => {
    if (needCategoryNameChange) {
      setCategoriesList(categoriesUIInterface);
      setCategoryName(defaultCategoryName);
      setNeedCategoryNameChange(false);
    }
  }, [
    categoriesUIInterface,
    defaultCategoryName,
    categoryName,
    needCategoryNameChange,
    setNeedCategoryNameChange,
  ]);

  useEffect(() => {
    if (prevModelId !== modelId) {
      const newCategoriesListIncoming: UISelectInterface[] =
        categoriesListSelected.map((category) => ({
          id: category.name,
          name: category.name,
        }));
      const newCategoriesList = [
        { id: '', name: 'All' },
        ...newCategoriesListIncoming,
      ];
      setCategoriesList(newCategoriesList);
      setCategoryName(defaultCategoryName);
      setPrevModelId(modelId);
    }
  }, [
    prevModelId,
    modelId,
    categoriesListSelected,
    setCategoriesList,
    setPrevModelId,
    setCategoryName,
    defaultCategoryName,
  ]);

  useEffect(() => {
    if (useInputs) {
      setNotificationType(defaultNotificationType);
      setNotificationId(defaultNotificationId);
      setPrevModelId(modelId);
      setCategoryName(defaultCategoryName);
      setModelId(defaultModelId);
      setThreshold(defaultThreshold);
      setUseInputs(false);
      setNeedCategoryNameChange(true);
    }
  }, [
    useInputs,
    setUseInputs,
    defaultNotificationType,
    defaultNotificationId,
    modelId,
    defaultModelId,
    defaultCategoryName,
    defaultThreshold,
    setNeedCategoryNameChange,
  ]);

  const closeFn = (): void => {
    setNotificationType(SCORE_THRESHOLD);
    setNotificationId('');
    setPrevModelId(firstModelId);
    setModelId(firstModelId);
    setCategoryName('');
    setThreshold(0);
    setNeedCategoryNameChange(true);
    onClose();
  };

  const submit = (): void => {
    onSubmit({
      notificationId,
      notificationType,
      modelId,
      categoryName,
      threshold,
    });
    closeFn();
  };

  return (
    <UIDefaultDialog open={open} onClose={closeFn} title="Create Notification">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid item xs={3}>
            <NotificationItem>Type</NotificationItem>
          </Grid>
          <Grid item xs={9}>
            <NotificationItem>
              <UISelect
                value={notificationType}
                defaultValue={notificationType}
                itemList={notificationTypes}
                handleChange={(e) =>
                  setNotificationType(e.target.value as string)
                }
                width="30%"
              />
            </NotificationItem>
          </Grid>
          <Grid item xs={3}>
            <NotificationItem>Name</NotificationItem>
          </Grid>
          <Grid item xs={9}>
            <NotificationItem>
              <NotificationTextField
                value={notificationId}
                style={{ width: '80%' }}
                onChange={(e) => {
                  setNotificationId(e.target.value as string);
                }}
              />
            </NotificationItem>
          </Grid>
          <Grid item xs={3}>
            <NotificationItem>Model Name</NotificationItem>
          </Grid>
          <Grid item xs={9}>
            <NotificationItem style={{ textAlign: 'left', width: 10 }}>
              <UISelect
                value={modelId}
                itemList={modelsList}
                handleChange={(e) => {
                  setModelId(e.target.value as string);
                }}
              />
            </NotificationItem>
          </Grid>
          <Grid item xs={3}>
            <NotificationItem>Category Name</NotificationItem>
          </Grid>
          <Grid item xs={9}>
            <NotificationItem style={{ textAlign: 'left', width: 10 }}>
              <UISelect
                value={categoryName}
                itemList={categoriesList}
                handleChange={(e) => {
                  setCategoryName(e.target.value as string);
                }}
              />
            </NotificationItem>
          </Grid>
          <Grid item xs={3}>
            <NotificationItem>Threshold</NotificationItem>
          </Grid>
          <Grid item xs={9}>
            <NotificationItem>
              <NotificationTextField
                style={{ width: '50px' }}
                value={roundScore(threshold)}
                type="number"
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                onChange={(e) => {
                  setThreshold(
                    parseInt((e.target.value as string) || '0') / 100
                  );
                }}
              />
            </NotificationItem>
          </Grid>
        </Grid>
      </Box>
      <UIFlexColumnBox sx={{ alignItems: 'center' }}>
        <UIModalButton sx={{ marginTop: 4 }} onClick={submit}>
          Save
        </UIModalButton>
      </UIFlexColumnBox>
    </UIDefaultDialog>
  );
};
