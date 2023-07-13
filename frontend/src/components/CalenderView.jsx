import { Badge, Calendar, Modal, DatePicker, Input } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../constants";
import "../css/calenderview.css";
import moment from "moment";

const CalendarView = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [addMeetingRoom, setMeetingRoom] = useState({
    meetingFrom: null,
    meetingTo: null,
    meetingTopic: "",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [count, setCount] = useState(0)

  let config = {
    headers: {
      Authorization: "token de1135a86424642:196b91c7ed9349b",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/api/resource/meeting-room?fields=["name", "meeting_from", "meeting_to", "meeting_topic"]`,
          config
        );
        setAppointments(response.data.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleOk = async () => {
    console.log("clicked");
    setEndDate(null);
    setStartDate(null);
    setMeetingRoom({
      meetingFrom: null,
      meetingTo: null,
      meetingTopic: "",
    });
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/resource/meeting-room/`,
        {
          meeting_from: addMeetingRoom.meetingFrom,
          meeting_to: addMeetingRoom.meetingTo,
          meeting_topic: addMeetingRoom.meetingTopic,
        },
        config
      );
      console.log(data);
      const newMeeting = {
        name: data?.data?.name,
        meeting_to: data?.data?.meeting_to,
        meeting_from: data?.data?.meeting_from,
        meeting_topic: data?.data?.meeting_topic
      }
      setAppointments([...appointments, newMeeting])
    } catch (error) {
      console.log(error);
    }

    // console.log({ addMeetingRoom });
    // setCount(count => count+1)
    setModalVisible(false);
  };

  const dateCellRender = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    const filteredAppointments = appointments.filter((appointment) =>
      appointment.meeting_from.startsWith(formattedDate)
    );

    // console.log({ appointments });

    return (
      <ul className="events">
        {filteredAppointments.map((appointment) => (
          <li key={appointment.id} style={{ listStyleType: "none" }}>
            <Badge
              status="success"
              text={
                <>
                  <div>{appointment.meeting_topic}</div>
                  <div>
                    {moment(appointment.meeting_from).format("HH:mm")} -{" "}
                    {moment(appointment.meeting_to).format("HH:mm")}
                  </div>
                </>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Calendar
            dateCellRender={dateCellRender}
            onSelect={handleDateSelect}
          />
          <Modal
            style={{ marginTop: "-80px" }}
            title={`Appointments for ${selectedDate?.format("YYYY-MM-DD")}`}
            visible={isModalVisible}
            onCancel={() => setModalVisible(false)}
            onOk={handleOk}
          >
            {/* Render your form here */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p>Meeting from</p>
                <DatePicker
                  className="date-picker custom-placement"
                  showTime
                  value={startDate}
                  onChange={(data) => {
                    const formatedDate = moment(data?.$d).format(
                      "YYYY-MM-DD HH:mm:ss"
                    );
                    setStartDate(data);
                    setMeetingRoom({
                      ...addMeetingRoom,
                      meetingFrom: formatedDate,
                    });
                  }}
                />
              </div>
              <div>
                <p>Meeting end</p>
                <DatePicker
                  className="date-picker"
                  showTime
                  value={endDate}
                  onChange={(data) => {
                    const formatedDate = moment(data?.$d).format(
                      "YYYY-MM-DD HH:mm:ss"
                    );
                    setEndDate(data);
                    setMeetingRoom({
                      ...addMeetingRoom,
                      meetingTo: formatedDate,
                    });
                  }}
                />
              </div>
            </div>
            <p>Meeting topic</p>
            <Input
              placeholder="Enter Meeting Topic"
              value={addMeetingRoom.meetingTopic}
              onChange={(ev) =>
                setMeetingRoom({
                  ...addMeetingRoom,
                  meetingTopic: ev.target.value,
                })
              }
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default CalendarView;
