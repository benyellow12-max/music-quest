const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'music-quest',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createNewUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewUser', inputVars);
}
createNewUserRef.operationName = 'CreateNewUser';
exports.createNewUserRef = createNewUserRef;

exports.createNewUser = function createNewUser(dcOrVars, vars) {
  return executeMutation(createNewUserRef(dcOrVars, vars));
};

const getSongByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSongById', inputVars);
}
getSongByIdRef.operationName = 'GetSongById';
exports.getSongByIdRef = getSongByIdRef;

exports.getSongById = function getSongById(dcOrVars, vars) {
  return executeQuery(getSongByIdRef(dcOrVars, vars));
};

const addSongToUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddSongToUser', inputVars);
}
addSongToUserRef.operationName = 'AddSongToUser';
exports.addSongToUserRef = addSongToUserRef;

exports.addSongToUser = function addSongToUser(dcOrVars, vars) {
  return executeMutation(addSongToUserRef(dcOrVars, vars));
};

const listQuestsForSongRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListQuestsForSong', inputVars);
}
listQuestsForSongRef.operationName = 'ListQuestsForSong';
exports.listQuestsForSongRef = listQuestsForSongRef;

exports.listQuestsForSong = function listQuestsForSong(dcOrVars, vars) {
  return executeQuery(listQuestsForSongRef(dcOrVars, vars));
};
