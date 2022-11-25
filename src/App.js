import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { addNewUser, addNewVerse, getVersesCollection, } from "../src/firebase/firebase";
import { useEffect, useState, } from "react";
import { getChapters, readCsv } from "./components/bible/readCsv";

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

    // setBibleArray(readCsv(updateBibleArray));
    // console.log(bibleArray);
  }, []);
  function updateBibleArray(array) {
    setBibleArray(array);
  }

  // this sets the state of what book was selected
  // from the child component to the parent component
  function handleSelectedBook(selectedBook) {
    setSelectedBook(selectedBook);
  }

  function handleSelectedChapter(selectedChapter) {
    setSelectedChapter(selectedChapter);
  }

  // console.log(selectedBook);

  // this function renders the bible book name dropdown
  function renderBookOptionsDropdown() {
    if (user.email !== undefined) {
      return <StickyTitleDropdown onSelect={handleSelectedBook} input={BIBLE_BOOKS} />
    }
  }

  // this function renders the a dropdown list of chapters after
  // the user has selected a book
  function renderChapterOptionsDropdown() {
    if (user.email !== undefined && selectedBook !== 0) {
      let numberOfChapters = getChapters(selectedBook);
      return <StickyTitleDropdown onSelect={handleSelectedChapter} typeOfInput={"number"} input={["Chapter", 50]} />
    }
  }

  function renderVerseOptionsDropdown() {

  }

  function showSelectedBook() {
    if(selectedBook !== 0) {
      return <div style={{color: "white"}}>{selectedBook.toString()}</div>
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
      {showSelectedBook()}
    </div>
  );
}

export default App;
