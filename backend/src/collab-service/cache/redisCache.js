import redisClient from "../config/redis.js";

//set the expired timer to 1 hour for inactivity
const TTL_IN_SECONDS = 3600;
const ACTIVE_SESSIONS_KEY = "activeCollabSessions";
const getDataKey = (collabId) => `collabData:${collabId}`;
const getUsersKey = (collabId) => `collabUser:${collabId}:users`;
const getSocketKey = (socketId) => `socket:${socketId}`;


const addSessionToSet = async (collabId) => {
  await redisClient.sAdd(ACTIVE_SESSIONS_KEY, collabId);
}

const removeSessionFromSet = async (collabId) => {
  await redisClient.sRem(ACTIVE_SESSIONS_KEY, collabId);
}

const getAllActiveSessionIds = async () => {
  return await redisClient.sMembers(ACTIVE_SESSIONS_KEY);
}


//set editor/session data
const setSessionData = async(collabId, data = '') => {
  await redisClient.hSet(getDataKey(collabId) , 'data', data);
  await redisClient.expire(getDataKey(collabId), TTL_IN_SECONDS);
}

//get editor/session data
const getSessionData = async(collabId) => { 
  const dataKey = getDataKey(collabId);
  const data = await redisClient.hGet(dataKey, 'data');
  return data || '';
}

const delSessionData = async(collabId) => {
  await redisClient.del(getDataKey(collabId));
}

const getCollabUsers = async (collabId) => {
  const usersKey = getUsersKey(collabId);
  return await redisClient.hGetAll(usersKey);
}

//this return both data and users
const getSession = async (collabId) => {
  const data = await getSessionData(collabId);
  const users = await getCollabUsers(collabId);
  if (data === '' && Object.keys(users).length === 0) {
    return null;
  }
  return { data, users };
}

//check if session exist
const hasSession = async (collabId) => {
  return (await redisClient.exists(getDataKey(collabId))) === 1;
};


//this delete entire session, need to make sure that both user have exit
const deleteSession = async (collabId) => {
  await redisClient.del(getDataKey(collabId));
  await redisClient.del(getUsersKey(collabId));
};

const addUserToSession =  async (collabId, userId, socketId) => {
  await redisClient.hSet(getUsersKey(collabId), socketId, userId);
  await redisClient.set(getSocketKey(socketId), collabId);
}

const removeUserFromSession = async (collabId, socketId) => {
  await redisClient.hDel(getUsersKey(collabId), socketId);
  const mapping = await redisClient.get(getSocketKey(socketId));
  if (mapping === collabId) {
    await redisClient.del(getSocketKey(socketId));
  }
}

//in the event that they only provide socketId, such as during disconnect
const removeUserBySocketId = async (socketId) => {
  const collabId = await getCollabIdBySocketId(socketId);
  if (collabId) {
    await removeUserFromSession(collabId, socketId);
  }
}

const getUserBySocketId = async (collabId, socketId) => { 
  return await redisClient.hGet(getUsersKey(collabId), socketId);
}

const getCollabIdBySocketId = async (socketId) => {
  return await redisClient.get(getSocketKey(socketId));
}

export { getSession, hasSession, deleteSession, 
    addUserToSession, removeUserFromSession, removeUserBySocketId, 
    getUserBySocketId, setSessionData, getCollabIdBySocketId, getSessionData,
    addSessionToSet, removeSessionFromSet, getAllActiveSessionIds, getCollabUsers,
    delSessionData };