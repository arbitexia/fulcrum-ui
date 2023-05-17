/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
export {
  default as appReducer,
  appSelector,
  toggleThemeMode,
  setUILoading,
} from './app.slice';

// TODO - Promise the prefix rules of the api calls.
export {
  default as userReducer,
  userSelector,
  retrieveUsers,
  getAccessToken,
  setStateAccessToken,
  clearStateAccessToken,
} from './user.slice';

export {
  default as scoresReducer,
  entityScoringSelector,
  barChartLabelsSelector,
  categoriesSelector,
  barChartDataSelector,
  retrieveScores,
  retrieveScoresCount,
  isScoringInitializedSelector,
  basisReportSelector,
  isScoringReportInitializedSelector,
  retrieveBasis,
  retrieveBasisCount,
  scoringPageInfoSelector,
  changeLimit,
  changePageNumber,
  changeDataSourceId,
  getCurrentPageInfoByPageNumber,
  getAllCursorsByPageNumber,
  isScoringStatusPending,
  isScoringStatusFailed,
  isScoringStatusSuccess,
} from './scoring.slice';

export {
  default as modelsReducer,
  retrieveModels,
  retrieveModel,
  saveModel,
  modelsSelector,
  modelByIdSelector,
  modelNameByIdSelctor,
  modelIdsToNamesSelector,
  getModelListSelector,
  isModelsInitialized,
  modelAttributeIdsSelector,
  modelAttributesByIdSelector,
  modelAttributesSelector,
  newModelAttributesSelector,
  modelCategoriesByIdSelector,
  newModelCategoriesSelector,
  addNewModel,
  modelValueChangeHandler,
  setSelectedModelId,
  newModelRiskIndicatorTypesSelector,
  newModelSelector,
  newRiskIndicatorModelListById,
  newRiskIndicatorModelList,
  selectInitialAttribute,
  getSelectedModelId,
  modelsTreeSelector,
  modelTreeByIdSelector,
  modelFullAttributesSelector,
  deleteModel,
} from './model.slice';

export {
  default as attributesReducer,
  retrieveAttributes,
  retrieveAttribute,
  saveAttribute,
  attributesSelector,
  newAttributeSelector,
  attributeByIdSelector,
  attributeNameByIdSelector,
  riskValueChangeHandler,
  riskValueClickHandler,
  addNewRiskIndicator,
  getIsAttributesInitialized,
  getCurrentAttributeIdSelector,
  getAttributeDataSourceIdSelector,
  getCurrentAttributeDataSourceIdSelector,
  deleteAttribute,
} from './attributes.slice';

export {
  default as entitiesReducer,
  getEntities,
  getEntity,
  queryEntities,
  getEntitiesSelector,
  entitiesByIdSelector,
  entityByIdSelector,
  entityPropertiesByIdSelector,
  convertEntityPropertiesToDashBoardTable,
  convertEntitiesPropertiesToDashBoardTable,
  getEntityComments,
  getIsEntitiesInitialized,
  getCommentsForEntityId,
  getIsCommentsInitialized,
  getStatusForEntityId,
  getIsEntityStatusInitialized,
  isEntityStatusPending,
  isEntityStatusSuccess,
  isEntityStatusFailed,
} from './entity.slice';

export {
  default as statsReducer,
  getStats,
  getLatestStat,
  getStatsSelector,
  getStatsByModelIdSelector,
  getSelectedStats,
  statByModelIdSelector,
  statsToStatusCards,
  getStatsInitialized,
  deleteStats,
  isStatsStatusPending,
  isStatsStatusSuccess,
  isStatsStatusFailed,
} from './stat.slice';

export {
  default as configReducer,
  retrieveDataSources,
  getDataSourcesSelect,
  getDataSourcesFields,
  getDataSourcesConfigInitialized,
  getEntitiesConfigInitialized,
  getEntityProperties,
  getEntityDetailProperties,
  geEntityStatusValues,
} from './config.slice';

export {
  default as controlReducer,
  ingestData,
  replayData,
  resetModels,
  refreshModels,
  scoreModels,
} from './control.slice';

export {
  default as listsReducer,
  retrieveLists,
  retrieveList,
  newList,
  getListsInitialized,
  listsSelector,
  getNewList,
  getSelectedListById,
  getSelectedListNameById,
  addNewList,
  listValueChanger,
  setSelectedListId,
  getSelectedListId,
  getListIds,
  deleteList,
} from './list.slice';

export {
  default as graphReducer,
  retrieveGraphData,
  retrievePeerData,
  getGraphDataSelector,
  getPeerDataSelector,
  peerChartDataSelector,
  graphChartDataSelector,
} from './graph.slice';

export {
  default as externalReducer,
  retrieveExternalData,
  getExternalDataSelector,
  saveExternalData,
} from './external.slice';
