import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { 
  getCurrentUserAndProfile, 
  signInWithEmailPassword, 
  signOut as appwriteSignOut, 
  signUpWithEmailPassword 
} from "../appwrite";
import { User } from "../types/habit";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const { user: currentUser } = await getCurrentUserAndProfile();
      if (currentUser) {
        setUser({
          $id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
          prefs: { notifications: true }
        });
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailPassword(email, password);
      if (result.success) {
        const { user: currentUser } = await getCurrentUserAndProfile();
        if (currentUser) {
          setUser({
            $id: currentUser.$id,
            name: currentUser.name,
            email: currentUser.email,
            prefs: { notifications: true }
          });
        }
      } else {
        throw new Error(result.error || "Sign in failed");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      const result = await signUpWithEmailPassword(email, password, name);
      if (result.success) {
        const { user: currentUser } = await getCurrentUserAndProfile();
        if (currentUser) {
          setUser({
            $id: currentUser.$id,
            name: currentUser.name,
            email: currentUser.email,
            prefs: { notifications: true }
          });
        }
      } else {
        throw new Error(result.error || "Sign up failed");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await appwriteSignOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};