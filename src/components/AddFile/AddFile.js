import React, { useState, useEffect } from "react";
import "./AddFile.css";
import moment from 'moment';
import { GrAddCircle } from "react-icons/gr";
import { Document, Page, pdfjs } from "react-pdf";
import { postFile } from "../../services/addFile/FilesApi";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
export default function AddFile() {
  let id = useParams();
  let navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [files, setFiles] = useState("");
  const [formData, setFormData] = useState({});
  const [formData1, setFormData1] = useState({});
  const [formData2, setFormData2] = useState({});
  const [mainForm, setMainForm] = useState({});
  const [step, setStep] = useState(1);
  const [counter, setCounter] = useState(0);
  const [counter1, setCounter1] = useState(0);
  const [userId, setUserId] = useState("");
  const [checkFYE, setCheckFYE] = useState({});
  const [fyeDatecheck, setFyeDatecheck] = useState("");
  const [newDataArray, setNewDataArray] = useState([
    {
      name: "",
      id: "",
      nationality: "",
      addressChanged: "",
      sourceOfAddress: "",
      address: "",
      ordinaryNumber: "",
      currency: "",
    },
  ]);
  let formattedDate
  //   checkFYE?.FYEAsAtDateOfLastAR &&

  if (checkFYE?.FYEAsAtDateOfLastAR) {
    const currentDate = new Date(checkFYE?.FYEAsAtDateOfLastAR);
    currentDate.setDate(currentDate.getDate() + 1);
    formattedDate = currentDate.toISOString().substring(0, 10);
  }

  // const [month, day, year] =
  //   checkFYE?.FYEAsAtDateOfLastAR && checkFYE?.FYEAsAtDateOfLastAR.split("/");
  // const formattedDate =checkFYE?.FYEAsAtDateOfLastAR &&(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
  const [officers, setOfficers] = useState([
    {
      name: "",
      id: "",
      nationality: "",
      sourceOfAddress: "",
      dateOfAppointment: "",
      address: "",
      positionHeld: "",
    },
  ]);

  const handleSaveCounterInMainForm = () => {
    setMainForm({
      ...mainForm,
      shareholders: newDataArray,
    });
  };

  const handleSaveOfficers = () => {
    setMainForm({
      ...mainForm,
      officers: officers,
    });
  };

  const handleAddShareholder = () => {
    setCounter1(counter1 + 1);
  };
  // const handleAdd = () => {
  //     setCounter(counter + 1)
  // }
  const handleRemoveInput = () => {
    setCounter(counter - 1);
  };
  const handleRemoveShareholder = () => {
    setCounter1(counter1 - 1);
  };

  const fileUpload = (e) => {
    let file = e.target.files[0];
    setFiles(file);
  };
  const handleRenderSuccess = async (page) => {
    console.log("redering :;;;@@@@@@@@@@@");
    setFormData({});
    setFormData1({});
    setFormData2({});
    const text = await page.getTextContent();
    const getAllDetails = text.items.map((item) => item.str);
    const textData = getAllDetails.filter(
      (item) =>
        item.trim().length > 0 &&
        item.trim() !== ":" &&
        item.trim() !== "SAMPLE" &&
        item.trim() !== "Principal Activities"
    );
    console.log("text data :", textData);
    switch (page._pageIndex) {
      case 0:
        setTimeout(() => {
          setFormData({
            ...formData,
            uen: textData[[textData.indexOf("UEN") + 1]],
            companyName: textData[[textData.indexOf("Company Name.") + 1]],
            formerName: textData[[textData.indexOf("Former Name if any")]],
            incorporationDate:
              textData[[textData.indexOf("Incorporation Date.") + 1]],
            companyType: textData[[textData.indexOf("Company Type") + 1]],
            FYEAsAtDateOfLastAR:
              textData[
              [textData.indexOf("FYE As At Date of Last AR")] != -1
                ? [textData.indexOf("FYE As At Date of Last AR") + 1]
                : undefined
              ],
            status: textData[[textData.indexOf("Status") + 1]],
            statusDate: textData[[textData.indexOf("Status Date") + 1]],
            // principal activities
            activities1: textData[[textData.indexOf("Activities (I)") + 1]],
            Description1: textData[23 - 1],
            activities2: textData[[textData.indexOf("Description") + 1]],
            Description2: textData[[textData.indexOf("Activities (II)") + 1]],
            // capital
            issuedCapital: textData[[textData.indexOf("(AMOUNT)") + 1]],
            numberOfShares1: textData[[textData.indexOf("ORDINARY") + 1]],
            currency1: textData[32],

            shareType1:
              textData[[textData.indexOf("Issued Share Capital") + 6]],
            // number of shares includes number of treasury shares
            paidUpAmount: textData[[textData.indexOf("Paid-Up Capital") + 4]],
            numberOfShares2: getAllDetails[75],
            currency2: textData[[textData.indexOf("Paid-Up Capital") + 5]],
            shareType2: textData[[textData.indexOf("Paid-Up Capital") + 6]],
          });
          setCheckFYE({
            FYEAsAtDateOfLastAR:
              textData[
              [textData.indexOf("FYE As At Date of Last AR")] != -1
                ? [textData.indexOf("FYE As At Date of Last AR") + 1]
                : undefined
              ],
          });
        }, 1000);

        break;
      case 1:
        setTimeout(() => {
          setFormData1({
            ...formData1,
            // pages 2
            RegisteredOfficeAddress:
              textData[[textData.indexOf("Registered Office Address") + 1]],
            DateOfAddress: textData[[textData.indexOf("Date of Address") + 1]],
            DateOfLastAGM: textData[[textData.indexOf("Date of Last AGM") + 1]],
            DateOfLastAR: textData[[textData.indexOf("Date of Last AR") + 1]],
            FYEAsAtDateOfLastAR:
              textData[[textData.indexOf("FYE As At Date of Last AR")]],
            // auditFirms
            Name: textData[[textData.indexOf("Audit Firms") + 2]],
            // charges
            officersName1:
              textData[[textData.indexOf("Date of Appointment") + 1]],
            officersId1: textData[38],
            officersNationalityCitizenship1: textData[39],
            officersDateOfAppointment1: textData[40],
            officersSourceOfAddress1: textData[41],
            officersPositionHeld1: textData[42],
            officersAddress1: textData[43],
            officersName2:
              textData[[textData.indexOf("Date of Appointment") + 11]],
            officersId2:
              textData[[textData.indexOf("Date of Appointment") + 12]],
            officersNationalityCitizenship2:
              textData[[textData.indexOf("Date of Appointment") + 13]],
            officersDateOfAppointment2:
              textData[[textData.indexOf("Date of Appointment") + 14]],
            officersSourceOfAddress2:
              textData[[textData.indexOf("Date of Appointment") + 15]],
            officersPositionHeld2:
              textData[[textData.indexOf("Date of Appointment") + 16]],
            officersAddress2:
              textData[[textData.indexOf("Date of Appointment") + 17]],
            officersName3:
              textData[[textData.indexOf("Date of Appointment") + 19]],
            officersId3:
              textData[[textData.indexOf("Date of Appointment") + 20]],
            officersNationalityCitizenship3:
              textData[[textData.indexOf("Date of Appointment") + 21]],
            officersDateOfAppointment3:
              textData[[textData.indexOf("Date of Appointment") + 22]],
            officersSourceOfAddress3:
              textData[[textData.indexOf("Date of Appointment") + 23]],

            officersPositionHeld3:
              textData[[textData.indexOf("Date of Appointment") + 24]],
            officersAddress3:
              textData[[textData.indexOf("Date of Appointment") + 25]],
            officersName4: textData[[]],
            officersId4: textData[[]],
            officersNationalityCitizenship4: textData[[]],
            officersDateOfAppointment4: textData[[]],
            officersSourceOfAddress4: textData[[]],

            officersPositionHeld4: textData[[]],
            officersAddress4: textData[[]],
            officersName5: textData[[]],
            officersId5: textData[[]],
            officersNationalityCitizenship5: textData[[]],
            officersDateOfAppointment5: textData[[]],
            officersSourceOfAddress5: textData[[]],

            officersPositionHeld5: textData[[]],
            officersAddress5: textData[[]],
          });
          setFyeDatecheck(
            textData[[textData.indexOf("Registered Office Address") + 1]]
          );
        }, 1000);

        break;
      case 2:
        setTimeout(() => {
          setFormData2({
            ...formData2,
            // Shareholder(s)
            ShareholderName:
              textData[[textData.indexOf("Address Changed") + 1]],
            shareholderId: textData[[textData.indexOf("Address Changed") + 3]],
            shareholderNationality:
              textData[[textData.indexOf("Address Changed") + 4]],
            shareholderSourceOfAddress:
              textData[[textData.indexOf("Address Changed") + 5]],
            shareholderAddressChanged:
              textData[[textData.indexOf("Address Changed") + 6]],
            shareholderAddress: textData[22],
            shareholderOrdinaryNumber:
              textData[[textData.indexOf("Currency") + 1]],
            shareholderCurrency: textData[[textData.indexOf("Currency") + 2]],
            ShareholderName1:
              textData[[textData.indexOf("Address Changed") + 9]],
            shareholderId1:
              textData[[textData.indexOf("Address Changed") + 10]],
            shareholderNationality1:
              textData[[textData.indexOf("Address Changed") + 11]],
            shareholderSourceOfAddress1:
              textData[[textData.indexOf("Address Changed") + 13]],
            shareholderAddressChanged1:
              textData[[textData.indexOf("Address Changed") + 12]],
            shareholderAddress1:
              textData[[textData.indexOf("Address Changed") + 15]],
            shareholderOrdinaryNumber1:
              textData[[textData.indexOf("Address Changed") + 21]],
            shareholderCurrency1:
              textData[[textData.indexOf("Address Changed") + 22]],
            ShareholderName2: textData[[textData.indexOf("A Changed")]],
            shareholderId2: textData[[textData.indexOf("A Changed")]],
            shareholderNationality2: textData[[textData.indexOf("A Changed")]],
            shareholderSourceOfAddress2:
              textData[[textData.indexOf("A Changed")]],
            shareholderAddressChanged2:
              textData[[textData.indexOf("A Changed")]],
            shareholderAddress2: textData[15],
            shareholderOrdinaryNumber2:
              textData[[textData.indexOf("Currency")]],
            shareholderCurrency2: textData[[textData.indexOf("Currency")]],
            ShareholderName3: textData[[textData.indexOf(" ")]],
            shareholderId3: textData[[textData.indexOf(" ")]],
            shareholderNationality3: textData[[textData.indexOf(" ")]],
            shareholderSourceOfAddress3: textData[[textData.indexOf(" ")]],
            shareholderAddressChanged3: textData[[textData.indexOf(" ")]],
            shareholderAddress3: textData[15],
            shareholderOrdinaryNumber3: textData[[textData.indexOf("")]],
            shareholderCurrency3: textData[[textData.indexOf("")]],
            ShareholderName4: textData[[textData.indexOf("")]],
            shareholderId4: textData[[textData.indexOf("")]],
            shareholderNationality4: textData[[textData.indexOf("")]],
            shareholderSourceOfAddress4: textData[[textData.indexOf("")]],
            shareholderAddressChanged4: textData[[textData.indexOf("")]],
            shareholderAddress4: textData[15],
            shareholderOrdinaryNumber4: textData[[textData.indexOf("")]],
            shareholderCurrency4: textData[[textData.indexOf("")]],
          });
        }, 1000);

        break;
      default:
        break;
    }
  };


  useEffect(() => {
    if (formData && formData1 && formData2) {
      setMainForm({ ...formData, ...formData1, ...formData2 });
    }
  }, [formData, formData1, formData2]);
  useEffect(() => {
    if (localStorage.getItem("role") === "admin") {
      let userId = id;
      setUserId(userId);
    } else {
      let userId = localStorage.getItem("userId");
      setUserId(userId);
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredFormData = Object.keys(mainForm)
      .filter((key) => mainForm[key] !== undefined || mainForm[key] !== " ")
      .reduce((obj, key) => {
        obj[key] = mainForm[key];
        return obj;
      }, {});

    let payload = { filteredFormData, userId };
    postFile(payload)
      .then((res) => {
        localStorage.setItem("fileId", res.result._id);
        toast.success("Thank you your record added successfully", {
          position: toast.POSITION.TOP_CENTER,
          theme: "colored",
        });
        localStorage.setItem("isFunctionCalled", false);

        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error Occured", {
          position: toast.POSITION.TOP_CENTER,
          theme: "colored",
        });
      });
  };

  const handleChange = (e) => {
    setMainForm({ ...mainForm, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  });

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function handleNextPage() {
    console.log("next page ;", checkFYE);
    if (isNoFye === false && pageNumber == 2) {
      return alert("Please Fill the FYE field ");
    }
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
    setStep(step + 1);
  }

  function handlePrevPage() {
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
    setStep(step - 1);
  }
  console.log(
    "date files "
    // formData,
    // "form data 1",
    // formData1,
    // "form data 2",
    // formData2
    // formattedDate
  );
  const handleChangeFYE = (e) => {
    let selectedDate = new Date(e.target.value);
    selectedDate.setDate(selectedDate.getDate() - 1);
    setCheckFYE({

      ...checkFYE,
      FYEAsAtDateOfLastAR: selectedDate
    })
  }
  const isNoFye = formData1?.FYEAsAtDateOfLastAR?.trim() === '' && moment(formData1?.FYEAsAtDateOfLastAR, 'DD/MM/YYYY', true).isValid();
  console.log("is no fye:", isNoFye);


  // const isNoFye = formData1?.FYEAsAtDateOfLastAR?.trim() !== '' && formData1?.FYEAsAtDateOfLastAR?.trim() !== undefined && formData1?.FYEAsAtDateOfLastAR?.trim() !== null && formData1?.FYEAsAtDateOfLastAR?.trim().match(
  //   /(\d{1,2})\/(\d{1,2})\/(\d{4})/
  // ) === null

  console.log("is no fye :", isNoFye);
  return (
    <div>
      <span className="heading">
        <h4> ADD A SINGAPORE BIZEFILE</h4>
      </span>
      <input className="hid" id="file_data" type="file" onChange={fileUpload} />
      <div className="icone">
        <label className="for" htmlFor="file_data">
          <GrAddCircle />
        </label>
        {files ? <h6>File Added Successfully</h6> : null}
      </div>
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-5  col-lg-5 col-md-5 col-xl-5">
          <div>
            <h2>Section {pageNumber}</h2>
            <Document file={files} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={pageNumber}
                onRenderSuccess={handleRenderSuccess}
              />
            </Document>
            {files ? (
              <p>
                <button onClick={handlePrevPage} className="btn btn-primary">
                  Previous
                </button>
                &nbsp;
                <button onClick={handleNextPage} className="btn btn-success">
                  Next
                </button>
              </p>
            ) : null}
          </div>
        </div>
        {files && (
          <div className="col-5  col-lg-5 col-md-5 col-xl-5">
            {step === 1 && (
              <div className="row g-3 mt-5" id="add__form">
                <p>The Following Are The Brief Particulars of: </p>
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    UEN
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData.uen}
                    onChange={(e) =>
                      setFormData({ ...formData, uen: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    Company Name
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    Former Name if any
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData.formerName}
                    onChange={(e) =>
                      setFormData({ ...formData, formerName: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    Incorporation Date
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData.incorporationDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        incorporationDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    {" "}
                    Company Type
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData.companyType}
                    onChange={(e) =>
                      setFormData({ ...formData, companyType: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    Status
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    Status Date
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData.statusDate}
                    onChange={(e) =>
                      setFormData({ ...formData, statusDate: e.target.value })
                    }
                  />
                </div>
                <p>Principal Activities</p>
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    Activities (1)
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData.activities1}
                    onChange={(e) =>
                      setFormData({ ...formData, activities1: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    Description
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData.Description1}
                    onChange={(e) =>
                      setFormData({ ...formData, Description1: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    Activities (2)
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData.activities2}
                    onChange={(e) =>
                      setFormData({ ...formData, activities2: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    Description
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData.Description2}
                    onChange={(e) =>
                      setFormData({ ...formData, Description2: e.target.value })
                    }
                  />
                </div>
                <p>Capital</p>

                <div className="row">
                  <div className="col-md-4">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Issued Share Capital
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.issuedCapital}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          issuedCapital: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Number of Shares{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.numberOfShares1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          numberOfShares1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Currency
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.currency1}
                      onChange={(e) =>
                        setFormData({ ...formData, currency1: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                      File
                      Added
                      Successfully
                    >
                      Share Type
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.shareType1}
                      onChange={(e) =>
                        setFormData({ ...formData, shareType1: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-4">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Paid-Up Capital
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.paidUpAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paidUpAmount: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Number of Shares{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.numberOfShares2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          numberOfShares2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Currency
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.currency2}
                      onChange={(e) =>
                        setFormData({ ...formData, currency2: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Share Type
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.shareType2}
                      onChange={(e) =>
                        setFormData({ ...formData, shareType2: e.target.value })
                      }
                    />
                  </div>
                </div>
                {/* <button
                                            className="btn__next mt-3"
                                            onClick={() => setStep(2)}
                                        >Next</button> */}
              </div>
            )}
            {step === 2 && (
              <div className="row g-3 mt-5" id="add__form">
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    Registered Office Address
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData1.RegisteredOfficeAddress}
                    onChange={(e) =>
                      setFormData1({
                        ...formData1,
                        RegisteredOfficeAddress: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    Date Of Address
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData1.DateOfAddress}
                    onChange={(e) =>
                      setFormData1({
                        ...formData1,
                        DateOfAddress: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    Date Of Last AGM
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData1.DateOfLastAGM}
                    onChange={(e) =>
                      setFormData1({
                        ...formData1,
                        DateOfLastAGM: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    Date Of Last AR
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData1.DateOfLastAR}
                    onChange={(e) =>
                      setFormData1({
                        ...formData1,
                        DateOfLastAR: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputCity" className="form-label">
                    FYE As At Date Of Last AR
                  </label>
                </div>
                <div className="col-md-6">
                  <input type="text" className="form-control" id="inputCity"
                    value={formData1.FYEAsAtDateOfLastAR} onChange={
                      (e) => setFormData1({ ...formData1, FYEAsAtDateOfLastAR: e.target.value })
                    }
                  />
                </div>
                <p>Audit Firms</p>
                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Name{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.Name}
                      onChange={(e) =>
                        setFormData1({ ...formData1, Name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <p>Officers/Authorized Representative(s)</p>
                <div className="row mt-4">
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersName1}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          officersName1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersId1}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          officersId1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Citizenship
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersNationalityCitizenship1}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          officersNationalityCitizenship1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Source Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersSourceOfAddress1}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          officersSourceOfAddress1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      {" "}
                      Appointment
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersDateOfAppointment1}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          officersDateOfAppointment1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Position Held
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersPositionHeld1}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          officersPositionHeld1: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersAddress1}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          officersAddress1: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersName2}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          officersName2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersId2}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          officersId2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Citizenship
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersNationalityCitizenship2}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          officersNationalityCitizenship2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Source Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersSourceOfAddress2}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          officersSourceOfAddress2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Appointment
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersDateOfAppointment2}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          officersDateOfAppointment2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Position Held
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersPositionHeld2}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          officersPositionHeld2: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.officersAddress2}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* {
                                            formData1.officersName3 !== "" && formData1.officersId3 !== "" && formData1.officersNationalityCitizenship3 !== "" && formData1.officersSourceOfAddress3 !== "" && formData1.officersDateOfAppointment3 !== "" && formData1.officersPositionHeld3 !== "" && formData1.officersAddress3 !== "" ? */}
                <>
                  <div className="row mt-4">
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersName3}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersId3}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Citizenship
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersNationalityCitizenship3}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Source Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersSourceOfAddress3}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        {" "}
                        Appointment
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersDateOfAppointment3}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Position Held
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersPositionHeld3}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersAddress3}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
                {/* }
                                        {
                                            formData1.officersName4 !== undefined && formData1.officersId4 !== undefined && formData1.officersNationalityCitizenship4 !== undefined && formData1.officersSourceOfAddress4 !== undefined && formData1.officersDateOfAppointment4 !== undefined && formData1.officersPositionHeld4 !== undefined && formData1.officersAddress4 !== undefined ? */}
                <>
                  {/* <div className="row mt-4">
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Name</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersName4} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">ID</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersId4} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Citizenship</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersNationalityCitizenship4} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Source Address</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersSourceOfAddress4} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Appointment</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersDateOfAppointment4} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Position Held</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersPositionHeld4} onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-md-6">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Address</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersAddress4} onChange={handleChange}
                                                    />

                                                </div>
                                            </div> */}
                </>

                {/* }
                                        {
                                            formData1.officersName5 !== undefined && formData1.officersId5 !== undefined && formData1.officersNationalityCitizenship5 !== undefined && formData1.officersSourceOfAddress5 !== undefined && formData1.officersDateOfAppointment5 !== undefined && formData1.officersPositionHeld5 !== undefined && formData1.officersAddress5 !== undefined ? */}
                {/* <>
                                            <div className="row mt-4">
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Name</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersName5} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">ID</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersId5} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Citizenship</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersNationalityCitizenship5} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity"
                                                        className="form-label label__tag">Source Address</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersSourceOfAddress5} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag"> Appointment</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersDateOfAppointment5} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Position Held</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersPositionHeld5} onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-md-6">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Address</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData1.officersAddress5} onChange={handleChange}
                                                    />

                                                </div>
                                            </div>
                                        </> */}

                <div className="d-flex"></div>
                {Array.from({
                  length: counter,
                }).map((item, index) => {
                  return (
                    <div className="row mt-4">
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={officers.name}
                          onChange={(e) =>
                            setOfficers({ ...officers, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          ID
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={officers.id}
                          onChange={(e) =>
                            setOfficers({ ...officers, id: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Citizenship
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={officers.nationality}
                          onChange={(e) =>
                            setOfficers({
                              ...officers,
                              nationality: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Source Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={officers.sourceOfAddress}
                          onChange={(e) =>
                            setOfficers({
                              ...officers,
                              sourceOfAddress: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          {" "}
                          Appointment
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={officers.dateOfAppointment}
                          onChange={(e) =>
                            setOfficers({
                              ...officers,
                              dateOfAppointment: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Position Held
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={officers.positionHeld}
                          onChange={(e) =>
                            setOfficers({
                              ...officers,
                              positionHeld: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="row mt-2">
                        <div className="col-md-6">
                          <label
                            htmlFor="inputCity"
                            className="form-label label__tag"
                          >
                            Address
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="inputCity"
                            value={officers.address}
                            onChange={(e) =>
                              setOfficers({
                                ...officers,
                                address: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="d-flex">
                  <button
                    className="btn btn-primary mt-4"
                    onClick={handleSaveOfficers}
                  >
                    Add Officers
                  </button>
                  {counter > 0 && (
                    <button
                      className="btn btn-danger mt-4 ms-3"
                      onClick={handleRemoveInput}
                    >
                      Remove Officers
                    </button>
                  )}
                  <button
                    disabled={!counter}
                    className="btn btn-primary mt-4 ms-3"
                    onClick={handleAddShareholder}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="row g-3 mt-5" id="add__form">
                <p>Shareholder(s)</p>
                <div className="col-md-4">
                  <label htmlFor="inputCity" className="form-label label__tag">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData2.ShareholderName}
                    onChange={(e) =>
                      setFormData2({
                        ...formData2,
                        ShareholderName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <label htmlFor="inputCity" className="form-label label__tag">
                    ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData2.shareholderId}
                    onChange={(e) =>
                      setFormData2({
                        ...formData2,
                        shareholderId: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <label htmlFor="inputCity" className="form-label label__tag">
                    Natio/Citizenship
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData2.shareholderNationality}
                    onChange={(e) =>
                      setFormData2({
                        ...formData2,
                        shareholderNationality: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <label htmlFor="inputCity" className="form-label label__tag">
                    Source Of Addr
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData2.shareholderSourceOfAddress}
                    onChange={(e) =>
                      setFormData2({
                        ...formData2,
                        shareholderSourceOfAddress: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-2">
                  <label htmlFor="inputCity" className="form-label label__tag">
                    A Changed
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputCity"
                    value={formData2.shareholderAddressChanged}
                    onChange={(e) =>
                      setFormData2({
                        ...formData2,
                        shareholderAddressChanged: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="row mt-4">
                  <div className="col-md-6">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData2.shareholderAddress}
                      onChange={(e) =>
                        setFormData2({
                          ...formData2,
                          shareholderAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6"></div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-4">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Ordinary(Number)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData2.shareholderOrdinaryNumber}
                      onChange={(e) =>
                        setFormData2({
                          ...formData2,
                          shareholderOrdinaryNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Currency
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData2.shareholderCurrency}
                      onChange={(e) =>
                        setFormData2({
                          ...formData2,
                          shareholderCurrency: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                {/* {
                                            formData2.ShareholderName1 !== undefined &&
                                                formData2.shareholderId1 !== undefined ? */}
                <>
                  <div className="col-md-4">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData2.ShareholderName1}
                      onChange={(e) =>
                        setFormData2({
                          ...formData2,
                          ShareholderName1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData2.shareholderId1}
                      onChange={(e) =>
                        setFormData2({
                          ...formData2,
                          shareholderId1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Natio/Citizenship
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData2.shareholderNationality1}
                      onChange={(e) =>
                        setFormData2({
                          ...formData2,
                          shareholderNationality1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Source Of Addr
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData2.shareholderAddress1}
                      onChange={(e) =>
                        setFormData2({
                          ...formData2,
                          shareholderAddress1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      A Changed
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData2.shareholderAddressChanged1}
                      onChange={(e) =>
                        setFormData2({
                          ...formData2,
                          shareholderAddressChanged1: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="row mt-4">
                    <div className="col-md-6">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData2.shareholderAddress1}
                        onChange={(e) =>
                          setFormData2({
                            ...formData2,
                            shareholderAddress1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6"></div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-md-4">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Ordinary(Number)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData2.shareholderOrdinaryNumber1}
                        onChange={(e) =>
                          setFormData2({
                            ...formData2,
                            shareholderOrdinaryNumber1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Currency
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData2.shareholderCurrency1}
                        onChange={(e) =>
                          setFormData2({
                            ...formData2,
                            shareholderCurrency1: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </>
                <>
                  {/* <div className="col-md-4">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Name</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.ShareholderName2} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">ID</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderId2} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Natio/Citizenship</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderNationality2} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Source Of Addr</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderAddress2} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">A Changed</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderAddressChanged2} onChange={handleChange}
                                                        />
                                                    </div>

                                                    <div className="row mt-4">
                                                        <div className="col-md-6">
                                                            <label htmlFor="inputCity" className="form-label label__tag">Address</label>
                                                            <input type="text" className="form-control" id="inputCity"
                                                                value={formData2.shareholderAddress2} onChange={handleChange}
                                                            />
                                                        </div>
                                                        <div className="col-md-6"></div>

                                                    </div>

                                                    <div className="row mt-4">
                                                        <div className="col-md-4">
                                                            <label htmlFor="inputCity" className="form-label label__tag">Ordinary(Number)</label>
                                                            <input type="text" className="form-control" id="inputCity"
                                                                value={formData2.shareholderAddress2} onChange={handleChange}
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label htmlFor="inputCity" className="form-label label__tag">Currency</label>
                                                            <input type="text" className="form-control" id="inputCity"
                                                                value={formData2.shareholderAddress2} onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div> */}
                </>{" "}
                :
                {/* {
                                            formData2.shareholderName3 !== undefined &&
                                                formData2.id3 !== undefined ? */}
                <>
                  {/* <div className="col-md-4">
                                                <label htmlFor="inputCity" className="form-label label__tag">Name</label>
                                                <input type="text" className="form-control" id="inputCity"
                                                    value={formData2.ShareholderName3} onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="inputCity" className="form-label label__tag">ID</label>
                                                <input type="text" className="form-control" id="inputCity"
                                                    value={formData2.shareholderId3} onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="inputCity" className="form-label label__tag">Natio/Citizenship</label>
                                                <input type="text" className="form-control" id="inputCity"
                                                    value={formData2.shareholderNationality3} onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="inputCity" className="form-label label__tag">Source Of Addr</label>
                                                <input type="text" className="form-control" id="inputCity"
                                                    value={formData2.shareholderAddress3} onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="inputCity" className="form-label label__tag">A Changed</label>
                                                <input type="text" className="form-control" id="inputCity"
                                                    value={formData2.shareholderAddressChanged3} onChange={handleChange}
                                                />
                                            </div>

                                            <div className="row mt-4">
                                                <div className="col-md-6">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Address</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderAddress3} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-6"></div>

                                            </div>

                                            <div className="row mt-4">
                                                <div className="col-md-4">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Ordinary(Number)</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderAddress3} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Currency</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderAddress3} onChange={handleChange}
                                                    />
                                                </div>
                                            </div> */}
                </>
                {/* }
                                        {
                                            formData2.shareholderName4 !== undefined &&
                                                formData2.id4 !== undefined ? */}
                <>
                  {/* <div className="col-md-4">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Name</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.ShareholderName4} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">ID</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderId4} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Natio/Citizenship</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderNationality4} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Source Of Addr</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderAddress4} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">A Changed</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderAddressChanged4} onChange={handleChange}
                                                        />
                                                    </div>

                                                    <div className="row mt-4">
                                                        <div className="col-md-6">
                                                            <label htmlFor="inputCity" className="form-label label__tag">Address</label>
                                                            <input type="text" className="form-control" id="inputCity"
                                                                value={formData2.shareholderAddress4} onChange={handleChange}
                                                            />
                                                        </div>
                                                        <div className="col-md-6"></div>

                                                    </div>

                                                    <div className="row mt-4">
                                                        <div className="col-md-4">
                                                            <label htmlFor="inputCity" className="form-label label__tag">Ordinary(Number)</label>
                                                            <input type="text" className="form-control" id="inputCity"
                                                                value={formData2.shareholderAddress4} onChange={handleChange}
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label htmlFor="inputCity" className="form-label label__tag">Currency</label>
                                                            <input type="text" className="form-control" id="inputCity"
                                                                value={formData2.shareholderAddress4} onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div> */}
                </>
                <div className="d-flex"></div>
                {Array.from({ length: counter1 }).map((item, index) => {
                  return (
                    <div className="row mt-4">
                      <div className="col-md-4">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={newDataArray.name}
                          onChange={(e) =>
                            setNewDataArray({
                              ...newDataArray,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          ID
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={newDataArray.id}
                          onChange={(e) =>
                            setNewDataArray({
                              ...newDataArray,
                              id: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Natio/Citizenship
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={newDataArray.nationality}
                          onChange={(e) =>
                            setNewDataArray({
                              ...newDataArray,
                              nationality: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Source Of Addr
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={newDataArray.sourceOfAddress}
                          onChange={(e) =>
                            setNewDataArray({
                              ...newDataArray,
                              sourceOfAddress: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          A Changed
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={newDataArray.addressChanged}
                          onChange={(e) =>
                            setNewDataArray({
                              ...newDataArray,
                              addressChanged: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="row mt-4">
                        <div className="col-md-6">
                          <label
                            htmlFor="inputCity"
                            className="form-label label__tag"
                          >
                            Address
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="inputCity"
                            value={newDataArray.address}
                            onChange={(e) =>
                              setNewDataArray({
                                ...newDataArray,
                                address: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-6"></div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-md-6">
                          <label
                            htmlFor="inputCity"
                            className="form-label label__tag"
                          >
                            Ordinary(Number)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="inputCity"
                            value={newDataArray.ordinaryNumber}
                            onChange={(e) =>
                              setNewDataArray({
                                ...newDataArray,
                                ordinaryNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label
                            htmlFor="inputCity"
                            className="form-label label__tag"
                          >
                            Currency
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="inputCity"
                            value={newDataArray.currency}
                            onChange={(e) =>
                              setNewDataArray({
                                ...newDataArray,
                                currency: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="d-flex">
                  <button
                    className="btn btn-primary mt-4"
                    onClick={handleAddShareholder}
                  >
                    Add Shareholder
                  </button>

                  {counter1 > 0 && (
                    <button
                      className="btn btn-danger mt-4 ms-3"
                      onClick={handleRemoveShareholder}
                    >
                      Remove shareholder
                    </button>
                  )}
                  <button
                    disabled={!counter1}
                    className="btn btn-primary mt-4 ms-3"
                    onClick={handleSaveCounterInMainForm}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
            {step === 4 && (
              <>
                <div className="row g-3 mt-5" id="add__form">
                  <p>The Following Are The Brief Particulars of: </p>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      UEN
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.uen}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          uen: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Company Name
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Former Name if any
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.formerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          formerName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Incorporation Date
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.incorporationDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          incorporationDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      {" "}
                      Company Type
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.companyType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyType: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Status
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Status Date
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.statusDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          statusDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <p>Principal Activities</p>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Activities (1)
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.activities1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          activities1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Description
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.Description1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Description1: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Activities (2)
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.activities2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          activities2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Description
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData.Description2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          Description2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <p>Capital</p>

                  <div className="row">
                    <div className="col-md-4">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Issued Share Capital
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData.issuedCapital}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            issuedCapital: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-3">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Number of Shares{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData.numberOfShares1}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            numberOfShares1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-3">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Currency
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData.currency1}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currency1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Share Type
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData.shareType1}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shareType1: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-md-4">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Paid-Up Capital
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData.paidUpAmount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paidUpAmount: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-3">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Number of Shares{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData.numberOfShares2}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            numberOfShares2: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-3">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Currency
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData.currency2}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currency2: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Share Type
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData.shareType2}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shareType2: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Registered Office Address
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.RegisteredOfficeAddress}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          RegisteredOfficeAddress: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Date Of Address
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.DateOfAddress}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          DateOfAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Date Of Last AGM
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.DateOfLastAGM}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          DateOfLastAGM: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Date Of Last AR
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData1.DateOfLastAR}
                      onChange={(e) =>
                        setFormData1({
                          ...formData1,
                          DateOfLastAR: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      FYE As At Date Of Last AR
                    </label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      // value={formData1.FYEAsAtDateOfLastAR}
                      // onChange={(e) =>
                      //   setFormData1({
                      //     ...formData1,
                      //     FYEAsAtDateOfLastAR: e.target.value,
                      //   })
                      // }
                      value={checkFYE?.FYEAsAtDateOfLastAR}
                      onChange={(e) => {
                        if (isNoFye == false) {
                          alert("Please select FYE As At Date Of Last AR")
                        }
                        else {


                          // setFormData({
                          //   ...formData,
                          //   FYEAsAtDateOfLastAR: e.target.value,
                          // })
                          setCheckFYE({
                            ...checkFYE,
                            FYEAsAtDateOfLastAR: e.target.value,
                          })
                        }
                      }
                      }
                    />
                  </div>
                  <p>Audit Firms</p>
                  <div className="row">
                    <div className="col-md-12 col-lg-12">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Name{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.Name}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            Name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <p>Officers/Authorized Representative(s)</p>
                  <div className="row mt-4">
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersName1}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersName1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersId1}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersId1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Citizenship
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersNationalityCitizenship1}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersNationalityCitizenship1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Source Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersSourceOfAddress1}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersSourceOfAddress1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        {" "}
                        Appointment
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersDateOfAppointment1}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersDateOfAppointment1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Position Held
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersPositionHeld1}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersPositionHeld1: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersAddress1}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersAddress1: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersName2}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersName2: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersId2}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersId2: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Citizenship
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersNationalityCitizenship2}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersNationalityCitizenship2: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Source Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersSourceOfAddress2}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersSourceOfAddress2: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Appointment
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersDateOfAppointment2}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersDateOfAppointment2: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Position Held
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersPositionHeld2}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersPositionHeld2: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData1.officersAddress2}
                        onChange={(e) =>
                          setFormData1({
                            ...formData1,
                            officersAddress2: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* {
                                                formData1.officersName3 !== "" && formData1.officersId3 !== "" && formData1.officersNationalityCitizenship3 !== "" && formData1.officersSourceOfAddress3 !== "" && formData1.officersDateOfAppointment3 !== "" && formData1.officersPositionHeld3 !== "" && formData1.officersAddress3 !== "" ? */}
                  <>
                    <div className="row mt-4">
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={formData1.officersName3}
                          onChange={(e) =>
                            setFormData1({
                              ...formData1,
                              officersName3: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          ID
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={formData1.officersId3}
                          onChange={(e) =>
                            setFormData1({
                              ...formData1,
                              officersId3: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Citizenship
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={formData1.officersNationalityCitizenship3}
                          onChange={(e) =>
                            setFormData1({
                              ...formData1,
                              officersNationalityCitizenship3: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Source Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={formData1.officersSourceOfAddress3}
                          onChange={(e) =>
                            setFormData1({
                              ...formData1,
                              officersSourceOfAddress3: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          {" "}
                          Appointment
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={formData1.officersDateOfAppointment3}
                          onChange={(e) =>
                            setFormData1({
                              ...formData1,
                              officersDateOfAppointment3: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Position Held
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={formData1.officersPositionHeld3}
                          onChange={(e) =>
                            setFormData1({
                              ...formData1,
                              officersPositionHeld3: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={formData1.officersAddress3}
                          onChange={(e) =>
                            setFormData1({
                              ...formData1,
                              officersAddress3: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </>
                  {/* }
                                            {
                                                formData1.officersName4 !== undefined && formData1.officersId4 !== undefined && formData1.officersNationalityCitizenship4 !== undefined && formData1.officersSourceOfAddress4 !== undefined && formData1.officersDateOfAppointment4 !== undefined && formData1.officersPositionHeld4 !== undefined && formData1.officersAddress4 !== undefined ? */}
                  <>
                    {/* <div className="row mt-4">
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Name</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersName4} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">ID</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersId4} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Citizenship</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersNationalityCitizenship4} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Source Address</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersSourceOfAddress4} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Appointment</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersDateOfAppointment4} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Position Held</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersPositionHeld4} onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-md-6">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Address</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersAddress4} onChange={handleChange}
                                                        />

                                                    </div>
                                                </div> */}
                  </>
                  {/*

                                            }
                                            {
                                                formData1.officersName5 !== undefined && formData1.officersId5 !== undefined && formData1.officersNationalityCitizenship5 !== undefined && formData1.officersSourceOfAddress5 !== undefined && formData1.officersDateOfAppointment5 !== undefined && formData1.officersPositionHeld5 !== undefined && formData1.officersAddress5 !== undefined ? */}
                  <>
                    {/* <div className="row mt-4">
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Name</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersName5} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">ID</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersId5} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Citizenship</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersNationalityCitizenship5} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity"
                                                            className="form-label label__tag">Source Address</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersSourceOfAddress5} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag"> Appointment</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersDateOfAppointment5} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Position Held</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersPositionHeld5} onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-md-6">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Address</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData1.officersAddress5} onChange={handleChange}
                                                        />

                                                    </div>
                                                </div> */}
                  </>
                  {/* } */}
                  <p>Shareholder(s)</p>
                  <div className="col-md-4">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData2.ShareholderName}
                      onChange={(e) =>
                        setFormData2({
                          ...formData2,
                          ShareholderName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData2.shareholderId}
                      onChange={(e) =>
                        setFormData2({
                          ...formData2,
                          shareholderId: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Natio/Citizenship
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData2.shareholderNationality}
                      onChange={(e) =>
                        setFormData2({
                          ...formData2,
                          shareholderNationality: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      Source Of Addr
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData2.shareholderSourceOfAddress}
                      onChange={(e) =>
                        setFormData2({
                          ...formData2,
                          shareholderSourceOfAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputCity"
                      className="form-label label__tag"
                    >
                      A Changed
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      value={formData2.shareholderAddressChanged}
                      onChange={(e) =>
                        setFormData2({
                          ...formData2,
                          shareholderAddressChanged: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="row mt-4">
                    <div className="col-md-6">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData2.shareholderAddress}
                        onChange={(e) =>
                          setFormData2({
                            ...formData2,
                            shareholderAddress: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6"></div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-md-4">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Ordinary(Number)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData2.shareholderOrdinaryNumber}
                        onChange={(e) =>
                          setFormData2({
                            ...formData2,
                            shareholderOrdinaryNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Currency
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData2.shareholderCurrency}
                        onChange={(e) =>
                          setFormData2({
                            ...formData2,
                            shareholderCurrency: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* {
                                                formData2.ShareholderName1 !== undefined &&
                                                    formData2.shareholderId1 !== undefined ? */}
                  <>
                    <div className="col-md-4">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData2.ShareholderName1}
                        onChange={(e) =>
                          setFormData2({
                            ...formData2,
                            ShareholderName1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData2.shareholderId1}
                        onChange={(e) =>
                          setFormData2({
                            ...formData2,
                            shareholderId1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Natio/Citizenship
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData2.shareholderNationality1}
                        onChange={(e) =>
                          setFormData2({
                            ...formData2,
                            shareholderNationality1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        Source Of Addr
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData2.shareholderAddress1}
                        onChange={(e) =>
                          setFormData2({
                            ...formData2,
                            shareholderAddress1: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-2">
                      <label
                        htmlFor="inputCity"
                        className="form-label label__tag"
                      >
                        A Changed
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputCity"
                        value={formData2.shareholderAddressChanged1}
                        onChange={(e) =>
                          setFormData2({
                            ...formData2,
                            shareholderAddressChanged1: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="row mt-4">
                      <div className="col-md-6">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={formData2.shareholderAddress1}
                          onChange={(e) =>
                            setFormData2({
                              ...formData2,
                              shareholderAddress1: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6"></div>
                    </div>

                    <div className="row mt-4">
                      <div className="col-md-4">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Ordinary(Number)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={formData2.shareholderOrdinaryNumber1}
                          onChange={(e) =>
                            setFormData2({
                              ...formData2,
                              shareholderOrdinaryNumber1: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label
                          htmlFor="inputCity"
                          className="form-label label__tag"
                        >
                          Currency
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputCity"
                          value={formData2.shareholderCurrency1}
                          onChange={(e) =>
                            setFormData2({
                              ...formData2,
                              shareholderCurrency1: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </>
                  {/* }
                                            {
                                                formData2.shareholderName2 !== undefined &&
                                                    formData2.id2 !== undefined ? */}
                  <>
                    {/* <div className="col-md-4">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Name</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.ShareholderName2} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">ID</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderId2} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Natio/Citizenship</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderNationality2} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Source Of Addr</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderAddress2} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">A Changed</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderAddressChanged2} onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="row mt-4">
                                                    <div className="col-md-6">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Address</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderAddress2} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-6"></div>

                                                </div>

                                                <div className="row mt-4">
                                                    <div className="col-md-4">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Ordinary(Number)</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderAddress2} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Currency</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderAddress2} onChange={handleChange}
                                                        />
                                                    </div>
                                                </div> */}
                  </>
                  {/* }
                                            {
                                                formData2.shareholderName3 !== undefined &&
                                                    formData2.id3 !== undefined ? */}
                  <>
                    {/* <div className="col-md-4">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Name</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.ShareholderName3} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">ID</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderId3} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Natio/Citizenship</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderNationality3} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Source Of Addr</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderAddress3} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">A Changed</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderAddressChanged3} onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="row mt-4">
                                                    <div className="col-md-6">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Address</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderAddress3} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-6"></div>

                                                </div> */}

                    {/* <div className="row mt-4">
                                                    <div className="col-md-4">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Ordinary(Number)</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderAddress3} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Currency</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderAddress3} onChange={handleChange}
                                                        />
                                                    </div>
                                                </div> */}
                  </>
                  {/* }
                                            {
                                                formData2.shareholderName4 !== undefined &&
                                                    formData2.id4 !== undefined ? */}
                  <>
                    {/* <div className="col-md-4">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Name</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.ShareholderName4} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">ID</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderId4} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Natio/Citizenship</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderNationality4} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">Source Of Addr</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderAddress4} onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label htmlFor="inputCity" className="form-label label__tag">A Changed</label>
                                                    <input type="text" className="form-control" id="inputCity"
                                                        value={formData2.shareholderAddressChanged4} onChange={handleChange}
                                                    />
                                                </div> */}

                    {/* <div className="row mt-4">
                                                    <div className="col-md-6">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Address</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderAddress4} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-6"></div>

                                                </div> */}

                    {/* <div className="row mt-4">
                                                    <div className="col-md-4">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Ordinary(Number)</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderAddress4} onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="inputCity" className="form-label label__tag">Currency</label>
                                                        <input type="text" className="form-control" id="inputCity"
                                                            value={formData2.shareholderAddress4} onChange={handleChange}
                                                        />
                                                    </div>
                                                </div> */}
                  </>

                  <div className="mt-2">
                    <button className="btn__next" onClick={handleSubmit}>
                      Submit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="col-md-1"></div>
      </div>
      <ToastContainer />
    </div>
  );
}