import {db, doc, updateDoc} from "../firabase/firebase.js";
import {getDoc} from "firebase/firestore";

export const deleteTask = async (taskId, userId) => {
  
  const userDoc = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDoc);
  let updatedUserObject = {}
  
  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const tasks = userData.tasks.filter((item) => item.id !== taskId)
    
    updatedUserObject = {
      ...userData,
      tasks
    };
    
    await updateDoc(userDoc, updatedUserObject);
  }
  
  return updatedUserObject
}

export const editTask = async (taskId, userId, title, description) => {
  
  const userDoc = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDoc);
  let updatedUserObject = {};
  
  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const tasks = userData.tasks.map((task) =>
        task.id === taskId ? { ...task, title: title, description: description } : task
    );
    
    updatedUserObject = {
      ...userData,
      tasks,
    };
    
    await updateDoc(userDoc, updatedUserObject);
  }
  
  return updatedUserObject;
}

export const updateStatus = async (taskId, userId) => {
  const userDoc = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDoc);
  let updatedUserObject = {};
  
  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const tasks = userData.tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    
    updatedUserObject = {
      ...userData,
      tasks,
    };
    
    await updateDoc(userDoc, updatedUserObject);
  }
  
  return updatedUserObject;
};