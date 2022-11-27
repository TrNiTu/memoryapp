import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { addNewUser, addNewVerse, getVersesCollection, } from "../src/firebase/firebase";
import { useEffect, useState, } from "react";
import { getNumberOfChapters, getNumberOfVerses, readCsv } from "./components/bible/bibleUtil.jsx";

import StickyTitleDropdown from "./components/dropdown/dropdown";
import jwt_decode from "jwt-decode";

import Papa from "papaparse";

const BIBLE_BOOKS = ["Book", "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings",
  "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms",
  "Proverbs", "Ecclesiastes", "Song of Songs", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum",
  "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians",
  "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus",
  "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation"];
function App() {
  const [user, setUser] = useState({}); // probably need to introduce redux for a more global state for this fullstack application.
  const [bibleArray, setBibleArray] = useState({}); // this is to store the whole bible in an array
  const [counter, setCounter] = useState({});
  const [selectedBook, setSelectedBook] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [selectedFromVerse, setSelectedFromVerse] = useState(0);
  const [selectedToVerse, setSelectedToVerse] = useState(0);
  const [currentPassage, setCurrentPassage] = useState(0);

  function handleCallbackResponse(response) {
    var userObject = jwt_decode(response.credential);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;

    addNewUser(userObject.given_name, userObject.email);
    // addNewVerse(userObject.email, "Exodus", 3, false, "And I will give this people favor in the sight of the Egyptians; and when you go, you shall not go empty,", 21, 21, 0);
    getVersesCollection(userObject.email);
  }

  // this function handles when the user signs out of their account
  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  // Google's login API
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "289499878407-t05kn7dafpf187hjofe5ji9141311kch.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );

  }, []);
  function updateBibleArray(array) {
    setBibleArray(array);
  }

  // this sets the state of what book was selected
  // from the child component to the parent component
  function handleSelectedBook(itemSelected) {
    setSelectedBook(itemSelected);
    readCsv(updateBibleArray, itemSelected);
  }

  // when the selected book changes, update the currently stored
  // bible array to whatever was selected
  useEffect(() => {
    if (typeof (selectedBook) === "string") {
      readCsv(updateBibleArray, selectedBook);
    }
  }, [selectedBook])

  // once the user has selected the verses, it means that they
  // have also selected a chapter and a book, set the current
  // passage to the book, chapter, and the verses
  useEffect(() => {
    if (selectedFromVerse !== 0 && selectedToVerse !== 0) {
      console.log(selectedFromVerse)
      // testing if verses are equal, if so we only need one verse
      if(selectedFromVerse === selectedToVerse) {
        setCurrentPassage(bibleArray[selectedChapter-1][selectedFromVerse])
      // in the case that the two are not equal, meaning multiple verses are selected,
      // need to use a string and append
      } else {
        let tempPassageArray = "";
        console.log("test");
        for (let i = selectedFromVerse; i < selectedToVerse; i++) {
          tempPassageArray + bibleArray[selectedChapter-1][i-1] + " "; // extra space at the end allows for more clean formatting
        }
        
        // used temporary string to set the state of the current passage for later usage
        setCurrentPassage(tempPassageArray);
      }
    }
  }, [selectedFromVerse, selectedToVerse]);

  // this sets the state of what chapter was selected from
  // the child component to the parent component
  function handleSelectedChapter(itemSelected) {
    setSelectedChapter(itemSelected);
  }

  // this sets the state of what "From Verse" that the user selects
  // and passes it from the child component to the parent component
  function handleSelectedFromVerse(itemSelected) {
    setSelectedFromVerse(itemSelected);
  }

  // this sets the state of what "From Verse" that the user selects
  // and passes it from the child component to the parent component
  function handleSelectedToVerse(itemSelected) {
    setSelectedToVerse(itemSelected);
  }

  // this function renders the bible book name dropdown
  function renderBookOptionsDropdown() {
    if (user.email !== undefined) {
      return <StickyTitleDropdown onSelect={handleSelectedBook} typeOfInput={"string"} input={BIBLE_BOOKS} />
    }
  }

  // this function renders the a dropdown list of chapters after
  // the user has selected a book
  function renderChapterOptionsDropdown() {
    if (user.email !== undefined && selectedBook !== 0) {
      return <StickyTitleDropdown onSelect={handleSelectedChapter} typeOfInput={"number"} input={["Chapter", bibleArray.length]} />
    }
  }

  // this function renders two dropdown components of a "From verse"
  // and "To Verse" that the user has selected
  function renderVerseOptionsDropdown(typeOfVerse) {
    if (user.email !== undefined && selectedBook !== 0 && selectedChapter !== 0) {
      if (typeOfVerse === "To Verse") {
        return <StickyTitleDropdown onSelect={handleSelectedToVerse} typeOfInput={"number"} input={[typeOfVerse, bibleArray[selectedChapter].length]} />
      } else if (typeOfVerse === "From Verse") {
        return <StickyTitleDropdown onSelect={handleSelectedFromVerse} typeOfInput={"number"} input={[typeOfVerse, bibleArray[selectedChapter].length]} />
      }
    }
  }

  // this function renders the current passage based on the user's selection
  // of Book, Chapter, and two verses, From Verse and To Verse
  function renderCurrentPassage() {
    if(currentPassage !== 0) {
      return <div>
        {selectedBook} {selectedChapter}:{selectedFromVerse === selectedToVerse ? {selectedFromVerse} : {selectedFromVerse}+":"+{selectedToVerse}}
      </div>
    }
  }

  return (
    <div className="App">
      <div id="signInDiv"></div>
      {/* if our user object is NOT empty, then that means we have a user. */}
      {Object.keys(user).length !== 0 &&
        <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
      }

      {/* after loggin in, this is what shows */}
      {user &&
        <div>
          <img referrerPolicy="no-referrer" src={user.picture}></img>
          <h3>{user.name}</h3>
        </div>}

      {renderBookOptionsDropdown()}
      {renderChapterOptionsDropdown()}
      {renderVerseOptionsDropdown("From Verse")}
      {renderVerseOptionsDropdown("To Verse")}
      {renderCurrentPassage()}
    </div>
  );
}

export default App;
