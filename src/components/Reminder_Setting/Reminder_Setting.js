import React, { useState, useEffect } from "react";
import { postReminder } from "../../services/addFile/Reminder.js/Reminder";
import "./Reminder_Setting.css";
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from "react-redux";
const ReminderSetting = () => {
  const [data, setData] = useState([])
  const [email, setEmail] = useState([])
  const [phone, setPhone] = useState([])
  const [officerEmail, setOfficerEmail] = useState([])
  const [officerPhone, setOfficerPhone] = useState([])
  const [shareholderName, setShareholderName] = useState([])
  const [officerNames, setOfficerNames] = useState([])



  const reminder = useSelector((state) => state.data)
  useEffect(() => {
    setData(reminder)
  }, [reminder])

  let id = localStorage.getItem("fileId")
  const [steps, setSteps] = useState('1');
  const [counter, setCounter] = useState(0)
  const [allData, setAllData] = useState({
    shareHoldersArray: [{ email: email }, { phone: phone }, { shareholderName: shareholderName }],
    officersArray: [{ officersEmail: officerEmail }, { officerPhone: officerPhone }, { officerNames: officerNames }],
    firstReminder: '',
    secondReminder: '',
    finalReminder: '',
    income: false,
    annual: false,
    fillingData: '',
    addedPeople: [],
    fileId: id
  })

  console.log("allData", allData)

  const handleAddInput = (e) => {
    e.preventDefault();
    setCounter(counter + 1)
  }

  const handleRemoveInput = (e) => {
    e.preventDefault();
    if (counter !== 0)
      setCounter(counter - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    postReminder(allData).then((res) => {
      console.log("res", res)
      toast.success("Reminder Set Successfully", {
        position: toast.POSITION.TOP_CENTER,
        theme: "colored"
      })
      setTimeout(() => {
        localStorage.removeItem("fileId")
      }, 5000);
    })
      .catch((e) => console.log(e))

  }

  const handleChangeEmail = (event, index) => {
    const { value } = event.target;
    const list = [...email];
    list[index] = value;
    setEmail(list);
    setAllData({
      ...allData,
      shareHoldersArray: [{ email: list }, { phone: phone }]
    })

  }

  const handleChangePhone = (event, index) => {
    let { value } = event.target;
    const list = [...phone];
    list[index] = value;
    setPhone(list);
    setAllData({
      ...allData,
      shareHoldersArray: [{ email: email }, { phone: list }]
    })
  }

  const handleChangeOfficerEmail = (event, index) => {
    const { value } = event.target;
    const list = [...officerEmail];
    list[index] = value;
    setOfficerEmail(list);
    setAllData(
      {
        ...allData,
        officersArray: [{ officersEmail: list }, { officerPhone: officerPhone }]
      }
    )
  }

  const handleChangeOfficerPhone = (event, index) => {
    let { value } = event.target;
    const list = [...officerPhone];
    list[index] = value;
    setOfficerPhone(list);
    setAllData(
      {
        ...allData,
        officersArray: [{ officersEmail: officerEmail }, { officerPhone: list }]
      }
    )
  }

  const handleChangeShareholderName = (event, index) => {
    let { value } = event.target;
    const list = [...shareholderName];
    list[index] = value;
    setShareholderName(list);
    setAllData(
      {
        ...allData,
        shareHoldersArray: [{ shareholderName: list }, { officerPhone: officerPhone }, { officersEmail: officerEmail }
        ]
      }
    )
  }

  const handleChangeOfficerNames = (event, index) => {
    let { value } = event.target;
    const list = [...officerNames];
    list[index] = value;
    setOfficerNames(list);
    setAllData(
      {
        ...allData,
        officersArray: [{ officerNames: list }, { officersEmail: officerEmail }, { officerPhone: officerPhone }]
      }
    )
  }





  return (
    <div className="main_dev">
      {
        steps === '1' ? (
          <form className="card card-1" id="first__form">
            <h4 className="text-center">Choose service to remind</h4>

            <div className="form-group d-flex justify-content-between mt-4">
              <label htmlFor="exampleInputEmail1">1. ECI and CIT filings</label>
              <input type="checkbox" className="form-check-input" id="exampleCheck1"
                checked={
                  allData.income
                }
                onChange={(e) => {
                  setAllData({
                    ...allData,
                    income: e.target.checked
                  })

                }} />

            </div>
            <div className="form-group d-flex justify-content-between mt-4">
              <label htmlFor="exampleInputPassword1">2. Annual Filling</label>
              <input type="checkbox" className="form-check-input" id="exampleInputPassword1"
                checked={
                  allData.annual
                }
                onChange={(e) => {
                  setAllData({
                    ...allData,
                    annual: e.target.checked
                  })
                }} />
            </div>
            {
              allData.income || allData.annual ? (
                <div>
                  <div className="form-group  mt-4">
                    <label htmlFor="exampleInputEmail1">What is your filling Date</label>
                    <input type="date" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                      onChange={(e) => {
                        setAllData({
                          ...allData,
                          fillingData: e.target.value
                        })
                      }
                      }
                      value={allData.fillingData}
                    />
                  </div>
                </div>
              ) : null

            }
            <div className="text-center mt-5">
              <button disabled={
                !allData.income && !allData.annual
              } className="btn btn-primary" onClick={() => {
                setSteps('2')
              }}>Next</button>

            </div>
          </form>

        ) : null
      }
      {
        steps === '2' ? (
          <div>
            <form className="card card-1" id="second__form">
              <h5 className="text-center">Choose Director/Shareholders</h5>
              {
                data?.formData.map((item, index) => {
                  let shareHoldersArray = [];
                  shareHoldersArray.push(
                    item.ShareholderName !== "" || undefined ? item.ShareholderName : '',
                    item.ShareholderName1 !== "" || undefined ? item.ShareholderName1 : '',
                    item.ShareholderName2 !== "" || undefined ? item.ShareholderName2 : '',
                    item.ShareholderName3 !== "" || undefined ? item.ShareholderName3 : '',
                    item.ShareholderName4 !== "" || undefined ? item.ShareholderName4 : '',

                  )
                  return (
                    shareHoldersArray.map((item, index) => {
                      //if item value is undeifned then stop the excetuin
                      if (item === undefined) {
                        return null
                      } else {

                        return (
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group mt-3">
                                <label htmlFor="exampleInputEmail1">Name (Shareholder)</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="exampleInputEmail1"
                                  aria-describedby="emailHelp"
                                  placeholder="Enter Name"
                                  value={item}
                                  onChange={(e) => {
                                    handleChangeShareholderName(e, index)

                                  }}
                                />

                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group mt-3">
                                <label htmlFor="emailInput">Email</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  id="emailInput"
                                  placeholder="Enter your email"
                                  value={
                                    email[index]
                                  }
                                  onChange={(e) => {
                                    handleChangeEmail(e, index)
                                    // setAllData({
                                    //   ...allData,
                                    //   email: e.target.value
                                    // })
                                  }}
                                />
                                <small id="emailInput" className="form-text text-muted">We'll never share your email with anyone else.</small>

                              </div>

                            </div>
                            <div className="col-md-4">
                              <div className="form-group mt-3">
                                <label htmlFor="phoneInput">Phone Number</label>
                                <input
                                  type="tel"
                                  className="form-control"
                                  id="phoneInput"
                                  placeholder="Enter Number With country code"
                                  value={phone[index]}
                                  onChange={(e) => {
                                    handleChangePhone(e, index)
                                  }}
                                />
                                <small id="phoneInput" className="form-text text-muted">Enter Your Phone Number With Country Code.</small>

                              </div>
                            </div>
                          </div>
                        )
                      }
                    })
                  )
                })
              }

              {
                data?.formData.map((item, index) => {
                  let officersArray = [];
                  officersArray.push(
                    item.officersName1 !== "" || undefined ? item.officersName1 : '',
                    item.officersName2 !== "" || undefined ? item.officersName2 : '',
                    item.officersName3 !== "" || undefined ? item.officersName3 : '',
                    item.officersName4 !== "" || undefined ? item.officersName4 : '',
                    item.officersName5 !== "" || undefined ? item.officersName5 : '',

                  )
                  return (
                    officersArray.map((item, index) => {
                      if (item === undefined) {
                        return null
                      } else {

                        return (
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group mt-3">
                                <label htmlFor="exampleInputEmail1">Name (Officers)</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="exampleInputEmail1"
                                  aria-describedby="emailHelp"
                                  placeholder="Enter Name"
                                  value={item}
                                  onChange={(e) => {
                                    handleChangeOfficerNames(e, index)
                                  }}
                                />

                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group mt-3">
                                <label htmlFor="emailInput">Email</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  id="emailInput"
                                  placeholder="Enter your email"
                                  value={officerEmail[index]}
                                  onChange={(e) => {
                                    handleChangeOfficerEmail(e, index)
                                  }}
                                />
                                <small id="emailInput" className="form-text text-muted">We'll never share your email with anyone else.</small>

                              </div>

                            </div>
                            <div className="col-md-4">
                              <div className="form-group mt-3">
                                <label htmlFor="phoneInput">Phone Number</label>
                                <input
                                  type="tel"
                                  className="form-control"
                                  id="phoneInput"
                                  placeholder="Enter Number With country code"
                                  value={officerPhone[index]}
                                  onChange={(e) => {
                                    handleChangeOfficerPhone(e, index)
                                  }}
                                />
                                <small id="phoneInput" className="form-text text-muted">Enter Your Phone Number With Country Code.</small>

                              </div>
                            </div>
                          </div>
                        )
                      }
                    })
                  )
                })
              }









              {/* <div className="form-group mt-3">
                <label htmlFor="exampleInputEmail1">Name (Shareholder)</label> */}
              {/* {
                  data.formData.map((item, index) => {
                    let namesArr = []
                    namesArr.push(item.ShareholderName,
                      item.ShareholderName1,
                      // item.ShareholderName2,
                      // item.ShareholderName3,
                      // item.ShareholderName4,
                      item.officersName1,
                      item.officersName2,
                      item.officersName3,
                      // item.officersName4,
                      // item.officersName5,
                    )
                    return (
                      namesArr.map((item, index) => {
                        return (
                          <div key={index}>
                            <input
                              type="text"
                              className="form-control"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                              placeholder="Enter Name"
                              value={item}
                              onChange={(e) => {
                                setAllData({
                                  ...allData,
                                  shareHolderName: { name: e.target.value }
                                })
                              }}
                            />
                          </div>
                        )
                      }
                      )
                    )
                  })
                } */}
              {/* <input
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter Name"
                  onChange={(e) => {
                    setAllData({
                      ...allData,
                      shareHolderName: { name: e.target.value }
                    })
                  }}
                />

              </div> */}
              {
                Array.from({ length: counter }, (_, index) => {
                  return (
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group mt-3">
                          <label htmlFor="exampleInputEmail1">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Enter Name"
                          // value={item}
                          // onChange={(e) => {
                          //   handleChangeShareholderName(e, index)

                          // }}
                          />

                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mt-3">
                          <label htmlFor="emailInput">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="emailInput"
                            placeholder="Enter your email"
                          // value={
                          //   email[index]
                          // }
                          // onChange={(e) => {
                          //   handleChangeEmail(e, index)
                          //   // setAllData({
                          //   //   ...allData,
                          //   //   email: e.target.value
                          //   // })
                          // }}
                          />
                          <small id="emailInput" className="form-text text-muted">We'll never share your email with anyone else.</small>

                        </div>

                      </div>
                      <div className="col-md-4">
                        <div className="form-group mt-3">
                          <label htmlFor="phoneInput">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phoneInput"
                            placeholder="Enter Number With country code"
                          // value={phone[index]}
                          // onChange={(e) => {
                          //   handleChangePhone(e, index)
                          // }}
                          />
                          <small id="phoneInput" className="form-text text-muted">Enter Your Phone Number With Country Code.</small>

                        </div>
                      </div>
                    </div>
                  )
                }
                )
              }

              {
                counter > 0 && (
                  <button className="btn btn-info btn-sm" onClick={handleRemoveInput}>Remove</button>
                )

              }

              <div className="d-flex flex-row-reverse
 mt-5" style={{ gap: "4rem" }}>

                <button disabled={
                  !allData.shareHoldersArray
                } className="btn btn-primary" onClick={() => {
                  setSteps('3')
                }}>Next</button>
                <button className="btn btn-danger ml-3" onClick={() => {
                  setSteps('1')
                }}>Back</button>
                <button
                  className="btn btn-success ml-3"
                  onClick={handleAddInput}
                >
                  Add More People
                </button>
              </div>
            </form>
          </div>

        ) : null
      }
      {
        steps === '3' ? (
          <div>
            <form className="card card-1" id="second__form" onSubmit={handleSubmit}>
              <h5 className="text-center">Choose Reminder settings
              </h5>

              <div className="form-group mt-3">
                <label htmlFor="firstReminder">First Reminder</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="firstReminder"
                  aria-describedby="emailHelp"
                  placeholder="Enter Name"
                  value={
                    allData.firstReminder
                  }
                  onChange={(e) => {
                    setAllData({
                      ...allData,
                      firstReminder: e.target.value
                    })
                  }}
                />

              </div>
              <div className="form-group  mt-3">
                <label htmlFor="secondReminder">Second Reminder</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="secondReminder"
                  placeholder="Enter Name"
                  value={
                    allData.secondReminder
                  }
                  onChange={(e) => {
                    setAllData({
                      ...allData,
                      secondReminder: e.target.value
                    })
                  }}
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="finalReminder">Final Reminder</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="finalReminder"
                  placeholder="Enter your email"
                  value={
                    allData.finalReminder
                  }
                  onChange={(e) => {
                    setAllData({
                      ...allData,
                      finalReminder: e.target.value
                    })
                  }}
                />
              </div>
              <div className="d-flex flex-row-reverse mt-5" style={{ gap: "4rem" }}>
                <button className="btn btn-primary" >Submit</button>
                <button className="btn btn-danger ml-3" onClick={() => {
                  setSteps('2')
                }}>Back</button>
              </div>
            </form>
          </div>
        ) : null
      }
      <ToastContainer />

    </div >
  );
};
export default ReminderSetting;
