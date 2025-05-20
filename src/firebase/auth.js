import { 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendEmailVerification,
    signInWithEmailAndPassword,
    updatePassword,
    signInWithPopup // Added this import, likely needed for Google Auth
} from "firebase/auth";
import { auth } from "./firebase.config.js"; // Added .js extension to align with previous troubleshooting

/**
 * Creates a new user with an email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>} A Promise that resolves with the user's credential object.
 */
export const doCreateUserWithEmailAndPassword = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Signs in an existing user with their email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>} A Promise that resolves with the user's credential object.
 */
export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Signs in a user with their Google account.
 * @returns {Promise<UserCredential>} A Promise that resolves with the user's credential object.
 */
export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result;
    } catch (error) {
        console.error("Google Sign-In Error:", error); // Added error logging
        throw error; // Re-throw the error to be handled by the caller
    }
};

/**
 * Signs out the current user.
 * @returns {Promise<void>} A Promise that resolves when the user is signed out.
 */
export const doSignOut = () => {
    return auth.signOut();
};

/**
 * Sends a password reset email to the given email address.
 * @param {string} email - The email address to send the reset email to.
 * @returns {Promise<void>}
 */
// export const doPasswordReset = (email) => {
//  return sendPasswordResetEmail(auth, email);
// };

/**
 * Updates the current user's password.
 * @param {string} password - The new password.
 * @returns {Promise<void>}
 */
// export const doPasswordChange = (password) => {
//  return updatePassword(auth.currentUser, password);
// };

/**
 * Sends an email verification email to the current user.
 * @returns {Promise<void>}
 */
// export const doSendEmailVerification = () => {
//  return sendEmailVerification(auth.currentUser, {
//
//  });
// };
