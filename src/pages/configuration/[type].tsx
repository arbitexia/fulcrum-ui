/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
import { Tab } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/system';
import { UIContainer, UITabWrapper, UITabPanel } from '@/components/UI';
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
  getCurrentAttributeDataSourceIdSelector,
  modelsSelector,
  retrieveDataSources,
  retrieveModels,
  getAccessToken,
  retrieveLists,
  listsSelector,
  setSelectedListId,
  deleteModel,
  deleteStats,
  deleteAttribute,
  deleteList,
} from '@/redux/slices';
import { filtersTableData } from '@/_mock';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { DeleteListParams, List, Model, RiskIndicatorType } from '@/types';
import { noop } from 'lodash';
import { retrieveAttributes } from '@/redux/slices/attributes.slice';
import {
  DeleteAttributeParams,
  DeleteModelParams,
  RetrieveAttributesParams,
  RetrieveListsParams,
  RetrieveModelsParams,
} from '@/types/models.type';
import { AppDispatch } from '@/redux/store';
import { DeleteConfirmModal } from '@/modules/Models/DeleteModal';
import { DeleteStatParams } from '@/types/stats.type';

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
    data: filtersTableData,
    dataGetter: null,
    actions: ['edit', 'copy', 'delete'],
  },
];

const activeTabDispatchers: {
  [name: string]: (
    dispatcher: AppDispatch,
    args: RetrieveModelsParams | RetrieveAttributesParams | RetrieveListsParams
  ) => void;
} = {
  model: (dispatcher, args: RetrieveModelsParams) => {
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
  },
  risk: async (dispatcher, args: RetrieveAttributesParams) => {
    dispatcher(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      retrieveAttributes(args)
    ).then(noop);
  },
  list: async (dispatcher, args: RetrieveListsParams) => {
    dispatcher(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      retrieveLists(args)
    ).then(noop);
  },
};

const Models = (): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();
  const { type: activeTab } = router.query as { type: string };
  const dispatch: AppDispatch = useAppDispatch();
  const modelsInput = useAppSelector(modelsSelector);
  const attributesInput = useAppSelector(attributesSelector);
  const listsInput = useAppSelector(listsSelector);
  const dataSourceValue = useAppSelector(
    getCurrentAttributeDataSourceIdSelector
  );
  const isDataSourceConfigInitialized = useAppSelector(
    getDataSourcesConfigInitialized
  );
  const stateAccessToken = useAppSelector(getAccessToken);
  const [value, setValue] = useState<number>(0);
  const [models, setModels] = useState<Model[]>(modelsInput);
  const [attributes, setAttributes] =
    useState<RiskIndicatorType[]>(attributesInput);
  const [lists, setLists] = useState<List[]>(listsInput);
  const [tabDataUse, setTabDataUse] = useState(tabData);
  const [openModelConfig, setOpenModelConfig] = useState<boolean>(false);
  const [openListEdit, setOpenListEdit] = useState<boolean>(false);
  const [openFilterEdit, setOpenFilterEdit] = useState<boolean>(false);
  const [actionId, setActionId] = useState<number | string | null>(0);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    if (!isDataSourceConfigInitialized && stateAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(retrieveDataSources({ accessToken: stateAccessToken }));
    }
  }, [isDataSourceConfigInitialized, dispatch, stateAccessToken]);

  useEffect(() => {
    if (activeTab && dispatch && stateAccessToken) {
      const path = tabData.findIndex((item) => item.url === activeTab);
      const index = path > -1 ? path : 0;
      setValue(index);
      const args = {
        accessToken: stateAccessToken,
        limit: 25,
      };
      const dispatcher = activeTabDispatchers[activeTab];
      dispatcher && dispatcher(dispatch, args);
    }
  }, [activeTab, dispatch, stateAccessToken]);

  useEffect(() => {
    setModels(modelsInput);
    const tabDataCopy = tabData.filter(
      (dataObject) => dataObject.url !== 'model'
    );
    setTabDataUse(tabDataCopy);
  }, [modelsInput]);

  useEffect(() => {
    setAttributes(attributesInput);
    const tabDataCopy = tabData.filter(
      (dataObject) => dataObject.url !== 'risk'
    );
    setTabDataUse(tabDataCopy);
  }, [attributesInput]);

  useEffect(() => {
    setLists(listsInput);
    const tabDataCopy = tabData.filter(
      (dataObject) => dataObject.url !== 'list'
    );
    setTabDataUse(tabDataCopy);
  }, [listsInput]);

  const handleTabChange = (val: string): void => {
    router.push(`/configuration/${val}`).then(noop);
  };

  const handleActionClick = (
    url: string,
    action: string,
    id: string | number
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
      if (action === 'edit') {
        setActionId(id);
        setOpenFilterEdit(true);
      }
    }
    if (url === 'risk') {
      if (id === 'new') {
        router.push(`/configuration/${url}/build`).then(noop);
      } else {
        if (action === 'edit') {
          router.push(`/configuration/${url}/${id}`).then(noop);
        } else if (action === 'delete') {
          setActionId(id);
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
    [url: string]: (id: string, resolver: () => void) => void;
  } = {
    model: (id: string, resolver: () => void) => {
      dispatchStatDelete({
        accessToken: stateAccessToken,
        modelId: id,
        instance: 0,
      }).then(() =>
        dispatchModelDelete({
          accessToken: stateAccessToken,
          modelId: id,
        }).then(resolver)
      );
      return;
    },
    risk: (id: string, resolver: () => void) => {
      dispatchRiskIndicatorDelete({
        accessToken: stateAccessToken,
        attributeId: id,
      }).then(resolver);
      return;
    },
    list: (id: string, resolver: () => void) => {
      dispatchListDelete({
        accessToken: stateAccessToken,
        listId: id,
      }).then(resolver);
      return;
    },
  };

  const deleteFunction = (url: string, id: string | number): void => {
    deleteFunctionByUrl[url](id as string, () => setOpenDeleteModal(false));
  };

  return (
    <DashboardLayout
      title="Model and Scoring Configuration"
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
        sx={{
          position: 'relative',
          zIndex: 10,
          padding: theme.spacing(2, 0),
          [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(2, 0),
          },
        }}
      >
        <UITabWrapper
          onChange={(_, newValue?: number) => setValue(newValue ? newValue : 0)}
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
      </UIContainer>
      <UIContainer
        sx={{ background: '#FFFFFF', position: 'relative', top: '-20px' }}
      >
        {activeTab === 'model' && (
          <UITabPanel key={0} value={value} index={0} dir={theme.direction}>
            <ConfigurationTable
              data={models}
              url={tabData[0].url}
              actions={tabData[0].actions}
              onActionClick={handleActionClick}
            />
          </UITabPanel>
        )}
        {activeTab === 'risk' && (
          <UITabPanel key={1} value={value} index={1} dir={theme.direction}>
            <ConfigurationTable
              data={attributes}
              url={tabData[1].url}
              actions={tabData[1].actions}
              onActionClick={handleActionClick}
            />
          </UITabPanel>
        )}
        {activeTab === 'list' && (
          <UITabPanel key={2} value={value} index={2} dir={theme.direction}>
            <ConfigurationTable
              data={lists}
              url={tabData[2].url}
              actions={tabData[2].actions}
              onActionClick={handleActionClick}
            />
          </UITabPanel>
        )}
        {activeTab === 'filter' &&
          tabDataUse?.map(({ data, url, actions }, index) => (
            <UITabPanel
              key={index + 1}
              value={value}
              index={index + 1}
              dir={theme.direction}
            >
              <ConfigurationTable
                data={data || []}
                url={url}
                actions={actions}
                onActionClick={handleActionClick}
              />
            </UITabPanel>
          ))}
      </UIContainer>
      <ModelsConfigModal
        open={openModelConfig}
        onClose={() => setOpenModelConfig(false)}
      />
      <EditListModal
        open={openListEdit}
        onClose={() => setOpenListEdit(false)}
        id={actionId}
      />
      <EditFilterModal
        open={openFilterEdit}
        onClose={() => setOpenFilterEdit(false)}
        id={actionId}
        dataSourceValue={dataSourceValue}
      />
      {actionId !== null && (
        <DeleteConfirmModal
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          id={actionId}
          typeUrl={activeTab}
          onConfirm={() => deleteFunction(activeTab, actionId)}
        />
      )}
    </DashboardLayout>
  );
};

export default Models;
