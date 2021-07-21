import { useEffect, useRef, useState, useContext } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {auth, firestore} from "./firebaseSetup";
import { Button } from "react-bootstrap";
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import { AuthContext } from './context/AuthContext';


function App() {
  const user = useContext(AuthContext);
  return (
    <div className="App">
      <p>this is app content</p>
      <JSONPretty id="json-pretty" data={user} />
    </div>
  );
}

export default App;
