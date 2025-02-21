import axios from 'axios';
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDDRskIYK_PeAJaUhevqzFo_ESdRrR6_uM",
    authDomain: "youguard-3fdd4.firebaseapp.com",
    projectId: "youguard-3fdd4",
    storageBucket: "youguard-3fdd4.firebasestorage.app",
    messagingSenderId: "126772319506",
    appId: "1:126772319506:web:b4f92d813d0372bfc44fcb",
    measurementId: "G-BPCDWG7XWP"
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

const userService = new UserService();

export const useFirebase = () => {
    const saveDraftToFirebase = async (draft) => {
        try {
            const draftWithEmail = {
                ...draft,
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, 'drafts'), draftWithEmail);
            return docRef.id;
        } catch (error) {
            console.error('Error saving draft:', error);
            throw error;
        }
    };

    const getDraftsFromFirebase = async () => {
        try {
            const userDetails = await userService.getUserDetails();
            const draftsRef = collection(db, "drafts");
            const q = query(draftsRef, where("email", "==", userDetails.Email));

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching drafts:", error);
            throw error;
        }
    };

    const getDraftFromFirebase = async (id) => {
        try {
            const docRef = doc(db, 'drafts', id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        } catch (error) {
            console.error('Error getting draft:', error);
            throw error;
        }
    };

    const updateDraftInFirebase = async (id, draft) => {
        try {
            const docRef = doc(db, 'drafts', id);
            const updatedDraft = {
                ...draft,
                updatedAt: new Date().toISOString()
            };

            await updateDoc(docRef, updatedDraft);
            return true;
        } catch (error) {
            console.error('Error updating draft:', error);
            throw error;
        }
    };

    const removeDraftFromFirebase = async (id) => {
        try {
            // Get the draft and log its details
            const draft = await getDraftFromFirebase(id);
            console.log("Found draft:", draft);

            if (!draft) {
                throw new Error('Draft not found');
            }

            // Get user details and log them
            const userDetails = await userService.getUserDetails();
            console.log("Current user email:", userDetails.Email);
            console.log("Draft owner email:", draft.email);

            if (draft.email !== userDetails.Email) {
                throw new Error('Unauthorized to delete this draft');
            }

            const docRef = doc(db, 'drafts', id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error('Error in removeDraftFromFirebase:', error);
            throw error;
        }
    };

    return {
        saveDraftToFirebase,
        getDraftsFromFirebase,
        getDraftFromFirebase,
        updateDraftInFirebase,
        removeDraftFromFirebase
    };
};