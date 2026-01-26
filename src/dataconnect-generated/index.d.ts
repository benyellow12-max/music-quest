import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddSongToUserData {
  userSong_insert: UserSong_Key;
}

export interface AddSongToUserVariables {
  userId: UUIDString;
  songId: UUIDString;
}

export interface CreateNewUserData {
  user_insert: User_Key;
}

export interface CreateNewUserVariables {
  username: string;
  email: string;
}

export interface GetSongByIdData {
  song?: {
    id: UUIDString;
    title: string;
    artist: string;
    genre: string;
    duration?: number | null;
    imageUrl?: string | null;
    songUrl: string;
  } & Song_Key;
}

export interface GetSongByIdVariables {
  songId: UUIDString;
}

export interface ListQuestsForSongData {
  quests: ({
    id: UUIDString;
    name: string;
    description: string;
    requiredScore: number;
    rewardDescription?: string | null;
  } & Quest_Key)[];
}

export interface ListQuestsForSongVariables {
  songId: UUIDString;
}

export interface Quest_Key {
  id: UUIDString;
  __typename?: 'Quest_Key';
}

export interface Song_Key {
  id: UUIDString;
  __typename?: 'Song_Key';
}

export interface UserQuest_Key {
  userId: UUIDString;
  questId: UUIDString;
  __typename?: 'UserQuest_Key';
}

export interface UserSong_Key {
  userId: UUIDString;
  songId: UUIDString;
  __typename?: 'UserSong_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateNewUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
  operationName: string;
}
export const createNewUserRef: CreateNewUserRef;

export function createNewUser(vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;
export function createNewUser(dc: DataConnect, vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface GetSongByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSongByIdVariables): QueryRef<GetSongByIdData, GetSongByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSongByIdVariables): QueryRef<GetSongByIdData, GetSongByIdVariables>;
  operationName: string;
}
export const getSongByIdRef: GetSongByIdRef;

export function getSongById(vars: GetSongByIdVariables): QueryPromise<GetSongByIdData, GetSongByIdVariables>;
export function getSongById(dc: DataConnect, vars: GetSongByIdVariables): QueryPromise<GetSongByIdData, GetSongByIdVariables>;

interface AddSongToUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddSongToUserVariables): MutationRef<AddSongToUserData, AddSongToUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddSongToUserVariables): MutationRef<AddSongToUserData, AddSongToUserVariables>;
  operationName: string;
}
export const addSongToUserRef: AddSongToUserRef;

export function addSongToUser(vars: AddSongToUserVariables): MutationPromise<AddSongToUserData, AddSongToUserVariables>;
export function addSongToUser(dc: DataConnect, vars: AddSongToUserVariables): MutationPromise<AddSongToUserData, AddSongToUserVariables>;

interface ListQuestsForSongRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListQuestsForSongVariables): QueryRef<ListQuestsForSongData, ListQuestsForSongVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListQuestsForSongVariables): QueryRef<ListQuestsForSongData, ListQuestsForSongVariables>;
  operationName: string;
}
export const listQuestsForSongRef: ListQuestsForSongRef;

export function listQuestsForSong(vars: ListQuestsForSongVariables): QueryPromise<ListQuestsForSongData, ListQuestsForSongVariables>;
export function listQuestsForSong(dc: DataConnect, vars: ListQuestsForSongVariables): QueryPromise<ListQuestsForSongData, ListQuestsForSongVariables>;

