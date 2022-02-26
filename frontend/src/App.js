//React Modlue
import react from 'react';
// Routing Modules
import { Outlet } from 'react-router-dom';
// Stylesheet
import './App.css';

class App extends react.Component {
  render(){
    return (
      <div className="app" >
        <Outlet />
      </div>
    );
  }
}

export default App;
