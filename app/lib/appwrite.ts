import { Client, Account, Databases, ID, Query } from "react-native-appwrite";
import { Habit, HabitCompletion, User } from "../types/habit";

const client = new Client();

// TODO: Replace with your Appwrite endpoint and project ID
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Your Appwrite Endpoint
  .setProject("68522b33001288c9759c"); // Your project ID

export const account = new Account(client);
export const databases = new Databases(client);

// Database and Collection IDs
export const DATABASE_ID = "68523968003cdecb65bb";
export const HABITS_COLLECTION_ID = "habits";
export const COMPLETIONS_COLLECTION_ID = "habit_completions";

// Auth functions
export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Failed to create account");

    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create user"
    );
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to sign in"
    );
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to sign out"
    );
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const currentAccount = await account.get();
    return {
      $id: currentAccount.$id,
      name: currentAccount.name,
      email: currentAccount.email,
      prefs: currentAccount.prefs as User["prefs"],
    };
  } catch (error) {
    return null;
  }
};

// Habit functions
export const createHabit = async (
  habitData: Omit<Habit, "$id" | "userId" | "createdAt">
) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const habit = await databases.createDocument(
      DATABASE_ID,
      HABITS_COLLECTION_ID,
      ID.unique(),
      {
        ...habitData,
        userId: user.$id,
        createdAt: new Date().toISOString(),
      }
    );
    return habit as Habit;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create habit"
    );
  }
};

export const getUserHabits = async (): Promise<Habit[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const habits = await databases.listDocuments(
      DATABASE_ID,
      HABITS_COLLECTION_ID,
      [Query.equal("userId", user.$id), Query.orderDesc("createdAt")]
    );
    return habits.documents as Habit[];
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch habits"
    );
  }
};

export const updateHabit = async (
  habitId: string,
  habitData: Partial<Habit>
) => {
  try {
    const habit = await databases.updateDocument(
      DATABASE_ID,
      HABITS_COLLECTION_ID,
      habitId,
      habitData
    );
    return habit as Habit;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update habit"
    );
  }
};

export const deleteHabit = async (habitId: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, habitId);

    // Also delete all completions for this habit
    const completions = await databases.listDocuments(
      DATABASE_ID,
      COMPLETIONS_COLLECTION_ID,
      [Query.equal("habitId", habitId)]
    );

    for (const completion of completions.documents) {
      await databases.deleteDocument(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        completion.$id
      );
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete habit"
    );
  }
};

// Habit completion functions
export const markHabitComplete = async (
  habitId: string,
  date: string,
  completed: boolean,
  note?: string
) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    // Check if completion already exists
    const existingCompletions = await databases.listDocuments(
      DATABASE_ID,
      COMPLETIONS_COLLECTION_ID,
      [
        Query.equal("habitId", habitId),
        Query.equal("date", date),
        Query.equal("userId", user.$id),
      ]
    );

    if (existingCompletions.documents.length > 0) {
      // Update existing completion
      const completion = await databases.updateDocument(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        existingCompletions.documents[0].$id,
        {
          completed,
          note,
          completedAt: completed ? new Date().toISOString() : null,
          skipped: false,
        }
      );
      return completion as HabitCompletion;
    } else {
      // Create new completion
      const completion = await databases.createDocument(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        ID.unique(),
        {
          habitId,
          userId: user.$id,
          date,
          completed,
          note,
          completedAt: completed ? new Date().toISOString() : null,
          skipped: false,
        }
      );
      return completion as HabitCompletion;
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to mark habit complete"
    );
  }
};

export const skipHabit = async (habitId: string, date: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const completion = await databases.createDocument(
      DATABASE_ID,
      COMPLETIONS_COLLECTION_ID,
      ID.unique(),
      {
        habitId,
        userId: user.$id,
        date,
        completed: false,
        skipped: true,
      }
    );
    return completion as HabitCompletion;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to skip habit"
    );
  }
};

export const getHabitCompletions = async (
  habitId: string
): Promise<HabitCompletion[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const completions = await databases.listDocuments(
      DATABASE_ID,
      COMPLETIONS_COLLECTION_ID,
      [
        Query.equal("habitId", habitId),
        Query.equal("userId", user.$id),
        Query.orderDesc("date"),
      ]
    );
    return completions.documents as HabitCompletion[];
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch completions"
    );
  }
};

export const getTodayCompletions = async (): Promise<HabitCompletion[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const today = new Date().toISOString().split("T")[0];
    const completions = await databases.listDocuments(
      DATABASE_ID,
      COMPLETIONS_COLLECTION_ID,
      [Query.equal("date", today), Query.equal("userId", user.$id)]
    );
    return completions.documents as HabitCompletion[];
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch today's completions"
    );
  }
};
