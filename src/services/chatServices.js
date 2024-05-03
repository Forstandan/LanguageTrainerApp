import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
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
    console.log(userId);
    const conv = {
      uid: userId,
      language: language,
      difficulty: difficulty,
      location: location,
      last: { message: "", createdAt: null },
      createdAt: serverTimestamp(),
    };
    console.log("conversation", conv);
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

export const createMessageAsync = async (message, images) => {
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
      // update conversation last message
      const convDoc = doc(db, "conversations", msg.conversationId);
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

export const getConversationsQueryByUser = (userId) => {
  return query(
    collection(db, "conversations"),
    where("uid", "==", userId)
  );
};

// helper functions

const uploadFiles = async (files, location) => {
  let filesUrls = [];
  for (const item of files) {
    const storageRef = ref(storage, `${location}${item.filename}`);
    const uploadTask = await uploadBytes(storageRef, item.file);
    const downloadURL = await getDownloadURL(uploadTask.ref);

    filesUrls.push({
      origin: item.origin,
      filename: item.filename,
      url: downloadURL,
    });
  }
  return filesUrls;
};

export const getSnapshotData = (snapshot) => {
  if (!snapshot.exists) return undefined;
  const data = snapshot.data();
  return { ...data, id: snapshot.id };
};