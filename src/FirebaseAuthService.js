// eslint-disable-next-line
import app from "./FirebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, signInWithPopup, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth"

const auth = getAuth(app);

const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
}

const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

const logout = () => {
    return signOut(auth);
}

const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
}

const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider);
}

const subscribeToAuthChanges = (handleAuthChange) => {
    onAuthStateChanged(auth, (user) => {
        handleAuthChange(user);
    })
}

const FirebaseAuthService = {
    registerUser,
    loginUser,
    logout,
    resetPassword,
    loginWithGoogle,
    subscribeToAuthChanges,
}

export default FirebaseAuthService;