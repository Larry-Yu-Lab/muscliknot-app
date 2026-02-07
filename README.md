# MuscliKnot 🧘‍♂️💪

**MuscliKnot** is a comprehensive muscle recovery and pain relief application built with **React Native** and **Expo**. It empowers users to visualize, track, and alleviate muscle pain through interactive anatomy mapping, personalized relief plans, and a vast library of exercises.

---

## 📱 App Functionality & Features

### 1. 🏠 Interactive Body Visualizer (Home)
The core feature of the app is an interactive human anatomy model that allows users to pinpoint pain with precision.
*   **Dual View:** Toggle between **Front** and **Back** muscle views.
*   **Smart Pain Mapping:** Users can drag, place, resize, and rotate a "Pain Marker" oval on the body map.
*   **Relief Generation:** The app analyzes the marker's position and size to identify underlying muscle groups and generates a tailored relief plan.
*   **Quick Access:** "Recent Plans" for quick re-access to previous relief sessions.

### 2. 🚑 Relief Plan Generator (Find Relief)
Once a pain point is selected, users are guided through a structured relief session.
*   **Targeted Exercises:** Displays a curated list of exercises specific to the selected muscle group.
*   **Video Guidance:** Includes video thumbnails and playback UI for visual instruction.
*   **Step-by-Step Instructions:** Detailed text instructions for Setup, Movement, and Holds.
*   **Pain Assessment:** Users can rate their pain intensity (1-10) before/after sessions.
*   **Completion Tracking:** "Mark as Complete" saves the session to history.

### 3. 📅 Recovery History
Tracks the user's recovery journey over time.
*   **Stats Overview:** Displays total sessions, recovery streaks, and the "Most Targeted" muscle group.
*   **Weekly Reports:** Insights into weekly progress.
*   **Interactive Timeline:** A visual scrollable timeline of all past completed sessions with dates and specific relief targets.

### 4. 📚 Exercise Library
A searchable database of all available exercises.
*   **Categorization:** Filter by categories like **Relief**, **Warm-ups**, **Yoga**, **Posture**, and **Strength**.
*   **Muscle Group Filtering:** Specific filters (e.g., Neck, Shoulders, Lower Back) available when viewing "Relief" exercises.
*   **Search:** Real-time search functionality by exercise title.
*   **Detailed Cards:** Shows duration, target muscle, and difficulty for each exercise.

### 5. 👤 Profile & Dashboard
A gamified user hub for settings and progress.
*   **User Stats:** Tracks "Workouts", "Recovery Score", and "Streak Days".
*   **Gamification:** Features an "Athlete Level" with a visual progress ring and badges.
*   **Health Vault:** Visualizes specific health metrics like "Injury History" and "Fitness Level".
*   **Settings:**
    *   **Theme:** Toggle **Dark Mode** / Light Mode.
    *   **Notifications:** Enable/Disable app alerts.
    *   **Language:** Multi-language support (English, French, Spanish, Chinese, etc.).
*   **Plans:** UI for viewing/upgrading subscription plans (Elite vs Pro).

---

## 🛠 Tech Stack

*   **Framework:** [React Native](https://reactnative.dev/) (v0.81) via [Expo](https://expo.dev/) (SDK 54).
*   **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing).
*   **Language:** TypeScript.
*   **Styling:** `StyleSheet`, `react-native-svg` (for charts/rings).
*   **Animations & Gestures:** 
    *   `react-native-reanimated` (Smooth UI transitions).
    *   `react-native-gesture-handler` (Complex interactions for the body map).
*   **State Management:** React Context (`UserContext`, `PreferencesContext`).
*   **Data Persistence:** `AsyncStorage` (Local history/settings).
*   **Backend Integration:** Supabase (Client configured for future cloud sync/auth).

---

## 🚀 Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start the App:**
    ```bash
    npx expo start
    ```

3.  **Run on Device/Simulator:**
    *   Scan the QR code with the **Expo Go** app (Android/iOS).
    *   Press `a` for Android Emulator or `i` for iOS Simulator.

---

## 📂 Project Structure

*   `app/(tabs)`: Main tab-based screens (`index`, `find-relief`, `history`, `library`, `profile`).
*   `components/`: Reusable UI components (e.g., `AnatomyMap.ts`, custom toggles).
*   `context/`: Global state providers (`PreferencesContext`, `UserContext`).
*   `constants/`: Theme colors and configuration.
*   `assets/`: Images (muscle maps) and icons.
*   `utils/`: Helper functions for localization (`i18n`) and storage.

---

> [!IMPORTANT]  
> **Documentation Maintenance:**  
> This `README.md` serves as the central source of truth for the app's functionality. **If you add a new function, screen, or capability to the app, you MUST update this file to reflect those changes.** Keep specific features listed under the "App Functionality" section.
