import "./App.css";
import { addNewUser, addNewVerse, } from "../src/firebase/firebase";
import StickyTitleDropdown from "../src/components/dropdown";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [user, setUser] = useState({}); // probably need to introduce redux for a more global state for this fullstack application.

  function handleCallbackResponse(response) {
    var userObject = jwt_decode(response.credential);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;

    // test if email is already in use, then add user if not
    addNewUser(userObject.given_name, userObject.email);
    // addNewVerse(userObject.email, "John", 3, false, "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.", 16, 16, 0);
  }

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

  let elementArray = ["Book", "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"];
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
      <StickyTitleDropdown
        value={elementArray} />
    </div>
  );
}

export default App;
