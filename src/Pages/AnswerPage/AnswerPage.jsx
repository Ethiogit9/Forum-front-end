import Avatar from "@mui/material/Avatar";
import { FaCircleUser } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { useParams, Link } from "react-router-dom";
import axios from "../../utility/axios";
import style from "./AnswerPage.module.css";
import { useState, useEffect, useContext } from "react";
import { AppState } from "../../App";
import LayOut from "../../Component/LayOut/LayOut";
const ITEMS_PER_PAGE = 4;
function AnswerPage() {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState({});
  const { question_id } = useParams();
  const { user } = useContext(AppState);
  const [message, setMessage] = useState("");
  const [messageColor, setmessageColor] = useState("green");
  const [answers, setAnswers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // console.log(question_id)
  // console.log(user.userid)
  const token = localStorage.getItem("token");
  async function getQuestion() {
    try {
      //   const { data } = await axios.get(`/api/question/${question_id}`);

      console.log(question_id);

      const { data } = await axios.get(
        `/api/question/${question_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the JWT token
          },
        } // Config object for headers
      );
      console.log(data.singleQuestion);
      setQuestion(data.singleQuestion);

      console.log(data);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  }
  async function getAnswer() {
    try {
      const { data } = await axios.get(
        `/api/answer/${question_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the JWT token
          },
        } // Config object for headers
      );
      setAnswers(data.answers);
      console.log(data);
      console.log(data.answers);
    } catch (error) {
      console.error("Error fetching answer:", error);
    }
  }
  useEffect(() => {
    async function fetchData() {
      await getQuestion();
      await getAnswer();
    }
    fetchData();
  }, [question_id, token]);
  console.log(question);
  console.log(answers);
  // State for storing the answer input

  // Handle the change in the textarea
  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  // Function to post the answer
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answer.trim() === "") {
      setmessageColor("red");
      setMessage("Please provide an answer.");
      return;
    }
    const token = localStorage.getItem("token");
    // const user_id = user.user_id;
    console.log("User from context:", user);

    try {
      // POST request using axios to senddd the answer to the backend (Assumed API endpoint)
      const { data } = await axios.post(
        "/api/answer",
        {
          question_id,
          content: answer, // ✅ renamed to 'content' as expected by backend
          // user_id,
        },
        // Data payload
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the JWT token
          },
        }
      );
      console.log(data.message);
      setmessageColor("green");
      setMessage(data.message);
      getAnswer();
      setAnswer("");
    } catch (error) {
      console.error("There was an error posting the answer:", error);
      setmessageColor("red");
      setMessage("Error posting the answer");
    }
  };
  const totalPages = Math.ceil(answers?.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentanswers = answers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  return (
    <LayOut>
      <div className={style.outer_container}>
        <div className={style.container}>
          <section className={style.question_section}>
            <h3>Question</h3>
            <p>
              <strong>{question[0]?.title}</strong>
            </p>
            <p>
              <small>{question[0]?.description}</small>
            </p>
          </section>

          <section className={style.community_answer}>
            <h2>Answer From The Community </h2>
            <div className={style.answer_container}>
              {currentanswers?.map((answer) => (
                <>
                  <div className={style.answer}>
                    <div className={style.user_avatar}>
                      <FaCircleUser className={style.userIcon} size={60} />
                      <small>{answer.username}</small>
                    </div>
                    <div className={style.answer_detail}>
                      <p>{answer.content}</p>
                    </div>
                  </div>
                  <hr />
                </>
              ))}
            </div>
            <div className={style.pagination}>
              <button onClick={prevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                {" "}
                Page {currentPage} of {totalPages}{" "}
              </span>
              <button onClick={nextPage} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </section>

          <section className={style.answer_form}>
            <h3>Answer The Top Question</h3>
            <Link to="/home">Go to Question page</Link>
            <form onSubmit={handleSubmit}>
              <textarea
                value={answer}
                onChange={handleAnswerChange}
                placeholder="Your Answer..."
                rows="6"
                name="answer"
              ></textarea>
              <button type="submit">Post Your Answer</button>
            </form>
            {message && <p style={{ color: messageColor }}>{message}</p>}
          </section>
        </div>
      </div>
    </LayOut>
  );
}

export default AnswerPage;
