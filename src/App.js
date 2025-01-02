import logo from './logo.svg';
import './App.css';
import Profiles from './Profiles';
import NavBar from './NavBar';


function App() {
  return (
    <div className="App">
      <NavBar/>
      <div className='Home'>
      <Profiles/>
      </div>
    </div>
  );
}

export default App;
