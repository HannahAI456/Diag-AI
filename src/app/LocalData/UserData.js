export default class UserData {
    constructor() {}

    static _currentUser = null;

    static getCurrentUser() {
        return UserData._currentUser;
    }

    static setCurrentUser(user) {
        UserData._currentUser = user;
    }
}