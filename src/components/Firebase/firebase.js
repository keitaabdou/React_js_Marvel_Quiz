import app from 'firebase/app';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyA0mL7hvqArkS9Hj7Hf07RFW-4D_u58PSA",
    authDomain: "marvel-quiz-84d44.firebaseapp.com",
    projectId: "marvel-quiz-84d44",
    storageBucket: "marvel-quiz-84d44.appspot.com",
    messagingSenderId: "462962341100",
    appId: "1:462962341100:web:f9f924d5a06c57590861c9"
  };


class Firebase {
    constructor(){
        app.initializeApp(config);
        this.auth = app.auth();
    }

    //inscription
    signupUser = (email, password) => 
    this.auth.createUserWithEmailAndPassword(email, password);

    //connexion
    loginUser = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

    //déconnexion
    signoutUser = () => this.auth.signOut();

    //Récupérer le mot de passe
    passwordReset = email => this.auth.sendPasswordResetEmail(email);
}

export default Firebase