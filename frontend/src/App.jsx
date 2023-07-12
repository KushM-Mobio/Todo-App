import { FrappeProvider } from "frappe-react-sdk";
import TodoList from "./components/TodoList";
import "./app.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ActionDetails from "./components/ActionDetails";
import CalenderView from "./components/CalenderView";

function App() {
  return (
    <FrappeProvider socketPort={import.meta.env.VITE_SOCKET_PORT ?? ""}>
      <Router>
        <Routes>
          <Route exact path="/frontend" element={<TodoList />}></Route>
          <Route
            exact
            path="/actionDetails/:name"
            element={<ActionDetails />}
          ></Route>
          <Route
            exact
            path="/calenderview"
            element={<CalenderView />}
          ></Route>
        </Routes>
      </Router>
    </FrappeProvider>
  );
}

export default App;
