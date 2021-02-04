import { useLocalStorage } from 'react-use-storage';
import { isEmpty } from 'lodash';


/**
 * A custom hook that builds on useLocalStorage to retrieve, parse and save
 * the currently logged in user from local storage
 */

/**
 * User type definition
 * @typedef {Object} User
 * @property {string} id - The user's id
 * @property {string} fullname - The user's fullname
 * @property {string} email - The user's email address
 */

/**
 * Save or retrieve the user from localStorage.
 * 
 * @property {User} user - the user details if authenticated or empty object if not.
 * @property {boolean} isAuthenticated - whether or not the user is authenticated or is set.
 * @property {function} setUser - set the user details object on localStorage.
 * @property {function} removeUser - remove or delete the user details object from the localStorage.
 */
const useUser = () => {
    const [user, setUser, removeUser] = useLocalStorage("user", {});

    const isAuthenticated = !isEmpty(user);
    return {
        user,
        isAuthenticated, 
        setUser, 
        removeUser
    };
};

export default useUser;