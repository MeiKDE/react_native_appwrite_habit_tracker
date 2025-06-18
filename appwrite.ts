// Appwrite integration and authentication glue code for React Native
// ---------------------------------------------------------------
// This module provides functions to handle onboarding, sign-up, sign-in, OAuth, session management,
// and user profile creation using the Appwrite SDK.
//
// UI integration points are marked with comments (e.g., update UI state, show errors, navigate).
//
// Prerequisites:
// - Install Appwrite SDK: npm install appwrite
// - Replace <APPWRITE_ENDPOINT> and <APPWRITE_PROJECT_ID> with your actual values.
// - Ensure you have a database named 'AppUsers' and a collection named 'Profiles' as described.

import { Client, Account, Databases, ID, OAuthProvider } from 'appwrite';

// ---- CONFIGURATION ----
const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const APPWRITE_DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const APPWRITE_PROFILES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID!;

// ---- SINGLETON CLIENT ----
const client = new Client();
let account: Account;
let databases: Databases;

export function initializeAppwriteClient() {
  client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
  account = new Account(client);
  databases = new Databases(client);
  // Call this once at app startup (e.g., in your App.tsx or entry point)
}

// ---- SIGN UP WITH EMAIL/PASSWORD ----
export async function signUpWithEmailPassword(email: string, password: string, fullName?: string) {
  try {
    // Optionally: set loading state here
    // e.g., setLoading(true);
    // Generate and log the ID to debug the issue
    const generatedId = ID.unique();
    console.log('Generated ID:', generatedId, 'Length:', generatedId.length);
    
    // Let Appwrite auto-generate the user ID
    const user = await account.create(generatedId, email, password, fullName);
    console.log('Creating profile for user:', user);
    // Automatically log in the user
    await account.createEmailPasswordSession(email, password);
    // Create user profile in Profiles collection

    await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_PROFILES_COLLECTION_ID,
      ID.unique(),
      {
        userId: user.$id,
        fullName: fullName || '',
        email,
      },
      [
        // Document-level permissions: only the user can read/update their profile
        `read("user:${user.$id}")`,
        `write("user:${user.$id}")`,
        `update("user:${user.$id}")`,
        `delete("user:${user.$id}")`
      ]
    );
    // Optionally: navigate to main app screen, update UI state
    // e.g., navigation.navigate('Home');
    return { success: true };
  } catch (error: any) {
    // Optionally: set error state, show error to user
    // e.g., setError(error.message);
    console.error('Sign up error:', error);
    return { success: false, error: error.message || 'Sign up failed' };
  } finally {
    // Optionally: setLoading(false);
  }
}

// ---- SIGN IN WITH EMAIL/PASSWORD ----
export async function signInWithEmailPassword(email: string, password: string) {
  try {
    // Optionally: set loading state here
    // Always try to delete the current session before signing in
    try {
      await account.deleteSession('current');
    } catch (e) {
      // Ignore error if no session exists
    }
    const session = await account.createEmailPasswordSession(email, password);
    // Optionally: navigate to main app screen, update UI state
    return { success: true, session };
  } catch (error: any) {
    // Optionally: set error state, show error to user
    console.error('Sign in error:', error);
    return { success: false, error: error.message || 'Sign in failed' };
  } finally {
    // Optionally: setLoading(false);
  }
}

// ---- SIGN IN WITH OAUTH (SOCIAL) ----
export async function signInWithOAuth(provider: OAuthProvider) {
  try {
    // This will redirect to the provider and back to your app
    await account.createOAuth2Session(provider);
    // After redirect, you should call getCurrentUserAndProfile() to fetch user/profile
    // Optionally: set loading state, handle navigation in your OAuth callback handler
    return { success: true };
  } catch (error: any) {
    console.error('OAuth sign-in error:', error);
    return { success: false, error: error.message || 'OAuth sign-in failed' };
  }
}

// ---- GET CURRENT USER AND PROFILE ----
export async function getCurrentUserAndProfile() {
  try {
    const user = await account.get();
    // Query Profiles collection for this user's profile
    const profileList = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_PROFILES_COLLECTION_ID,
      [
        // Query by userId
        `equal("userId", ["${user.$id}"])`
      ]
    );
    let profile = profileList.documents[0];
    // If profile does not exist (e.g., after OAuth), create it
    if (!profile) {
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_PROFILES_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          fullName: user.name || '',
          email: user.email,
        },
        [
          `read("user:${user.$id}")`,
          `write("user:${user.$id}")`,
          `update("user:${user.$id}")`,
          `delete("user:${user.$id}")`
        ]
      );
      // Fetch again
      const newProfileList = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_PROFILES_COLLECTION_ID,
        [`equal("userId", ["${user.$id}"])`]
      );
      profile = newProfileList.documents[0];
    }
    return { user, profile };
  } catch (error: any) {
    // No user logged in, or error fetching profile
    console.error('Get current user/profile error:', error);
    return { user: null, profile: null, error: error.message };
  }
}

// ---- SIGN OUT ----
export async function signOut() {
  try {
    await account.deleteSession('current');
    // Optionally: update UI state, navigate to sign-in screen
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message || 'Sign out failed' };
  }
}

// ---- OAUTH PROVIDER ENUM (for convenience) ----
export const OAUTH_PROVIDERS = {
  google: OAuthProvider.Google,
  facebook: OAuthProvider.Facebook,
  // Add more as needed (e.g., apple: OAuthProvider.Apple)
};

// ---- USAGE NOTES ----
// - Call initializeAppwriteClient() once at app startup.
// - Use the exported functions in your UI event handlers (e.g., onPress for buttons).
// - Handle loading and error states in your UI using the returned values.
// - Replace config values with your actual Appwrite project details.

export function getAppwriteOAuthUrl(provider: OAuthProvider, redirectUrl: string) {
  return account.createOAuth2Token(provider, redirectUrl);
}

export { client }; 