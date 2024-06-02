import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Modal from "./Modal";
import Loading from "./Loading";

const MyGrievance = (props) => {
  const token = localStorage.getItem("token");
  // const BASE_URL="http://localhost:5000/api/v1"
  const BASE_URL="https://ai-based-grievance-portal.onrender.com/api/v1"

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${BASE_URL}/complaints`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [grievances, setGrievances] = useState([]);
  grievances.sort((a, b) =>
    a.status > b.status ? 1 : b.status > a.status ? -1 : 0
  );

  useEffect(() => {
    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        setGrievances(response.data.complaints);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  const [actionHistory, setActionHistory] = useState();

  const handleAction = (grievance) => {
    setActionHistory(grievance.actionHistory);
    setIsVisible((prev) => !prev);
  };

  const handleReopen = (id) => {
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/complaints/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        alert("Reopened Successfully");
        window.location.reload(true);
      })
      .catch((error) => {
        console.log(error);
        alert("Error Occurred in my grievance");
      });
  };

  const handleReminder = (id) => {
    setLoading(true);
    let config2 = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/complaints/reminder/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(config2)
      .then((response) => {
        setLoading(false);
        alert("Reminder Sent Successfully");
        window.location.reload(true);
      })
      .catch((error) => {
        console.log(error);
        alert("Error Occurred");
      });
  };

  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(-1);

  const changeRating = (e) => {
    setRating(e.target.value);
  };

  console.log("rating", rating);

  const handleRating = (id) => {
    if (rating === -1) {
      alert("Rating not given");
    } else {
      setLoading(true);

      let config3 = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `${BASE_URL}/complaints/rateOfficer/${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { rating: rating },
      };

      axios
        .request(config3)
        .then((response) => {
          // console.log(JSON.stringify(response.data));
          alert("Rating submitted");
          window.location.reload(true);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    }
  };

  const handleDelete = (id) => {
    setLoading(true);
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/complaints/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        alert("Deleted Successfully");
        setLoading(false);
        window.location.reload(true);
      })
      .catch((error) => {
        console.log(error);
        alert("Error Occurred");
        setLoading(false);
      });
  };

  const grievanceData = grievances.map((grievance) => (
    <Fragment key={grievance._id}>
      <tr
        className={
          grievance.status !== "resolved"
            ? grievance.status === "pending"
              ? "bg-red"
              : "bg-yellow"
            : "bg-green"
        }
      >
        <td className="px-4 py-3 text-ms font-semibold border">
          {moment(grievance.createdAt).format("DD/MM/YYYY HH:mm")}
        </td>
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.department}
        </td>
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.subject}
        </td>
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.status}
        </td>

        {/***set reminder if its been 7 days or more from lastreminded day */}
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.status !== "resolved" ? (
            grievance.lastRemindedAt == null ||
            new Date().getDate() -
              new Date(grievance.lastRemindedAt).getDate() >
              7 ? (
              <>
                <button
                  className="bg-light-green hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleReminder(grievance._id)}
                >
                  reminder
                </button>
                {loading && <Loading />}
              </>
            ) : (
              `Cooldown for ${
                7 -
                (new Date().getDate() -
                  new Date(grievance.lastRemindedAt).getDate())
              } more days`
            )
          ) : (
            "resolved"
          )}
        </td>
        <td className="px-4 py-3 text-ms font-semibold border">
          <button
            className="bg-light-green hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAction(grievance)}
          >
            View
          </button>
          <Modal
            visible={isVisible}
            setVisible={setIsVisible}
            data={actionHistory}
          />
        </td>
        {/***when grievance is resolved and is not rated only then we can reopen it  */}
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.status === "resolved" && grievance.isRated === false && (
            <button
              className="bg-light-green hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleReopen(grievance._id)}
            >
              Reopen
            </button>
          )}
        </td>

        {/** if not resolved then we are working on it... if resolved and rated means thanks or else  */}
        {/*if not resolved but not rated the rate it */}
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.status === "resolved" && grievance.isRated === false ? (
            <form className="flex justify-evenly">
              <select
                name="rating"
                id="rating"
                value={rating}
                className="rounded-2xl"
                onChange={changeRating}
              >
                <option value="">--Rate--</option>
                <option value={1}>1 Star</option>
                <option value={2}>2 Star</option>
                <option value={3}>3 Star</option>
                <option value={4}>4 Star</option>
                <option value={5}>5 Star</option>
              </select>
              <button
                className="bg-light-green hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 "
                onClick={() => handleRating(grievance._id)}
              >
                Rate
              </button>
            </form>
          ) : grievance.status === "resolved" && grievance.isRated === true ? (
            "Thank you for your feedback"
          ) : (
            "We are working on it"
          )}
        </td>
        <td className="px-4 py-3 text-ms font-semibold border">
          {grievance.status !== "resolved" && (
            <button
              className="bg-light-green hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleDelete(grievance._id)}
            >
              Delete
            </button>
          )}
        </td>
      </tr>
    </Fragment>
  ));

  const checkLogin = () => {
    if (!token) {
      navigate("/userAdminLogin");
    }
  };

  return (
    <>
      {checkLogin()}
      <div
        className={
          props.visible === "view"
            ? "p-4 view-grievance dashboard w-full md:w-3/4 h-100  pt-10  "
            : "hidden"
        }
      >
        <h1 className="text-center text-4xl md:text-7xl font-semibold">
          MY GRIEVANCES
        </h1>
        <section className="container mx-auto font-mono flex justify-center">
          <div className=" pt-4 mb-8 overflow-y-scroll overflow-x-scroll h-120  mt-4 border-2 shadow-2xl rounded-xl p-6 overflow-hidden w-11/12 md:w-5/6">
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Grievance</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Reminder</th>
                    <th className="px-4 py-3 mx-auto">View Action History</th>
                    <th className="px-4 py-3 mx-auto">Reopen</th>
                    <th className="px-4 py-3 mx-auto">Give Rating</th>
                    <th className="px-4 py-3 mx-auto">Delete Complaint</th>
                  </tr>
                </thead>
                <tbody className="bg-white">{grievanceData}</tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MyGrievance;
