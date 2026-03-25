import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyC90_UyDoBIsUV6y6kpnyaIUCHHyl0LLas",
  authDomain: "okc-super-cal.firebaseapp.com",
  databaseURL: "https://okc-super-cal-default-rtdb.firebaseio.com",
  projectId: "okc-super-cal",
  storageBucket: "okc-super-cal.firebasestorage.app",
  messagingSenderId: "484568696588",
  appId: "1:484568696588:web:e26ebaf879df4462436b29"
};

firebase.initializeApp(firebaseConfig);

export const votesDB = firebase.database().ref("votes");

/**
 * Get the vote count for an event
 * @param {string} key - vote key
 */
export async function getVoteCount(key) {
  const snapshot = await votesDB.child(key).get();
  return snapshot.val() || 0;
}

/**
 * Add a vote (increment by 1)
 * @param {string} key - vote key
 */
export async function addVote(key) {
  return votesDB.child(key).transaction((current) => {
    return (current || 0) + 1;
  });
}

/**
 * Remove a vote (decrement by 1, min 0)
 * @param {string} key - vote key
 */
export async function removeVote(key) {
  return votesDB.child(key).transaction((current) => {
    const val = current || 0;
    return val > 0 ? val - 1 : 0;
  });
}
