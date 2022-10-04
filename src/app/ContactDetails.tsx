import { useState } from "react"
import axios from "axios"
import "./style/contact-details.scss"

export default (): JSX.Element => {
  const [requestState, setRequestState] = useState("initial")
  const [requestError, setRequestError] = useState(null)
  const [emailAddress, setEmailAddress] = useState("")

  const onSubmit = async () => {
    try {
      setRequestError(null)
      setRequestState("in-progress")
      await axios.post("/api/add-contact", {
        emailAddress,
      })
      setRequestState("success")
    } catch (err: any) {
      setRequestState("error")
      setRequestError(err.response.data)
    }
  }

  return (
    <>
      <div id="contact-details">
        <div className="instructions">Please leave your email address</div>
        <div>
          <input
            type="email"
            placeholder="email address"
            value={emailAddress}
            onChange={(event) => setEmailAddress(event.target.value)}
          ></input>
          {requestState === "error" ? (
            <div className="error">{requestError}</div>
          ) : null}
        </div>
        <div className="buttonContainer">
          <button onClick={onSubmit}>Notify me</button>
          {requestState === "in-progress" ? <div>Sending...</div> : null}
          {requestState === "success" ? <div>Done!</div> : null}
        </div>
      </div>
    </>
  )
}
