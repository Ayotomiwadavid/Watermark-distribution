import axios from 'axios';

class UserService {
    constructor() {
        this.userDetails = null;
    }

    async getUserDetails() {
        if (this.userDetails) {
            return this.userDetails;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error("No access token found");
        }

        try {
            const response = await axios.get(
                'https://watermark-distribution.onrender.com/api/user/details',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            this.userDetails = response.data.userDetails;
            return this.userDetails;
        } catch (error) {
            console.error("Error fetching user details:", error);
            throw error;
        }
    }
}

// Export an instance of UserService
const userService = new UserService();
export default userService;