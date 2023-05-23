import './App.css';
import ParticlesBg from 'particles-bg';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

import { useState } from 'react';

function App() {
  const returnClarifaiRequestOptions = (imageUrl) => {
    const PAT = '299461869b194061b9061a2378672d8f';
    const USER_ID = 'oa791lx2doo5';
    const APP_ID = 'smartBrain';
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
            },
          },
        },
      ],
    });
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Key ' + PAT,
      },
      body: raw,
    };

    return requestOptions;
  };

  const [input, setInput] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signIn');
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleRouteChange = (route) => {
    if (route === 'signOut') {
      setIsSignedIn(false);
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
    setRoute(route);
  };
  const calcFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };
  const displayFaceBox = (box) => {
    setBox(box);
    console.log(box);
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  const handleBtnSubmit = () => {
    setImgUrl(input);

    fetch(
      `https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`,
      returnClarifaiRequestOptions(input),
    )
      .then((response) => response.json())
      .then((result) => displayFaceBox(calcFaceLocation(result)))
      .catch((error) => console.log('error', error));
  };

  return (
    <div className="App">
      <ParticlesBg
        className="particles"
        color="#ffffff"
        num={120}
        type="cobweb"
        bg={true}
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange={handleRouteChange} />
      {route === 'home' ? (
        <>
          <Logo />
          <Rank />
          <ImageLinkForm
            inputValue={input}
            onInputChange={handleInputChange}
            onBtnSubmit={handleBtnSubmit}
          />
          <FaceRecognition box={box} imgUrl={imgUrl} />
        </>
      ) : route === 'signIn' ? (
        <SignIn onRouteChange={handleRouteChange} />
      ) : (
        <Register onRouteChange={handleRouteChange} />
      )}
    </div>
  );
}

export default App;
