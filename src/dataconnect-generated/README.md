# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetSongById*](#getsongbyid)
  - [*ListQuestsForSong*](#listquestsforsong)
- [**Mutations**](#mutations)
  - [*CreateNewUser*](#createnewuser)
  - [*AddSongToUser*](#addsongtouser)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetSongById
You can execute the `GetSongById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getSongById(vars: GetSongByIdVariables): QueryPromise<GetSongByIdData, GetSongByIdVariables>;

interface GetSongByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSongByIdVariables): QueryRef<GetSongByIdData, GetSongByIdVariables>;
}
export const getSongByIdRef: GetSongByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSongById(dc: DataConnect, vars: GetSongByIdVariables): QueryPromise<GetSongByIdData, GetSongByIdVariables>;

interface GetSongByIdRef {
  ...
  (dc: DataConnect, vars: GetSongByIdVariables): QueryRef<GetSongByIdData, GetSongByIdVariables>;
}
export const getSongByIdRef: GetSongByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSongByIdRef:
```typescript
const name = getSongByIdRef.operationName;
console.log(name);
```

### Variables
The `GetSongById` query requires an argument of type `GetSongByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSongByIdVariables {
  songId: UUIDString;
}
```
### Return Type
Recall that executing the `GetSongById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSongByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetSongById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSongById, GetSongByIdVariables } from '@dataconnect/generated';

// The `GetSongById` query requires an argument of type `GetSongByIdVariables`:
const getSongByIdVars: GetSongByIdVariables = {
  songId: ..., 
};

// Call the `getSongById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSongById(getSongByIdVars);
// Variables can be defined inline as well.
const { data } = await getSongById({ songId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSongById(dataConnect, getSongByIdVars);

console.log(data.song);

// Or, you can use the `Promise` API.
getSongById(getSongByIdVars).then((response) => {
  const data = response.data;
  console.log(data.song);
});
```

### Using `GetSongById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSongByIdRef, GetSongByIdVariables } from '@dataconnect/generated';

// The `GetSongById` query requires an argument of type `GetSongByIdVariables`:
const getSongByIdVars: GetSongByIdVariables = {
  songId: ..., 
};

// Call the `getSongByIdRef()` function to get a reference to the query.
const ref = getSongByIdRef(getSongByIdVars);
// Variables can be defined inline as well.
const ref = getSongByIdRef({ songId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSongByIdRef(dataConnect, getSongByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.song);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.song);
});
```

## ListQuestsForSong
You can execute the `ListQuestsForSong` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listQuestsForSong(vars: ListQuestsForSongVariables): QueryPromise<ListQuestsForSongData, ListQuestsForSongVariables>;

interface ListQuestsForSongRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListQuestsForSongVariables): QueryRef<ListQuestsForSongData, ListQuestsForSongVariables>;
}
export const listQuestsForSongRef: ListQuestsForSongRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listQuestsForSong(dc: DataConnect, vars: ListQuestsForSongVariables): QueryPromise<ListQuestsForSongData, ListQuestsForSongVariables>;

interface ListQuestsForSongRef {
  ...
  (dc: DataConnect, vars: ListQuestsForSongVariables): QueryRef<ListQuestsForSongData, ListQuestsForSongVariables>;
}
export const listQuestsForSongRef: ListQuestsForSongRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listQuestsForSongRef:
```typescript
const name = listQuestsForSongRef.operationName;
console.log(name);
```

### Variables
The `ListQuestsForSong` query requires an argument of type `ListQuestsForSongVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListQuestsForSongVariables {
  songId: UUIDString;
}
```
### Return Type
Recall that executing the `ListQuestsForSong` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListQuestsForSongData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListQuestsForSongData {
  quests: ({
    id: UUIDString;
    name: string;
    description: string;
    requiredScore: number;
    rewardDescription?: string | null;
  } & Quest_Key)[];
}
```
### Using `ListQuestsForSong`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listQuestsForSong, ListQuestsForSongVariables } from '@dataconnect/generated';

// The `ListQuestsForSong` query requires an argument of type `ListQuestsForSongVariables`:
const listQuestsForSongVars: ListQuestsForSongVariables = {
  songId: ..., 
};

// Call the `listQuestsForSong()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listQuestsForSong(listQuestsForSongVars);
// Variables can be defined inline as well.
const { data } = await listQuestsForSong({ songId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listQuestsForSong(dataConnect, listQuestsForSongVars);

console.log(data.quests);

// Or, you can use the `Promise` API.
listQuestsForSong(listQuestsForSongVars).then((response) => {
  const data = response.data;
  console.log(data.quests);
});
```

### Using `ListQuestsForSong`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listQuestsForSongRef, ListQuestsForSongVariables } from '@dataconnect/generated';

// The `ListQuestsForSong` query requires an argument of type `ListQuestsForSongVariables`:
const listQuestsForSongVars: ListQuestsForSongVariables = {
  songId: ..., 
};

// Call the `listQuestsForSongRef()` function to get a reference to the query.
const ref = listQuestsForSongRef(listQuestsForSongVars);
// Variables can be defined inline as well.
const ref = listQuestsForSongRef({ songId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listQuestsForSongRef(dataConnect, listQuestsForSongVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.quests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.quests);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewUser
You can execute the `CreateNewUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewUser(vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface CreateNewUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
}
export const createNewUserRef: CreateNewUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewUser(dc: DataConnect, vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface CreateNewUserRef {
  ...
  (dc: DataConnect, vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
}
export const createNewUserRef: CreateNewUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewUserRef:
```typescript
const name = createNewUserRef.operationName;
console.log(name);
```

### Variables
The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewUserVariables {
  username: string;
  email: string;
}
```
### Return Type
Recall that executing the `CreateNewUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewUserData {
  user_insert: User_Key;
}
```
### Using `CreateNewUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewUser, CreateNewUserVariables } from '@dataconnect/generated';

// The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`:
const createNewUserVars: CreateNewUserVariables = {
  username: ..., 
  email: ..., 
};

// Call the `createNewUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewUser(createNewUserVars);
// Variables can be defined inline as well.
const { data } = await createNewUser({ username: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewUser(dataConnect, createNewUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createNewUser(createNewUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateNewUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewUserRef, CreateNewUserVariables } from '@dataconnect/generated';

// The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`:
const createNewUserVars: CreateNewUserVariables = {
  username: ..., 
  email: ..., 
};

// Call the `createNewUserRef()` function to get a reference to the mutation.
const ref = createNewUserRef(createNewUserVars);
// Variables can be defined inline as well.
const ref = createNewUserRef({ username: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewUserRef(dataConnect, createNewUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## AddSongToUser
You can execute the `AddSongToUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addSongToUser(vars: AddSongToUserVariables): MutationPromise<AddSongToUserData, AddSongToUserVariables>;

interface AddSongToUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddSongToUserVariables): MutationRef<AddSongToUserData, AddSongToUserVariables>;
}
export const addSongToUserRef: AddSongToUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addSongToUser(dc: DataConnect, vars: AddSongToUserVariables): MutationPromise<AddSongToUserData, AddSongToUserVariables>;

interface AddSongToUserRef {
  ...
  (dc: DataConnect, vars: AddSongToUserVariables): MutationRef<AddSongToUserData, AddSongToUserVariables>;
}
export const addSongToUserRef: AddSongToUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addSongToUserRef:
```typescript
const name = addSongToUserRef.operationName;
console.log(name);
```

### Variables
The `AddSongToUser` mutation requires an argument of type `AddSongToUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddSongToUserVariables {
  userId: UUIDString;
  songId: UUIDString;
}
```
### Return Type
Recall that executing the `AddSongToUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddSongToUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddSongToUserData {
  userSong_insert: UserSong_Key;
}
```
### Using `AddSongToUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addSongToUser, AddSongToUserVariables } from '@dataconnect/generated';

// The `AddSongToUser` mutation requires an argument of type `AddSongToUserVariables`:
const addSongToUserVars: AddSongToUserVariables = {
  userId: ..., 
  songId: ..., 
};

// Call the `addSongToUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addSongToUser(addSongToUserVars);
// Variables can be defined inline as well.
const { data } = await addSongToUser({ userId: ..., songId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addSongToUser(dataConnect, addSongToUserVars);

console.log(data.userSong_insert);

// Or, you can use the `Promise` API.
addSongToUser(addSongToUserVars).then((response) => {
  const data = response.data;
  console.log(data.userSong_insert);
});
```

### Using `AddSongToUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addSongToUserRef, AddSongToUserVariables } from '@dataconnect/generated';

// The `AddSongToUser` mutation requires an argument of type `AddSongToUserVariables`:
const addSongToUserVars: AddSongToUserVariables = {
  userId: ..., 
  songId: ..., 
};

// Call the `addSongToUserRef()` function to get a reference to the mutation.
const ref = addSongToUserRef(addSongToUserVars);
// Variables can be defined inline as well.
const ref = addSongToUserRef({ userId: ..., songId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addSongToUserRef(dataConnect, addSongToUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userSong_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userSong_insert);
});
```

