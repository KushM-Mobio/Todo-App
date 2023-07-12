import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import "../css/todolist.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const TodoList = ({}) => {
  const BASE_URL = "http://127.0.0.1:8080";
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [newAction, setNewAction] = useState({
    title: "",
    category: "",
  });
  const navigate = useNavigate();

  let config = {
    headers: {
      Authorization: "token de1135a86424642:196b91c7ed9349b",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  // const actions = creatListResource({
  //   doctype: "Action",
  //   fields: ["*"],
  //   limit: 10,
  // });

  // console.log({ actions });

  useEffect(() => {
    (async () => {
      try {
        // const response = await getDoc("Action", null);
        const { data } = await axios.get(
          `${BASE_URL}/api/resource/Action?fields=["title", "name", "date", "description", "category", "status", "due_date"]`,
          config
        );
        // console.log(data);
        const array = data?.data;
        setTodos(array);

        const response = await axios.get(
          `${BASE_URL}/api/resource/Category?fields=["name"]`,
          config
        );
        // console.log(response.data);
        setCategory(response?.data?.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleCheckboxChange = async (todo) => {
    console.log(todo.name);
    const { data } = await axios.put(
      `${BASE_URL}/api/resource/Action/${todo.name}`,
      {
        status: "Completed",
      },
      config
    );

    const updatedTodos = todos.map((item) =>
      item.name === todo.name ? { ...item, status: "Completed" } : item
    );

    setTodos(updatedTodos);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setNewAction({
      title: "",
      category: "",
    });
    setOpen(false);
  };

  // const handleMenuClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // };

  const handleActionBtn = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/resource/Action`,
        {
          title: newAction.title,
          category: newAction.category,
        },
        config
      );

      // console.log(data.data)
      // console.log("hello",data.data.category)

      const obj = {
        category: data?.data?.category,
        name: data?.data?.name,
        title: data?.data?.title,
        date: data?.data?.date,
        due_date: data?.data?.due_date,
        status: data?.data?.status,
        description: data?.data?.description,
      };
      console.log({ obj });
      setTodos([...todos, obj]);
      toast.success("New Action Added");
    } catch (error) {
      console.log(error);
    }
    is_completed;
    handleClose();
  };

  const handleAction = (name) => {
    console.log(name);
    navigate(`/actionDetails/${name}`);
  };

  // console.log(todos);
  // console.log(category);
  // console.log({ newAction });

  return (
    <>
      <div className="main-container">
        <div className="nav">
          <p style={{ fontSize: "2rem", fontWeight: "600", color: "#212121" }}>
            List
          </p>
          <Button style={{ backgroundColor: "#334155" }} variant="contained">
            + New List
          </Button>
        </div>

        <div
          style={{
            // border: "1px solid black",
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            padding: "2rem",
            borderRadius: "4px",
          }}
        >
          {category.map((item) => {
            return (
              <Card
                key={item.name}
                className="cart"
                style={{ backgroundColor: "#e0e0e0", width: "275px " }}
                // sx={{ maxWidth: 275 }}
              >
                <CardContent>
                  <p style={{ textAlign: "center", fontSize: "1.5rem" }}>
                    {item.name}
                  </p>
                  {todos.length > 0 ? (
                    <div
                      style={{
                        justifyContent: "space-between",
                        width: "100%",
                        overflow: "auto",
                        height: "10rem",
                        scrollbarWidth: "thin",
                        scrollbarColor: "transparent transparent",
                      }}
                    >
                      {todos.map((todo) => {
                        return (
                          <div
                            key={todo.name}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            {todo.status === "Todo" &&
                            todo.category === item.name ? (
                              <>
                                <p
                                  style={{
                                    fontWeight: "600",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleAction(todo.name)}
                                >
                                  {todo.title}
                                </p>
                                <Checkbox
                                  {...label}
                                  checked={todo.status === "Completed"}
                                  onChange={() => handleCheckboxChange(todo)}
                                  color="default"
                                />
                              </>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <CircularProgress />
                    </div>
                  )}
                </CardContent>
                <CardActions className="cart-action">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleClickOpen}
                    style={{
                      position: "absolute",
                      bottom: "15px",
                      left: "15px",
                      backgroundColor: "#334155",
                    }}
                  >
                    + New Action
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </div>
        <Dialog
          style={{ color: "#e0e0e0" }}
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Add New Action"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <TextField
                  id="outlined-basic"
                  label="Title"
                  value={newAction.title}
                  onChange={(ev) =>
                    setNewAction({ ...newAction, title: ev.target.value })
                  }
                  variant="filled"
                />
                <div style={{ marginTop: "1rem" }}></div>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={newAction.category}
                    onChange={(ev) =>
                      setNewAction({ ...newAction, category: ev.target.value })
                    }
                    label="Category"
                  >
                    {category.map((item) => {
                      return (
                        <MenuItem key={item.name} value={item.name}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button style={{color: '#334155'}} onClick={handleClose}>Cancle</Button>
            <Button style={{color: '#334155'}} onClick={handleActionBtn} >
              Add Action
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <ToastContainer />
    </>
  );
};

export default TodoList;
