import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { addNewUser, addNewVerse, getVersesCollection, } from "./components/firebase/firebase";
import { useEffect, useState, } from "react";
import { readCsv } from "./components/bible/bibleUtil.jsx";

import StickyTitleDropdown from "./components/dropdown/dropdown";
import SubmitButton from "./components/button/button"
import jwt_decode from "jwt-decode";

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
  const [user, setUser] = useState(0); // probably need to introduce redux for a more global state for this fullstack application.
  const [bibleArray, setBibleArray] = useState({}); // this is to store the whole bible in an array
  const [selectedBook, setSelectedBook] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [selectedFromVerse, setSelectedFromVerse] = useState(0);
  const [selectedToVerse, setSelectedToVerse] = useState(0);
  const [currentPassage, setCurrentPassage] = useState(0);
  const [didBookChange, setDidBookChange] = useState(0); // using a counter, to count an update of a book change
  const [didFromVerseChange, setDidFromVerseChange] = useState(0) // same idea as didBookChange useState

  function handleCallbackResponse(response) {
    var userObject = jwt_decode(response.credential);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;

    addNewUser(userObject.given_name, userObject.email);
    // addNewVerse(userObject.email, "Exodus", 3, false, "And I will give this people favor in the sight of the Egyptians; and when you go, you shall not go empty,", 21, 21, 0);
    getVersesCollection(userObject.email);
  }

  // this function handles when the user signs out of their account
  // it resets all the selected items: bibleArray, book, chapter, fromVerse, toVerse, and currentPassage
  function handleSignOut() {
    setUser(0);
    resetSelections();
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
      {size: "medium" }
    );

  }, []);

  // when the selected book changes, update the currently stored
  // bible array to whatever was selected and also reset the
  // current selected chapter, verses, and passage
  useEffect(() => {
    if (typeof (selectedBook) === "string") {
      readCsv(updateBibleArray, selectedBook);
      setSelectedChapter(0);
      setSelectedFromVerse(0);
      setSelectedToVerse(0);
      setCurrentPassage(0);
      setDidBookChange((didBookChange + 1));
    }
  }, [selectedBook])

  useEffect(() => {
    setSelectedToVerse(0);
    setCurrentPassage(0);
    setDidFromVerseChange((didFromVerseChange + 1));
  }, [selectedFromVerse]);

  // once the user has selected the verses, it means that they
  // have also selected a chapter and a book, set the current
  // passage to the book, chapter, and the verses
  useEffect(() => {
    if (selectedFromVerse !== 0 && selectedToVerse !== 0) {
      // testing if verses are equal, if so we only need one verse
      if (selectedFromVerse === selectedToVerse) {
        let tempPassageArray = "" + bibleArray[selectedChapter - 1][selectedFromVerse - 1];
        setCurrentPassage(tempPassageArray);

        // in the case that the two are not equal, meaning multiple verses are selected,
        // need to use a string and append
      } else {
        let tempPassageArray = "";
        for (let i = selectedFromVerse; i < selectedToVerse + 1; i++) {
          tempPassageArray += bibleArray[selectedChapter - 1][i - 1] + " "; // extra space at the end allows for more clean formatting
        }

        // used temporary string to set the state of the current passage for later usage
        setCurrentPassage(tempPassageArray);
      }
    }
  }, [selectedFromVerse, selectedToVerse]);

  // this function resets all the current selections made by the user
  // and this also includes bibleArray
  function resetSelections() {
    setBibleArray(0), setSelectedBook(0), setSelectedChapter(0), setSelectedFromVerse(0), setSelectedToVerse(0), setCurrentPassage(0);
  }

  // this function communicates to the Firestore database and writes a new document in the verses collection under the current user
  // and after it writes it resets the current selections
  function handleSubmit() {
    addNewVerse(user.email, selectedBook, selectedChapter, false, currentPassage, selectedFromVerse, selectedToVerse, 0)
    resetSelections();
  }

  // this function updates the current bible array
  function updateBibleArray(array) {
    setBibleArray(array);
  }

  // this sets the state of what book was selected
  // from the child component to the parent component
  function handleSelectedBook(itemSelected) {
    setSelectedBook(itemSelected);
    readCsv(updateBibleArray, itemSelected);
  }

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
  function renderBooksDropdown() {
    if (user.email !== undefined) {
      return <StickyTitleDropdown onSelect={handleSelectedBook} typeOfInput={"string"} input={BIBLE_BOOKS} />
    }
  }

  // this function renders the a dropdown list of chapters after
  // the user has selected a book
  function renderChaptersDropdown() {

    // two cases if the book was changed or not to reset the
    // title of the dropdown to chapter
    if (user.email !== undefined && selectedBook !== 0) {
      return <StickyTitleDropdown onSelect={handleSelectedChapter} typeOfInput={"number"} input={["Chapter", bibleArray.length, didBookChange, 0]} />
    }
  }

  // this function renders two dropdown components of a "From verse"
  // and "To Verse" that the user has selected
  function renderVersesDropdown(typeOfVerse) {
    if (user !== 0 && selectedBook !== 0 && selectedChapter !== 0) {
      if (typeOfVerse === "From Verse") {
        return <StickyTitleDropdown onSelect={handleSelectedFromVerse} typeOfInput={"number"} input={[typeOfVerse, bibleArray[selectedChapter - 1].length, didBookChange, 0]} />
      } else if (typeOfVerse === "To Verse" && selectedFromVerse !== 0) {
        return <StickyTitleDropdown onSelect={handleSelectedToVerse} typeOfInput={"number"} input={[typeOfVerse, bibleArray[selectedChapter - 1].length, didFromVerseChange, (selectedFromVerse - 1)]} />
      }
    }
  }

  // this function renders the current passage based on the user's selection
  // of Book, Chapter, and two verses, From Verse and To Verse
  function renderCurrentPassage() {
    if (currentPassage !== 0) {
      let singleVerseString = "" + selectedFromVerse;
      let multipleVerseString = selectedFromVerse + "-" + selectedToVerse;
      return <div>{selectedBook} {selectedChapter}:{selectedFromVerse === selectedToVerse ? singleVerseString : multipleVerseString}
        <br /> {currentPassage}</div>
    }
  }

  // once the verses have been chosen, the app should render a buton for the user to submit the passage to their account
  function renderSubmitButton() {
    if (currentPassage !== 0 && user !== 0) {
      return <SubmitButton id="test" title="Submit" onClick={() => handleSubmit()} />
    }
  }

  return (
    <div className="App">
      <div className="container d-flex flex-column align-items-center justify-content-center">

        <div id="signInDiv" className="signInDiv">
          {/* if our user object is NOT empty, then that means we have a user. */}
          {Object.keys(user).length !== 0 &&
            <button className="loginButton" onClick={(e) => handleSignOut(e)}>Sign Out</button>
          }

          {/* after loggin in, this is what shows */}
          {user !== 0 &&
            <div>
              <img referrerPolicy="no-referrer" src={user.picture}></img>
              <h3>{user.name}</h3>
            </div>}
        </div>
        <div className="row">
          <div id="dropdownDiv" className="dropdownDiv">
            {renderBooksDropdown()}
            {renderChaptersDropdown()}
            {renderVersesDropdown("From Verse")}
            {renderVersesDropdown("To Verse")}
          </div>
        </div>
        <div className="row">
          {renderCurrentPassage()}
          {renderSubmitButton()}
        </div>
      </div>
    </div>
  );
}

export default App;
