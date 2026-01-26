import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'music-quest',
  location: 'us-east4'
};

export const createNewUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewUser', inputVars);
}
createNewUserRef.operationName = 'CreateNewUser';

export function createNewUser(dcOrVars, vars) {
  return executeMutation(createNewUserRef(dcOrVars, vars));
}

export const getSongByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSongById', inputVars);
}
getSongByIdRef.operationName = 'GetSongById';

export function getSongById(dcOrVars, vars) {
  return executeQuery(getSongByIdRef(dcOrVars, vars));
}

export const addSongToUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddSongToUser', inputVars);
}
addSongToUserRef.operationName = 'AddSongToUser';

export function addSongToUser(dcOrVars, vars) {
  return executeMutation(addSongToUserRef(dcOrVars, vars));
}

export const listQuestsForSongRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListQuestsForSong', inputVars);
}
listQuestsForSongRef.operationName = 'ListQuestsForSong';

export function listQuestsForSong(dcOrVars, vars) {
  return executeQuery(listQuestsForSongRef(dcOrVars, vars));
}

