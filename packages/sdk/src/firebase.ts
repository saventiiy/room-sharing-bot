import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: 'AIzaSyCuhml_Cs8XWaDMObMzP5SO9w5w_vK7kDY',
  authDomain: 'roomsharebot.firebaseapp.com',
  projectId: 'roomsharebot',
  storageBucket: 'roomsharebot.appspot.com',
  messagingSenderId: '947632411487',
  appId: '1:947632411487:web:6db78c14e32aff99555cea',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
const appCheck = initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider('6LdLhn4pAAAAAJypgSDZLT849-JLwMpCqe34QB8F'),
  isTokenAutoRefreshEnabled: true
});
