import axios from "axios";
const API_URL = 'http://localhost:3000/';

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + 'users/login', {
                username,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            })
    }
}

export default new AuthService();