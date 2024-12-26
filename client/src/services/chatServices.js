import { auth, firestore as db, storage } from "../config/firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  arrayUnion,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
  where,
  query,
  orderBy,
  limit 
} from "firebase/firestore";

// create user
export const createUserAsync = async (creds) => {
  try {
    const user = {
      username: creds.username,
      email: creds.email,
      createdAt: serverTimestamp(),
    };
    return await setDoc(doc(db, "users", creds.uid), user);
  } catch (error) {
    console.log(error);
  }
};

// delete user
export const deleteUserAsync = async (id) => {
  try {
    const userDoc = doc(db, "users", id);
    const res = await deleteDoc(userDoc);
    return res;
  } catch (error) {
    console.log(error);
  }
};

// delete conversation
export const deleteConversationAsync = async (convId) => {
  try {
    const userDoc = doc(db, "conversations", convId)
    const res = await deleteDoc(userDoc);
    return res;
  } catch (error) {
    console.log(error);
  }
}

// get all users
export const getUsersAsync = async (user) => {
  if (!user) return;
  try {
    const snapshots = await getDocs(
      query(collection(db, "users"), where("email", "!=", user.email))
    );
    const users = snapshots.docs.map((item) => getSnapshotData(item));
    return users;
  } catch (error) {
    console.log(error);
  }
};

// get user
export const getUserAsync = async (id) => {
  try {
    const userDoc = doc(db, "users", id);
    const snapshot = await getDoc(userDoc);
    return getSnapshotData(snapshot);
  } catch (error) {
    console.log(error);
  }
};

// conversations (need to modify)
export const createConversationAsync = async (userId, language, difficulty, location) => {
  try {
    const conv = {
      uid: userId,
      language: language,
      difficulty: difficulty,
      location: location,
      last: { message: "", createdAt: null },
      createdAt: serverTimestamp(),
    };
    const convDoc = await addDoc(collection(db, "conversations"), conv);
    let result = null;
    const convId = convDoc.id;  
    if (convId) {
      const res_conv = await getDoc(convDoc);
      if (res_conv) {
        result = {
          ...res_conv.data(),
          id: convId,
        };
      }
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};

// Messages
export const createMessageAsync = async (message) => {
  console.log("message", message);

  try {
    const newMessage = {
      ...message,
      createdAt: serverTimestamp(),
    };

    const msgDoc = await addDoc(collection(db, "messages"), newMessage);
    const messageId = msgDoc.id;
    if (messageId) {
      const msg_res = await getDoc(msgDoc);
      const msg = getSnapshotData(msg_res);
      console.log("convId", msg.conversationId);
      // update conversation last message
      const convDoc = doc(db, "conversations", msg.conversationId);
      console.log("msg.message", msg.message);
      await updateDoc(convDoc, {
        last: { message: msg.message, createdAt: msg.createdAt },
      });
      return msg;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getMsgQueryByConversationId = (convId) => {
  return query(
    collection(db, "messages"),
    where("conversationId", "==", convId),
  );
};

export const getContextByConversationId = (convId) => {
  return query(
    collection(db, "messages"),
    where("conversationId", "==", convId),
    orderBy("createdAt", "desc"), // Order messages by createdAt field in descending order
    limit(10) // Limit the results to the last 10 messages
  );
};

export const getConversationsQueryByUser = (userId) => {
  return query(
    collection(db, "conversations"),
    where("uid", "==", userId)
  );
};

// helper functions
export const getSnapshotData = (snapshot) => {
  if (!snapshot.exists) return undefined;
  const data = snapshot.data();
  return { ...data, id: snapshot.id };
};