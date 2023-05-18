/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { DefaultModalProps } from '@/types';
import { Box, Grid } from '@mui/material';
import {
  UIDefaultDialog,
  UIFlexColumnBox,
  UIModalButton,
  UISelect,
} from '@/components/UI';
import { NotificationItem, NotificationTextField } from './ui';

export const NewNotificationModal = ({
  open,
  onClose,
}: DefaultModalProps): JSX.Element => {
  return (
    <UIDefaultDialog open={open} onClose={onClose} title="Create Notification">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid item xs={3}>
            <NotificationItem>Type</NotificationItem>
          </Grid>
          <Grid item xs={9}>
            <NotificationItem>
              <UISelect
                defaultValue={0}
                itemList={[{ id: 0, name: 'Threshold Excedeed' }]}
                handleChange={(e) => console.log(e)}
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
                value="Arrest Severity (Abobe 50)"
                style={{ width: '80%' }}
              />
            </NotificationItem>
          </Grid>
          <Grid item xs={3}>
            <NotificationItem>Model Name</NotificationItem>
          </Grid>
          <Grid item xs={9}>
            <NotificationItem style={{ textAlign: 'left', width: 10 }}>
              <UISelect
                defaultValue={0}
                itemList={[{ id: 0, name: 'Combined Model' }]}
                handleChange={(e) => console.log(e)}
              />
            </NotificationItem>
          </Grid>
          <Grid item xs={3}>
            <NotificationItem>Category Name</NotificationItem>
          </Grid>
          <Grid item xs={9}>
            <NotificationItem style={{ textAlign: 'left', width: 10 }}>
              <UISelect
                defaultValue={0}
                itemList={[{ id: 0, name: 'All' }]}
                handleChange={(e) => console.log(e)}
              />
            </NotificationItem>
          </Grid>
          <Grid item xs={3}>
            <NotificationItem>Threshold</NotificationItem>
          </Grid>
          <Grid item xs={9}>
            <NotificationItem>
              <NotificationTextField style={{ width: '50px' }} value="50%" />
            </NotificationItem>
          </Grid>
        </Grid>
      </Box>
      <UIFlexColumnBox sx={{ alignItems: 'center' }}>
        <UIModalButton sx={{ marginTop: 4 }} onClick={onClose}>
          Save
        </UIModalButton>
      </UIFlexColumnBox>
    </UIDefaultDialog>
  );
};
