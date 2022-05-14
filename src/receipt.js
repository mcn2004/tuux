import React, { useState, useEffect } from "react";

const Receipt = ({ response }) => {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!response && !Object.keys(response).length) return;
    const responseAmount = response?.charge?.amount_details?.amount;
    if (responseAmount) {
      setAmount(Number(responseAmount) / 100);
    }
  }, [response]);

  if (!response || !Object.keys(response).length) return null;

  if (response?.status_details?.status === "success") {
    return (
      <>
        <h3>Payment receipt</h3>
        <table>
          <tr>
            <td>Transaction ID</td>
            <td>{response?.charge?.id}</td>
          </tr>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Status</td>
            <td>{response?.status_details?.status}</td>
          </tr>
          <tr>
            <td>Amount</td>
            <td>{amount}</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>{response?.charge?.description}</td>
          </tr>
        </table>
      </>
    );
  } else {
    return (
      <>
        <h3>Hi.</h3>
        <br></br>
        <h4>
          Your transaction has been processed from our end. Please visit the
          store to complete the transaction.
        </h4>
      </>
    );
  }
};

export default Receipt;
