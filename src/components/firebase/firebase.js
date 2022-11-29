import "../../App";
import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, setDoc, } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC496RknhFuIn6A8BH_xuE91spAhFXORXY",
    authDomain: "memoryapp-b91cd.firebaseapp.com",
    projectId: "memoryapp-b91cd",
    storageBucket: "memoryapp-b91cd.appspot.com",
    messagingSenderId: "872063547",
    appId: "1:872063547:web:a4454fda25d9e5bd9af21e",
    measurementId: "G-ND2RNPJDZZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Intiailize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// This function tests if a user already exists in the system and returns a boolean
export async function addNewUser(givenName, userEmail) {
    try {
        let docRef = doc(db, "users", userEmail);
        let docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            // doc.data() will be undefined in this case
            console.log("Initializing new user: ", userEmail);
            await setDoc(doc(db, "users", userEmail), {
                name: givenName,
                id: userEmail,
            });

            // initializing "verses" collection
            console.log(collection(docRef, "verses"));
        }
    } catch (error) {
        console.log("Error getting document: ", error);
    }
}

// this function adds a new verse to the user's "verses" collection
// the id for this new verse should be "[book][fromVerse][toVerse]"
export async function addNewVerse(userEmail, book, chapter, checkedOff, scripture, fromVerse, toVerse, timeUntilReview) {
    if (chapter === 0 || fromVerse === 0 || toVerse === 0) {
        console.log("Invalid inputs: ", chapter, fromVerse, toVerse);
        return;
    }

    try {
        // let docRef = doc(db, "users", userEmail);
        let pathRef = "users/" + userEmail + "/verses";
        let docId = book + chapter + fromVerse + toVerse;

        // grab a document in the verses collection under this user by docId
        // will be undefined if does not exist
        let docSnap = await getDoc(doc(db, pathRef, docId));

        // tests if the verse exists, if it does, prompt the user
        if (docSnap.exists()) {
            console.log("Verse with ID " + docId + " already exists: ", docSnap.data());
            if (fromVerse === toVerse) {
                alert("You already have this passage (" + book + " " + chapter + ":" + fromVerse + " in your checklist!)");
            } else {
                alert("You already have this passage (" + book + " " + chapter + ":" + fromVerse + "-" + toVerse + "in your checklist!)");
            }
        } else {
            await setDoc(doc(db, pathRef, docId), {
                book: book,
                chapter: chapter,
                checkedOff: checkedOff,
                scripture: scripture,
                fromVerse: fromVerse,
                toVerse: toVerse,
                timeUntilReview: timeUntilReview
            });
            console.log("Verse written with id " + docId + " added successfully.");
        }
    } catch (error) {
        console.log("Error while adding new verse: ", error);
    }
}

export async function getVersesCollection(userEmail) {
    let pathRef = "users/" + userEmail + "/verses";
    let querySnapshot = await getDocs(collection(db, pathRef));
    querySnapshot.forEach((doc) => {
        console.log(doc.data().scripture);
    });
}