import { CreateNewUserData, CreateNewUserVariables, GetSongByIdData, GetSongByIdVariables, AddSongToUserData, AddSongToUserVariables, ListQuestsForSongData, ListQuestsForSongVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewUser(options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, CreateNewUserVariables>): UseDataConnectMutationResult<CreateNewUserData, CreateNewUserVariables>;
export function useCreateNewUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, CreateNewUserVariables>): UseDataConnectMutationResult<CreateNewUserData, CreateNewUserVariables>;

export function useGetSongById(vars: GetSongByIdVariables, options?: useDataConnectQueryOptions<GetSongByIdData>): UseDataConnectQueryResult<GetSongByIdData, GetSongByIdVariables>;
export function useGetSongById(dc: DataConnect, vars: GetSongByIdVariables, options?: useDataConnectQueryOptions<GetSongByIdData>): UseDataConnectQueryResult<GetSongByIdData, GetSongByIdVariables>;

export function useAddSongToUser(options?: useDataConnectMutationOptions<AddSongToUserData, FirebaseError, AddSongToUserVariables>): UseDataConnectMutationResult<AddSongToUserData, AddSongToUserVariables>;
export function useAddSongToUser(dc: DataConnect, options?: useDataConnectMutationOptions<AddSongToUserData, FirebaseError, AddSongToUserVariables>): UseDataConnectMutationResult<AddSongToUserData, AddSongToUserVariables>;

export function useListQuestsForSong(vars: ListQuestsForSongVariables, options?: useDataConnectQueryOptions<ListQuestsForSongData>): UseDataConnectQueryResult<ListQuestsForSongData, ListQuestsForSongVariables>;
export function useListQuestsForSong(dc: DataConnect, vars: ListQuestsForSongVariables, options?: useDataConnectQueryOptions<ListQuestsForSongData>): UseDataConnectQueryResult<ListQuestsForSongData, ListQuestsForSongVariables>;
