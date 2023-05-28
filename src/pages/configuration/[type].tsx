/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { Box, LinearProgress, Tab, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/system';
import {
  UIContainer,
  UITabWrapper,
  UITabPanel,
  UIFlexSpaceBox,
  UIDefaultButton,
} from '@/components/UI';
import { DashboardLayout } from '@/layouts';
import {
  ModelsNavbar,
  ModelsConfigModal,
  ConfigurationTable,
  EditListModal,
  EditFilterModal,
} from '@/modules/Models';
import {
  attributesSelector,
  getDataSourcesConfigInitialized,
  filtersSelector,
  modelsSelector,
  retrieveDataSources,
  retrieveFilters,
  addNewFilter,
  retrieveModels,
  retrieveLists,
  listsSelector,
  setSelectedListId,
  deleteModel,
  deleteStats,
  deleteAttribute,
  deleteList,
} from '@/redux/slices';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { DeleteListParams, List, Model, RiskIndicatorType } from '@/types';
import { noop } from 'lodash';
import {
  clearAttributeMessage,
  getHasDeleteAttributeMessage,
  retrieveAttributes,
} from '@/redux/slices/attributes.slice';
import {
  DeleteAttributeParams,
  DeleteModelParams,
  Filter,
  RetrieveAttributesParams,
  RetrieveListsParams,
  RetrieveFiltersParams,
  RetrieveModelsParams,
} from '@/types/models.type';
import { AppDispatch } from '@/redux/store';
import { DeleteConfirmModal } from '@/modules/Models/DeleteModal';
import { DeleteStatParams } from '@/types/stats.type';
import { setSelectedFilterId } from '@/redux/slices/filters.slice';
import config from '@/config';
import { fullRun } from '@/redux/slices/control.slice';
import { useAppToast } from '@/providers';
import { ErrorModal } from '@/modules/Models/ErrorModal';
import { readCookie } from '@/libs/cookie-utils';

const baseAuthenticationUrl: string = config.URLS.AUTHENTICATION || '';

const tabData = [
  {
    label: 'Models',
    url: 'model',
    actions: ['edit', 'copy', 'delete', 'settings'],
  },
  {
    label: 'Risk Indicators',
    url: 'risk',
    actions: ['edit', 'copy', 'delete'],
  },
  {
    label: 'Lists',
    url: 'list',
    dataGetter: null,
    actions: ['edit', 'copy', 'delete'],
  },
  {
    label: 'Filters',
    url: 'filter',
    actions: ['edit', 'copy', 'delete'],
  },
];

const activeTabDispatchers: {
  [name: string]: (
    dispatcher: AppDispatch,
    args?:
      | RetrieveModelsParams
      | RetrieveAttributesParams
      | RetrieveListsParams
      | RetrieveFiltersParams
  ) => void;
} = {
  model: (dispatcher, args?: RetrieveModelsParams) => {
    if (args) {
      dispatcher(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveModels(args)
      )
        .then(
          dispatcher(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            retrieveAttributes(args)
          )
        )
        .then(noop);
    }
  },
  risk: async (dispatcher, args?: RetrieveAttributesParams) => {
    if (args) {
      dispatcher(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveAttributes(args)
      ).then(noop);
    }
  },
  list: async (dispatcher, args?: RetrieveListsParams) => {
    if (args) {
      dispatcher(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveLists(args)
      ).then(noop);
    }
  },
  filter: async (dispatcher, args?: RetrieveFiltersParams) => {
    if (args) {
      dispatcher(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        retrieveFilters(args)
      ).then(noop);
    }
  },
  newFilter: async (dispatcher) => {
    dispatcher(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      addNewFilter({})
    );
  },
};

const deleteModalTitles: {
  [name: string]: string;
} = {
  model: 'Delete Model',
  risk: 'Delete Risk Indicator',
  list: 'Delete List',
  filter: 'Delete Filter',
};

const errorModalTitles: {
  [name: string]: string;
} = {
  model: 'Error Deleting Model',
  risk: 'Error Deleting Risk Indicator',
  list: 'Error Deleting List',
  filter: 'Error Deleting Filter',
};

const pageTitles: {
  [name: string]: string;
} = {
  model: 'Model and Scoring Configuration',
  risk: 'Risk Indicator and Scoring Configuration',
  list: 'List Configuration',
  filter: 'Filter Configuration',
};

const Models = (): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const appToast = useAppToast();
  const { query, isReady } = router as {
    query: { type?: string };
    isReady: boolean;
  };
  const { type: activeTab } = query as { type: string };
  const dispatch: AppDispatch = useAppDispatch();
  const modelsInput = useAppSelector(modelsSelector);
  const attributesInput = useAppSelector(attributesSelector);
  const listsInput = useAppSelector(listsSelector);
  const filtersInput = useAppSelector(filtersSelector);
  const isDataSourceConfigInitialized = useAppSelector(
    getDataSourcesConfigInitialized
  );
  const hasDeleteAttributemessage = useAppSelector(
    getHasDeleteAttributeMessage
  );
  const cookieAccessToken = readCookie('accessToken');
  const [value, setValue] = useState<number>(0);
  const [models, setModels] = useState<Model[]>(modelsInput);
  const [attributes, setAttributes] =
    useState<RiskIndicatorType[]>(attributesInput);
  const [lists, setLists] = useState<List[]>(listsInput);
  const [filters, setFilters] = useState<Filter[]>(filtersInput);
  const [openModelConfig, setOpenModelConfig] = useState<boolean>(false);
  const [openListEdit, setOpenListEdit] = useState<boolean>(false);
  const [openFilterEdit, setOpenFilterEdit] = useState<boolean>(false);
  const [actionId, setActionId] = useState<number | string | null>(0);
  const [itemName, setItemName] = useState<string>('');
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);

  useEffect(() => {
    if (isReady) {
      if (!cookieAccessToken) {
        router
          .push(
            `${baseAuthenticationUrl}/login/${config.AUTHENTICATION_SERVICE}`
          )
          .then(noop);
      }
    }
  }, [isReady, cookieAccessToken, router]);

  useEffect(() => {
    if (!isDataSourceConfigInitialized && cookieAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveDataSources({ accessToken: cookieAccessToken }));
    }
  }, [isDataSourceConfigInitialized, dispatch, cookieAccessToken]);

  useEffect(() => {
    if (activeTab && dispatch && cookieAccessToken) {
      const path = tabData.findIndex((item) => item.url === activeTab);
      const index = path > -1 ? path : 0;
      setValue(index);
      const args = {
        accessToken: cookieAccessToken,
        limit: 1000,
      };
      const dispatcher = activeTabDispatchers[activeTab];
      dispatcher && dispatcher(dispatch, args);
    }
  }, [activeTab, dispatch, cookieAccessToken]);

  useEffect(() => {
    setModels(modelsInput);
  }, [modelsInput]);

  useEffect(() => {
    setAttributes(attributesInput);
  }, [attributesInput]);

  useEffect(() => {
    setLists(listsInput);
  }, [listsInput]);

  useEffect(() => {
    setFilters(filtersInput);
  }, [filtersInput]);

  useEffect(() => {
    if (hasDeleteAttributemessage && !openErrorModal) {
      setOpenErrorModal(true);
    }
  }, [hasDeleteAttributemessage, openErrorModal]);

  const handleTabChange = (val: string): void => {
    router.push(`/configuration/${val}`).then(noop);
  };

  const handleActionClick = (
    url: string,
    action: string,
    id: string | number,
    name?: string
  ): void => {
    if (url === 'list') {
      if (action === 'edit') {
        if (id === 'new') {
          setActionId(null);
          dispatch(setSelectedListId({ id: null }));
          setOpenListEdit(true);
        } else {
          setActionId(id);
          dispatch(setSelectedListId({ id }));
          setOpenListEdit(true);
        }
      } else if (action === 'delete') {
        setActionId(id);
        dispatch(setSelectedListId({ id }));
        setOpenDeleteModal(true);
      }
    }
    if (url === 'filter') {
      if (id === 'new') {
        const dispatcher = activeTabDispatchers['newFilter'];
        dispatcher && dispatcher(dispatch);
        setOpenFilterEdit(true);
      } else if (action === 'edit') {
        dispatch(setSelectedFilterId({ filterId: id }));
        setOpenFilterEdit(true);
      }
    }
    if (url === 'risk') {
      if (id === 'new') {
        router.push(`/configuration/${url}/build`).then(noop);
        setItemName('');
      } else {
        if (action === 'edit') {
          router.push(`/configuration/${url}/${id}`).then(noop);
        } else if (action === 'delete') {
          setActionId(id);
          if (name) {
            setItemName(name);
          }
          setOpenDeleteModal(true);
        }
      }
    }
    if (url === 'model') {
      if (id == 'new') {
        router.push(`/configuration/${url}/build`).then(noop);
      } else {
        if (action === 'edit') {
          router.push(`/configuration/${url}/build?modelId=${id}`).then(noop);
        } else if (action === 'settings') {
          setActionId(id);
          setOpenModelConfig(true);
        } else if (action === 'delete') {
          setActionId(id);
          setOpenDeleteModal(true);
        }
      }
    }
  };

  const dispatchStatDelete = (args: DeleteStatParams): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        deleteStats(args)
      );
      resolve();
    });
  };

  const dispatchModelDelete = (args: DeleteModelParams): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        deleteModel(args)
      );
      resolve();
    });
  };

  const dispatchRiskIndicatorDelete = (
    args: DeleteAttributeParams
  ): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        deleteAttribute(args)
      );
      resolve();
    });
  };

  const dispatchListDelete = (args: DeleteListParams): Promise<unknown> => {
    return new Promise<void>((resolve) => {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        deleteList(args)
      );
      resolve();
    });
  };

  const deleteFunctionByUrl: {
    [url: string]: ({
      id,
      name,
      resolver,
    }: {
      id: string;
      name?: string;
      resolver: () => void;
    }) => void;
  } = {
    model: ({ id, resolver }: { id: string; resolver: () => void }) => {
      if (cookieAccessToken) {
        dispatchStatDelete({
          accessToken: cookieAccessToken,
          modelId: id,
          instance: 0,
        }).then(() =>
          dispatchModelDelete({
            accessToken: cookieAccessToken,
            modelId: id,
          }).then(resolver)
        );
      }
      return;
    },
    risk: ({
      id,
      name,
      resolver,
    }: {
      id: string;
      name?: string;
      resolver: () => void;
    }) => {
      if (cookieAccessToken && name) {
        dispatchRiskIndicatorDelete({
          accessToken: cookieAccessToken,
          attributeName: name,
          attributeId: id,
        })
          .then(resolver)
          .catch(() => {
            setOpenErrorModal(true);
          });
      }
      return;
    },
    list: ({ id, resolver }: { id: string; resolver: () => void }) => {
      if (cookieAccessToken) {
        dispatchListDelete({
          accessToken: cookieAccessToken,
          listId: id,
        }).then(resolver);
      }
      return;
    },
  };

  const handleScoringChange = (): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    appToast({ severity: 'success', message: 'Scoring request started' });
    if (cookieAccessToken) {
      dispatch(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fullRun({
          accessToken: cookieAccessToken,
        })
      );
    }
  };

  const deleteFunction = ({
    url,
    id,
    name,
  }: {
    url: string;
    id: string | number;
    name?: string | undefined;
  }): void => {
    deleteFunctionByUrl[url]({
      id: id as string,
      name: name ?? '',
      resolver: () => setOpenDeleteModal(false),
    });
  };

  const onCloseErrorModal = (): void => {
    dispatch(clearAttributeMessage());
    setOpenErrorModal(false);
  };

  if (!cookieAccessToken) {
    return <LinearProgress />;
  }

  const deleteModalTitle: string = deleteModalTitles[activeTab];

  const errorModalTitle: string = errorModalTitles[activeTab];

  const pageTitle: string = pageTitles[activeTab];

  return (
    <DashboardLayout
      title={pageTitle}
      navbarBorder={false}
      navEls={
        <ModelsNavbar
          url={activeTab}
          action="edit"
          id="new"
          onActionClick={handleActionClick}
        />
      }
    >
      <UIContainer
        disableGutters
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 10,
          padding: theme.spacing(2.5, 0),
          maxWidth: '91.7vw',
          [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(2.5, 10),
          },
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          <UITabWrapper
            onChange={(_, newValue?: number) =>
              setValue(newValue ? newValue : 0)
            }
            value={value}
          >
            {tabData?.map(({ label, url }, index) => (
              <Tab
                key={index}
                disableRipple
                label={label}
                onClick={() => handleTabChange(url)}
              />
            ))}
          </UITabWrapper>
          <UIFlexSpaceBox sx={{ alignItems: 'flex-end', width: '100%' }}>
            <Typography variant="h4" sx={{ mr: 4 }}></Typography>
            <UIFlexSpaceBox sx={{ gap: 2 }}>
              <UIDefaultButton onClick={handleScoringChange}>
                Restart Scoring
              </UIDefaultButton>
            </UIFlexSpaceBox>
          </UIFlexSpaceBox>
        </Box>
      </UIContainer>
      <UIContainer
        sx={{
          background: '#FFFFFF',
          position: 'relative',
          top: '-20px',
          [theme.breakpoints.up('sm')]: {
            width: '83.25%',
          },
        }}
      >
        {activeTab === 'model' && models && (
          <UITabPanel key={0} value={value} index={0} dir={theme.direction}>
            <ConfigurationTable
              data={models}
              url={tabData[0].url}
              actions={tabData[0].actions}
              onActionClick={handleActionClick}
              accessToken={cookieAccessToken}
            />
          </UITabPanel>
        )}
        {activeTab === 'risk' && attributes && (
          <UITabPanel key={1} value={value} index={1} dir={theme.direction}>
            <ConfigurationTable
              data={attributes}
              url={tabData[1].url}
              actions={tabData[1].actions}
              onActionClick={handleActionClick}
              accessToken={cookieAccessToken}
            />
          </UITabPanel>
        )}
        {activeTab === 'list' && lists && (
          <UITabPanel key={2} value={value} index={2} dir={theme.direction}>
            <ConfigurationTable
              data={lists}
              url={tabData[2].url}
              actions={tabData[2].actions}
              onActionClick={handleActionClick}
              accessToken={cookieAccessToken}
            />
          </UITabPanel>
        )}
        {activeTab === 'filter' && filters && (
          <UITabPanel key={3} value={value} index={3} dir={theme.direction}>
            <ConfigurationTable
              data={filters}
              url={tabData[3].url}
              actions={tabData[3].actions}
              onActionClick={handleActionClick}
              accessToken={cookieAccessToken}
            />
          </UITabPanel>
        )}
      </UIContainer>
      <ModelsConfigModal
        open={openModelConfig}
        onClose={() => setOpenModelConfig(false)}
      />
      <EditListModal
        open={openListEdit}
        onClose={() => setOpenListEdit(false)}
        id={actionId}
        accessToken={cookieAccessToken}
      />
      <EditFilterModal
        open={openFilterEdit}
        onClose={() => setOpenFilterEdit(false)}
        id={actionId}
        accessToken={cookieAccessToken}
      />
      {actionId !== null && (
        <DeleteConfirmModal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          id={actionId}
          title={deleteModalTitle}
          typeUrl={activeTab}
          onConfirm={() =>
            deleteFunction({ url: activeTab, id: actionId, name: itemName })
          }
        />
      )}
      {actionId !== null && (
        <ErrorModal
          open={openErrorModal}
          onClose={onCloseErrorModal}
          id={actionId}
          title={errorModalTitle}
          typeUrl={activeTab}
        />
      )}
      <ModelsConfigModal
        open={openModelConfig}
        onClose={() => setOpenModelConfig(false)}
      />
    </DashboardLayout>
  );
};

export default Models;
