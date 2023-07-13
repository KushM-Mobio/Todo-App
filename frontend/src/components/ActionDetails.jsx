import { useParams } from "react-router-dom";
import "../css/actiondetails.css";
import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { BASE_URL } from "../constants";

const ActionDetails = ({}) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('');
  const [todoDate, setTodoDate] = useState({
    date: "",
    dueDate: "",
  });
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  let config = {
    headers: {
      Authorization: "token de1135a86424642:196b91c7ed9349b",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/resource/Action/${name}`,
          config
        );
        console.log({ data });
        setTodoDate({
          date: data?.data?.date,
          dueDate: data?.data?.due_date,
        });
        setTasks(data?.data?.tasks);
        setStatus(data?.data?.status)
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleDelete = async () => {
    const { data } = await axios.put(
      `${BASE_URL}/api/resource/Action/${name}`,
      {
        status: "Archived",
      },
      config
    );

    console.log({ data });
  };

  const handleMarkAsDone = async () => {
    const { data } = await axios.put(
      `${BASE_URL}/api/resource/Action/${name}`,
      {
        status: "Completed",
      },
      config
    );

    console.log({ data });
  };

  const handleCheckboxChange = async (item) => {
    console.log("click");
    console.log(item.is_completed);
    let body = {
      is_completed: 1,
    };
    if (item.is_completed) {
      body.is_completed = 0;
    }
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/resource/Action Task/${item.name}`,
        body,
        config
      );
      console.log("api ", data);
      if (item.is_completed) {
        const updatedTasks = tasks.map((task) =>
          task.name === item.name ? { ...task, is_completed: 0 } : task
        );
        setTasks(updatedTasks);
      } else {
        const updatedTasks = tasks.map((task) =>
          task.name === item.name ? { ...task, is_completed: 1 } : task
        );
        setTasks(updatedTasks);
      }
    } catch (error) {}
  };

  console.log("hello ", todoDate.date);
  // console.log("task", tasks);

  return (
    <div className="action-container">
      <div className="nav">
        <p className="heading">{name}</p>
        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            startIcon={<ArrowBackIosIcon sx={{ fontSize: "small" }} />}
            onClick={() => {
              navigate("/frontend");
            }}
            style={{backgroundColor: "#334155"}}
          >
            Go Back
          </Button>
          <Button
            className="delete-btn"
            variant="outlined"
            startIcon={
              <DeleteOutlineIcon
                sx={{ fontSize: "small" }}
                style={{ color: "#f17171" }}
              />
            }
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            startIcon={<DoneAllIcon sx={{ fontSize: "small" }} />}
            onClick={handleMarkAsDone}
            style={{borderColor: "#334155", color: "#334155"}}
          >
            Mark as Done
          </Button>
        </Stack>
      </div>

      <div>
        <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>Dates</p>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker", "DatePicker"]}>
            {isLoading ? (
              <>
                <DatePicker
                  className="date-picker"
                  label="Date"
                  // value={value}
                  // onChange={(newValue) => setValue(newValue)}
                />
              </>
            ) : (
              <>
                <DatePicker
                  className="date-picker"
                  label="Date"
                  defaultValue={dayjs(todoDate.date, "YYYY-MM-DD")}
                />
              </>
            )}
            <DatePicker
              className="date-picker"
              label="Due Date"
              // value={value}
              // onChange={(newValue) => setValue(newValue)}
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>

      <div>
        <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>Tasks</p>
        {tasks.length > 0 ? (
          <div>
            {tasks.map((item) => {
              return (
                <div style={{ display: "flex" }} key={item.name}>
                  <Checkbox
                    {...label}
                    onClick={() => handleCheckboxChange(item)}
                    color="default"
                  />
                  <p>{item.description}</p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ActionDetails;
