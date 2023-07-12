import { FrappeProvider } from "frappe-react-sdk";
import TodoList from "./components/TodoList";
import "./app.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ActionDetails from "./components/ActionDetails";

function App() {
  return (
    <FrappeProvider socketPort={import.meta.env.VITE_SOCKET_PORT ?? ""}>
      <Router>
        <Routes>
          <Route exact path="/" element={<TodoList />}></Route>
          <Route
            exact
            path="/actionDetails/:name"
            element={<ActionDetails />}
          ></Route>
        </Routes>
      </Router>
    </FrappeProvider>
  );
}

export default App;
