import logo from './logo.svg';
import './App.css';
import NorthwesternImage from './assets/northwestern.jpg'



function App() {
  return (
    <div className="App">
      <h1>Welcome to friend-matching!</h1>
      <h4>Finding friends at college can be hard but we're here to help you. 
        By creating account on this platform, you can look through the profiles of other registered students
        and get in touch with the ones you have shared interests with.</h4>
      <p>While the platform is meant to be fun, please be considerate of others and do not engage in disruptive, rude, or offensive behavior.</p>
      <img 
        className = "icons"
        src={NorthwesternImage}
        alt={`A photo shows Northwestern campus.`}
      />
    </div>
  );
}

export default App;
