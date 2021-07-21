import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import PhoneInput from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';

import { useEffect, useRef, useState, useContext } from 'react';
import {auth, firestore} from "./firebaseSetup";
import { Button } from "react-bootstrap";
import 'react-json-pretty/themes/monikai.css';
import { AuthContext } from './context/AuthContext';
import { useCollectionData } from 'react-firebase-hooks/firestore';


interface AuthProps {
  children: React.ReactNode
}
export const AuthWrap: React.FC<AuthProps> = ({ children }) => {
  const user = useContext(AuthContext);
  const [isAdmin, setAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    const query:any = firestore.collection('whitelist').doc(user?.uid).get().then((doc)=>{
      if (doc.exists) {
        setAdmin(true)
      } else {
        console.log("not logged in or logged in as wrong user")
        setAdmin(false)
      }
    return query;
  }).catch((error) => {
    console.log("error", error);
  })}
  , [user]);
  return (
    <>
    {isAdmin
    ? <><SignOut />{children}</>
    : <div className="App"><header className="App-header"><SignIn /><SignOut /></header></div>
    }
    </>
  )
}

function SignOut() {
  return (
    <Button onClick={()=>{auth.signOut()}}>Sign Out</Button>
  )
}
function SignIn() {
  const [recaptcha, setRecaptcha] = useState<firebase.auth.RecaptchaVerifier|null>(null);
  const element = useRef(null);

  useEffect(() => {
    if (!recaptcha) {

      const verifier = new firebase.auth.RecaptchaVerifier(element.current, {
        size: 'invisible',
      })

      verifier.verify().then(() => setRecaptcha(verifier));

    }
  });

  return (
    <>
      {recaptcha && <PhoneNumberVerification recaptcha={recaptcha} />}
      <div ref={element}></div>
    </>
  );
}
interface CaptchaProps {
  recaptcha: firebase.auth.RecaptchaVerifier;
}

const PhoneNumberVerification: React.FC<CaptchaProps> = ({recaptcha}) => {
  const [digits, setDigits] = useState<string>('');
  const [confirmationResult, setConfirmationResult] = useState<firebase.auth.ConfirmationResult | null>(null);
  const [code, setCode] = useState('');

  const phoneNumber = `${digits}`;
  

  // Sign in
  const signInWithPhoneNumber = async () => {
    setConfirmationResult( await auth.signInWithPhoneNumber(phoneNumber, recaptcha) );
  };

  // Verify SMS code
  const verifyCode = async () => {
    if (confirmationResult){
      const result = await confirmationResult.confirm(code);
      console.log(result.user);
    }
    
  };

  return (
    <div>
      <h1>Sign In</h1>
      <fieldset>
        <label>10 digit US phone number</label>
        <br />
        <PhoneInput
          country="US"
          placeholder="enter phone number"
          value={digits}
          onChange={(e) => {
            if (e !== undefined) {
              setDigits(e);
            }
          }}
        />

        <button onClick={signInWithPhoneNumber}>Sign In</button>
      </fieldset>

      {confirmationResult && (
        <fieldset>
          <label>Verify code</label>
          <br />
          <input value={code} onChange={(e) => setCode(e.target.value)} />

          <button onClick={verifyCode}>Verify Code</button>
        </fieldset>
      )}
    </div>
  );
}