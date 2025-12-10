//login API updated to check a running session before logging in new user.

authRouter.post("/login", async (req, res) => {
    try {
        // Use your actual environment variable for the secret key
        const JWT_SECRET = process.env.JWT_SECRET || "secretKey@40"; 
        
        // --- 1. START: Active Session Check ---
        const existingToken = req.cookies.token;

        if (existingToken) {
            let payload = null;
            try {
                // Attempt to verify the existing token
                payload = jwt.verify(existingToken, JWT_SECRET);
            } catch (jwtError) {
                // If the token is invalid or expired, clear the cookie and proceed to the new login.
                console.log("Stale token found, clearing cookie and proceeding.");
                res.clearCookie("token");
                // The new login attempt will happen after this block.
            }
            
            if (payload) {
                // A valid session is found.
                const newLoginEmailId = validator.normalizeEmail(req.body.emailId);
                
                // Compare the email from the valid token with the email being used for the new login
                if (payload.emailId === newLoginEmailId) {
                    // Scenario A: Same user is already logged in
                    return res.status(200).json({
                        message: "You are already logged in.",
                        status: "already_logged_in_same_user"
                    });
                } else {
                    // Scenario B: A different user is logged in
                    // Note: You should fetch the user by ID from the payload to get their current email, 
                    // but for simplicity, we rely on the email embedded in the token payload.
                    return res.status(403).json({
                        message: "An existing user is currently logged in. Please log out first.",
                        status: "already_logged_in_different_user"
                    });
                }
            }
        }
        // --- 1. END: Active Session Check ---

        
        // --- 2. START: Standard Login Logic ---

        // Proceed with the new login attempt (if no valid session was found)
        req.body.emailId = validator.normalizeEmail(req.body.emailId);
        const { emailId, password } = req.body;

        // Validate email id
        if (!validator.isEmail(emailId)) {
            throw new Error("Enter a valid email id");
        }

        // Check for the email in DB
        const user = await User.findOne({ emailId: emailId }).select('+password');
        if (!user) {
            throw new Error("Invalid credentials.");
        }
        
        // Compare the password
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            // Create a new token
            const token = await user.getJWT();
            
            // Send new cookie
            res.cookie("token", token, { 
                expires: new Date(Date.now() + 1 * 3600000), // 1 hour
                httpOnly: true, // Recommended
                secure: process.env.NODE_ENV === 'production' // Recommended
            });
            
            res.status(200).json({message: "Login successful!!"});
        } else {
            throw new Error("Invalid credentials.");
        }
        // --- 2. END: Standard Login Logic ---

    } catch (err) {
        // Handle validation errors or invalid credentials errors
        res.status(400).send("ERROR: " + err.message);
    }
});