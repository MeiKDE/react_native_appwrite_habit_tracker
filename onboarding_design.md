## **Mobile App Authentication Wireframe Flow**

This outline describes the necessary screens for a robust sign-in and sign-up experience, along with their key elements and navigational paths.

### 1\. Welcome / Onboarding Screen

* **Purpose:** The very first screen a user sees upon opening the app for the first time. It introduces the app briefly and guides the user towards account creation or login.  
* **Content:**  
  * **App Logo/Icon:** Prominently displayed at the top.  
  * **Carousel/Swipeable Onboarding Screens (Recommended):** This is a highly effective design pattern. Instead of a single static screen, the welcome experience can be broken into **3 individual "slides"** that the user can swipe through. Each slide should feature:  
    * **Engaging Visual:** A high-quality illustration, animation, or a screenshot showing a key feature or benefit of the app.  
    * **Headline/Title:** A concise, benefit-driven statement (e.g., "Organize Your Day," "Connect with Your Community").  
    * **Short Description:** A brief explanation of the feature or benefit.  
    * **Pagination Dots:** Small indicators (dots) at the bottom to show which slide the user is on and how many more there are.  
  * **Call to Action Buttons (typically on the *last* onboarding slide or beneath the carousel):**  
    * **"Sign Up" Button:** The primary call to action for new users.  
    * **"Sign In" Button:** For existing users.  
    * **"Continue as Guest" / "Skip" (Optional):** If your app offers functionality without an account. This button is often prominent on the first or last slide, allowing users to bypass the onboarding.  
* **Navigation:**  
  * **Swiping/Pagination:** Moves between different onboarding slides.  
  * **"Sign Up" Button:** Leads to the **Sign Up Screen**.  
  * **"Sign In" Button:** Leads to the **Sign In Screen**.  
  * *(Optional)* **"Continue as Guest" / "Skip"**: Leads to the **Main App Home Screen** (as a guest user).

### 2\. Sign Up Screen

* **Purpose:** Allows new users to create an account.  
* **Content:**  
  * **Screen Title:** "Create Your Account" or "Sign Up".  
  * **Social Sign-Up Options:**  
    * **"Continue with Google" Button:** With Google logo.  
    * **"Continue with Facebook" Button:** With Facebook logo.  
    * *(Optional)* "Continue with Apple" (for iOS apps).  
  * **Divider:** "OR" or "Sign up with Email" to separate social options from email/password.  
  * **Input Fields (Email & Password):**  
    * **Full Name (Optional but Recommended):** A text input field. Including this allows for personalization within the app (e.g., "Welcome, \[User Name\]\!"). It also makes it easier for users to identify themselves later.  
    * **Email Address:** A text input field with email validation (e.g., checks for "@" and ".com").  
    * **Password:** A password input field (masked characters) with an eye icon to toggle visibility. Consider adding password strength indicators.  
    * **Confirm Password:** Another password input field for verification.  
  * **"Sign Up" Button:** The main action button to submit the form.  
  * **Terms & Privacy Link (Optional but Recommended):** Small text linking to "Terms of Service" and "Privacy Policy" (e.g., "By signing up, you agree to our Terms and Privacy Policy").  
  * **"Already have an account?" Link:** Small text with a "Sign In" link.  
* **Navigation:**  
  * **"Sign Up" Button (Email/Password):** Leads to **Main App Home Screen** (after successful registration).  
  * **"Continue with Google/Facebook" Buttons:** Leads to Google/Facebook authentication flow, then back to **Main App Home Screen** (after successful registration).  
  * **"Sign In" Link:** Leads to the **Sign In Screen**.

### 3\. Sign In Screen

* **Purpose:** Allows existing users to log into their account.  
* **Content:**  
  * **Screen Title:** "Welcome Back" or "Sign In".  
  * **Social Sign-In Options:**  
    * **"Continue with Google" Button:** With Google logo.  
    * **"Continue with Facebook" Button:** With Facebook logo.  
    * *(Optional)* "Continue with Apple" (for iOS apps).  
  * **Divider:** "OR" or "Sign in with Email" to separate social options from email/password.  
  * **Input Fields (Email & Password):**  
    * **Email Address:** A text input field.  
    * **Password:** A password input field (masked characters) with an eye icon to toggle visibility.  
  * **"Forgot Password?" Link:** Small text link.  
  * **"Sign In" Button:** The main action button to submit the form.  
  * **"Don't have an account?" Link:** Small text with a "Sign Up" link.  
* **Navigation:**  
  * **"Sign In" Button (Email/Password):** Leads to **Main App Home Screen** (after successful login).  
  * **"Continue with Google/Facebook" Buttons:** Leads to Google/Facebook authentication flow, then back to **Main App Home Screen** (after successful login).  
  * **"Forgot Password?" Link:** Leads to the **Forgot Password Screen**.  
  * **"Sign Up" Link:** Leads to the **Sign Up Screen**.

### 4\. Forgot Password Screen

* **Purpose:** Allows users to initiate a password reset process by providing their email.  
* **Content:**  
  * **Screen Title:** "Forgot Password?" or "Reset Your Password".  
  * **Instructions:** A brief message explaining the process (e.g., "Enter your email address and we'll send you a link to reset your password.").  
  * **Email Address Input Field:** To enter the registered email.  
  * **"Send Reset Link" Button:** The action button to submit.  
  * **"Back to Sign In" Link (Optional):** A link to go back to the Sign In screen.  
* **Navigation:**  
  * **"Send Reset Link" Button:** Displays a **Confirmation Message Screen** (e.g., "Check your email for reset instructions"). *This typically doesn't go directly to a new screen, but shows a temporary message or modal.*

### 5\. Password Reset Confirmation Message (Ephemeral)

* **Purpose:** To inform the user that a password reset email has been sent. This is usually a temporary message or a modal rather than a full screen.  
* **Content:**  
  * **Message:** "Password reset email sent\!" or "Please check your inbox (and spam folder) for instructions to reset your password."  
  * **Optional:** A link to "Resend Email" or "Back to Sign In".  
* **Navigation:**  
  * After displaying, it might automatically redirect to the **Sign In Screen** after a few seconds, or user can manually go back.

### 6\. Reset Password Screen

* **Purpose:** Where the user sets a new password after clicking a reset link from their email.  
* **Content:**  
  * **Screen Title:** "Set New Password" or "Reset Password".  
  * **Instructions:** "Enter and confirm your new password."  
  * **New Password Input Field:** A password input field (masked characters) with an eye icon.  
  * **Confirm New Password Input Field:** Another password input field for verification.  
  * **"Reset Password" Button:** The main action button.  
* **Navigation:**  
  * **"Reset Password" Button:** Leads to the **Sign In Screen** with a success message (e.g., "Password successfully reset\! Please sign in with your new password.").

### 7\. Main App Home Screen

* **Purpose:** The primary landing page after successful sign-in/sign-up.  
* **Content:** This will depend entirely on your app's core functionality, but it's where the user experiences the main features.  
* **Navigation:** Accessible from **Sign Up Screen** and **Sign In Screen** upon successful authentication.

### Flow Overview:

graph TD  
    A\[App Launch\] \--\> B{First Time User?};  
    B \-- Yes \--\> C\[Welcome/Onboarding Screen\];  
    B \-- No \--\> D\[Sign In Screen\];

    C \-- Sign Up \--\> E\[Sign Up Screen\];  
    C \-- Sign In \--\> D;

    E \-- Email/Password Submit \--\> F\[Main App Home Screen\];  
    E \-- Google/Facebook Sign Up \--\> F;  
    E \-- Already Have Account? \--\> D;

    D \-- Email/Password Submit \--\> F;  
    D \-- Google/Facebook Sign In \--\> F;  
    D \-- Forgot Password? \--\> G\[Forgot Password Screen\];  
    D \-- Don't Have Account? \--\> E;

    G \-- Send Reset Link \--\> H\[Password Reset Confirmation Message\];  
    H \--\> D;  
    ClickEmailLink \-- From Email \--\> I\[Reset Password Screen\];  
    I \-- Reset Password \--\> D;

This flow covers all the essential screens for a user-friendly and secure authentication process. Including the user's name during sign-up is generally a good practice for personalization and a more engaging app experience.