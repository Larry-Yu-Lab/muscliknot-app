# MuscliKnot
**MuscliKnot**  is a physiotherapy app designed to support muscle recovery, relieve pain, strengthen muscles, and more. Built with React Native and Expo, MuscliKnot allows users to visualize, track, and alleviate muscle pain through interactive anatomy mapping, personalized relief plans, and a vast library of exercises.

---

## App Functionality & Features

### 1.  Interactive Body Visualizer (Home)
The core feature of the app is an interactive human anatomy model that allows users to pinpoint pain with absolute precision.
*   **Dual View:** Flip between front and rear muscle groups with a single tap.
*   **Zoom Control:** Use (+/-) buttons to zoom in up to 2x for a closer look at tighter muscle groups.
*   **Smart Pain Mapping:** Drag, resize, and rotate an oval marker to match the exact shape and location of your pain.
*   **Muscle Search:** Type in body parts like "Neck" or "Lower Back" to jump straight to specific muscles.
*   **Quick Fix & Recent Plans:** Reopen your last session or jump into standard routines right from the main screen.

### 2.  Activity Selection & Relief
Once a pain point is selected, users can choose from 5 specialized activity types:
*   **Find Relief:** Simple exercises designed to calm acute soreness fast.
*   **Warm Up:** Quick routines to prime specific muscles before workouts or daily movement.
*   **Yoga:** Stretches built to improve flexibility and stability around the affected area.
*   **Fix Posture:** Focused drills to ease strain caused by poor alignment.
*   **Strengthen:** Resistance movements to build long-term muscle strength and prevent future flare-ups.

### 3. Intelligent Recommendations
*   **Assessment Engine:** Dynamic logic that adjusts routines based on pain intensity, duration, and user mobility.
*   **Advisory Guidance:** Real-time hints and safety warnings (e.g., "High pain detected — gentle exercises only").
*   **Step-by-Step Instructions:** Detailed text for **Setup**, **Movement**, and **Holds**.
*   **Incremental Display:** Progress through relief plans exercise-by-exercise for better focus.

### 4. Exercise Library & Saved Routines
A searchable database of all available recovery movements.
*   **Categorization:** Filter by activity type or specific muscle group.
*   **Saved Exercises:** Save favourite routines to your personal "Saved" category for instant access.
*   **Global Search:** Quick search across the entire exercise knowledge base.

### 5.  Recovery History & Analytics
Tracks and visualizes your recovery journey.
*   **Stats Overview:** Total sessions, recovery streaks, and most targeted areas.
*   **Advanced Analytics:** Interactive charts for **Pain Trends**, **Activity Breakdown**, and **Muscle Frequency**.
*   **Progress Journey:** A visual timeline of every saved session.

### 6. Profile & Gamification
*   **Athlete Level:** Earn badges and levels as you consistently track your recovery.
*   **Health Vault:** Store injury history and fitness levels for personalized planning.
*   **Multi-Language Support:** Full localization for **English**, **Spanish**, **French**, and **Chinese (中文)**.
*   **Dark Mode:** Premium visual experience optimized for muscle mapping.
*   **Recovery Squad:** Connect with friends and family to share encouragement, keep each other accountable, and spark friendly competition.

---

## Tech Stack

*   **Framework:** [React Native](https://reactnative.dev/) (v0.81) via [Expo](https://expo.dev/) (SDK 54).
*   **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation).
*   **Backend & DB:** **Supabase** (PostgreSQL, Auth, Real-time sync).
*   **State Management:** React Context API (`UserContext`, `PreferencesContext`).
*   **Localization:** Custom i18n engine with multi-language support.
*   **Styling & UI:** 
    *   `react-native-reanimated` (Advanced animations).
    *   `react-native-gesture-handler` (Complex map interactions).
    *   `react-native-svg` (Data visualization & charts).
    *   `react-native-worklets` (Low-latency UI logic).

---

##  Getting Started

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

##  Project Structure

*   `app/(tabs)`: Core navigation screens and activity pages.
*   `components/`: Reusable UI elements and the `AnatomyMap` logic.
*   `context/`: Global state providers for Auth, User Data, and Preferences.
*   `utils/`: Business logic for the **Assessment Engine**, **i18n**, and **Supabase** clients.
*   `scripts/`: Database seeding, diagnostic tools, and exercise import utilities (CSV to SQL).
*   `supabase/`: Database migrations and configuration.
*   `constants/`: Design system tokens (Colors, Typography).

---

##  Database Schema

The application uses a robust PostgreSQL schema via Supabase:
*   `recovery_knowledge_base`: Stores exercise content across all 5 activity types.
*   `user_history`: Logs completed recovery sessions and pain assessments.
*   `user_saved_exercises`: Tracks bookmarked routines for easy access.
*   `pain_sessions`: Records specific pain locations and how they change over time.

---

> [!IMPORTANT]  
> **Documentation Maintenance:**  
> This `README.md` serves as the central source of truth for the app's functionality. **If you add a new function, screen, or capability to the app, you MUST update this file to reflect those changes.** Keep specific features listed under the "App Functionality" section.
