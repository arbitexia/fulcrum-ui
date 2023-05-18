/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Ritesh Patel
 */

import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { NOTIFICATION_TAB } from '@/constants/notification';
import { UIContainer, UIDefaultButton, UIFlexSpaceBox } from '@/components/UI';

type NotificationNavBarPropsType = {
  openNewDlg: () => void;
};
const NotificationNavbar = (
  props: NotificationNavBarPropsType
): JSX.Element => {
  const router = useRouter();
  const { type: activeTab } = router.query as { type: string };

  return (
    <UIContainer>
      <UIFlexSpaceBox sx={{ alignItems: 'flex-end', alignContent: 'center' }}>
        <Typography variant="h4" sx={{ mr: 4 }}>
          Notifications
        </Typography>
        {activeTab === NOTIFICATION_TAB.MANAGE && (
          <UIDefaultButton onClick={props.openNewDlg}>Add New</UIDefaultButton>
        )}
      </UIFlexSpaceBox>
    </UIContainer>
  );
};

export default NotificationNavbar;
