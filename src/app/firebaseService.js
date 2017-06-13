// The firebase specific requests are defined, and will be exported to the async action
// creator file.
import firebaseApp from './firebaseApp';

const firebaseAuth = firebaseApp.auth();
const firebaseDatabase = firebaseApp.database();

/**
 * Check whether there is a signed-in user
 *
 * @return {boolean.true} if user is signed-in
 */
export const isUserSignedIn = () => firebaseAuth.currentUser != null;

/**
 * Return the current signed-in user after sign in or sign up
 *
 * @return {firebase.User}
 */
export const getCurrentSignInUser = () => firebaseAuth.currentUser;

/**
 * Create a new Insturant owner account using email and password
 *
 * @param credentials contains an email address and a password
 * @returns {firebase.User}
 */
export const signUpWithEmailAndPassword = credentials =>
firebaseAuth.createUserWithEmailAndPassword(credentials.email, credentials.password);

/**
 * Add an owner object to the Realtime Database
 *
 * @param ownerId is the uid of the owner of type of {firebase.User}
 * @return {firebase.Promise} containing void
 */
export const firebaseAddOwner = ownerId => firebaseDatabase.ref(`owners/${ownerId}`).set({ id: ownerId });

/**
 * Sign in an Insturant owner using email and password
 *
 * @param credentials contains an email address and a password
 * @returns {firebase.User}
 */
export const signInWithEmailAndPassword = credentials =>
firebaseAuth.signInWithEmailAndPassword(credentials.email, credentials.password);

/**
 * Sign in an Insturant owner using email and password
 *
 * @param email is the email address with the password to be reset
 * @return {firebase.Promise} containing void
 */
export const sendPasswordResetEmail = email => firebaseAuth.sendPasswordResetEmail(email);

/**
 * Sign out the current Instaurant owner
 *
 * @return {firebase.Promise} containing void
 */
export const signOut = () => firebaseAuth.signOut();

/**
 * Fetech a list of ordered categories given the uid
 *
 * @param uid is the owner id
 * @return {firebase.Promise} containing the list of categories
 */
export const firebaseFetchCategories = uid => (
    firebaseDatabase.ref(`categories/${uid}`).orderByChild('order').once('value')
);
