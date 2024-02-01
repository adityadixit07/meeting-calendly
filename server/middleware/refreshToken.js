async function verifyTokenExpiration(req, res, next) {
    try {
        const user = await User.findById(req.user._id)
        if (!user.refresh_token) return res.status(400).json({ success: false, message: "Login with google" })
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?refresh_token=${user.refresh_token}`);

        if (response.status === 200) {
            const tokenInfo = response.data;

            // Extract the expiration time from the token info response
            const expirationTime = tokenInfo.exp;
            console.log(expirationTime);
            // Compare the expiration time with the current time
            const currentTime = Math.floor(Date.now() / 1000); // Convert current time to seconds

            if (currentTime >= expirationTime) {
                // The refresh token is expired
                return true;
            } else {
                // The refresh token is still valid
                return false;
            }
        } else {
            // Handle the response error case
            console.error('Token info request failed:', response.statusText);
            return false;
        }
    } catch (error) {
        // Handle the request error case
        console.error('Token info request failed:', error.message);
        return false;
    }
}



verifyTokenExpiration()
    .then((isExpired) => {
        if (isExpired) {
            console.log('Refresh token is expired');
        } else {
            console.log('Refresh token is still valid');
        }
    })
    .catch((error) => {
        console.error('Error occurred:', error);
    });