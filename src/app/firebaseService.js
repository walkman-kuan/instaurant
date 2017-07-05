// The firebase specific requests are defined, and will be exported to the async action
// creator file.
import firebaseApp from './firebaseApp';

const firebaseAuth = firebaseApp.auth();
const firebaseDatabase = firebaseApp.database();
const fireaseStorage = firebaseApp.storage();

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
 * Fetech a list of ordered categories given the ownerId
 *
 * @param ownerId is the owner id
 * @return {firebase.Promise} containing the list of categories
 */
export const firebaseFetchCategories = ownerId => (
    firebaseDatabase.ref(`categories/${ownerId}`).orderByChild('order').once('value')
);

/**
 * Add a category given the ownerId, name, and order
 *
 * @param ownerId is the owner id
 * @param name is the category name
 * @param order is the caegory order within the existing category list
 * @return {firebase.Promise} containing the new category
 */
export const firebaseAddCategory = (ownerId, name, order) => {
    // Generates a new category location using a unique key and returns its Reference
    const newCategoryRef = firebaseDatabase.ref(`categories/${ownerId}`).push();
    // Update the empty location with a concrete category object
    newCategoryRef.update({
        id: newCategoryRef.key,
        name,
        order,
    });

    return newCategoryRef.once('value');
};

/**
 * Update the name of a category given the new name, its id and the owner id
 *
 * @param ownerId is the owner id
 * @param categoryId is id of the category
 * @param newName is the new category name
 * @return {firebase.Promise} containing the category who name is updated
 */
export const firebaseUpdateCategory = (ownerId, categoryId, newName) => {
    const categoryRef = firebaseDatabase.ref(`categories/${ownerId}/${categoryId}`);
    categoryRef.update({ name: newName });

    return categoryRef.once('value');
};


/**
 * Delete a category and update the orders of all categories that follow it
 *
 * @param ownerId is the owner id
 * @param affectedCategories is a list of categories that are affected by deleting a category
 * @return {firebase.Promise} containing void
 */
export const firebaseDeleteCategory = (ownerId, affectedCategories) => (
    firebaseDatabase.ref(`categories/${ownerId}`).update(affectedCategories)
);

/**
 * Fetech a list of ordered dishes given the category id
 *
 * @param configuredCategoryId is the categry id
 * @return {firebase.Promise} containing the list of dishes
 */
export const firebaseFetchDishes = configuredCategoryId => (
    firebaseDatabase.ref(`dishes/${configuredCategoryId}`).orderByChild('order').once('value')
);

/**
 * Add a dish given the categoryId, name, description, price, file, and order
 *
 * @param categoryId is the id of the associated category of the dish
 * @param name is the dish name
 * @param description is the dish description
 * @param price is the dish price
 * @param file is the dish image to be uploaded
 * @param order is the dish order within the existing dish list
 * @return {Promise} containing the new dish
 */
export const firebaseAddDish = (categoryId, name, description, price, file, order) => {
    // Generates a new dish location (Realtime Database) using a unique key and returns its Reference
    const newDishRef = firebaseDatabase.ref(`dishes/${categoryId}`).push();

    // Return a Promise so that we can consume the data
    return new Promise((resolve, reject) => {
        const id = newDishRef.key;
        // Upload the image to the Storage bucket at the specified location, and return
        // an uploadTask object that can be used to monitor and manage the upload
        const uploadTask = fireaseStorage.ref(`dishes/${id}/${file.name}`).put(file, { contentType: file.type });

        uploadTask.on('state_changed', null, (error) => {
            reject(error.code);
        }, () => {
            // Handle successful uploads on complete
            const dish = {
                id,
                name,
                description,
                price,
                imageUrl: uploadTask.snapshot.downloadURL,
                order,
            };
            // Update the empty location with a concrete dish object
            newDishRef.update(dish);
            resolve(dish);
        });
    });
};
