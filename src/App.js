import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { setMetaData } from "./api/axios-service";
import Modal from "react-modal";
import Receipt from "./receipt";
import menu from "./store.json";

const holacashApiBaseUrl = "https://sandbox.api.holacash.mx/v2";

const HOLACASH_PUBLIC_KEY = process.env.REACT_APP_MERCHANT_PUBLIC_KEY;

function App() {
  const [setSelectedMenuItem] = useState({});
  const [orderId, setOrderId] = useState();
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    setMetaData();
  }, []);

  const [receiptVisible, setReceiptVisible] = useState(false);
  const [successResponse, setSuccessResponse] = useState("");

  const onChangeItem = (index) => {
    const item = menu[index];
    setSelectedMenuItem(item);
    generateOrder(item);
  };

  const generateOrder = async (item) => {
    setOrderLoading(true);
    try {
      const response = await axios.post(
        holacashApiBaseUrl + "/order",
        {
          order_total_amount: {
            amount: item.cost,
            currency_code: "MXN",
          },
          description: item.name,
        },
        {
          headers: {
            "X-Api-Client-Key": HOLACASH_PUBLIC_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);

      setOrderLoading(false);

      if (response?.data?.order_information?.order_id) {
        setOrderId(response?.data?.order_information?.order_id);
        console.log("ORDER ID:", response?.data?.order_information?.order_id);

        const callbacks = {
          onSuccess: (res) => {
            setSuccessResponse(JSON.parse(res));
            setReceiptVisible(true);
            console.log("onSuccess", JSON.parse(res));
          },

          onAbort: () => console.log("onAbort callback"),

          onError: (err) => console.log(JSON.stringify(err)),

          onEmailEntered: (email) => console.log(email),

          onCheckoutStart: () => console.log("checkout started"),
          
          check: () => {
            return true;
          },
        };

        // eslint-disable-next-line no-undef
        HolaCashCheckout.configure(
          {
            order_id: response?.data?.order_information?.order_id,
            hints: {
              first_name: "John",
              last_name: "Doe",
              second_last_name: "Doe",
              email: "john.doe@gmail.com",
              phone: "13212312412",
            },
          },
          callbacks
        );
      }
    } catch {
      setOrderLoading(false);
    }
  };


  // Dropdown Menu React Logic

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ paddingBottom: 0.5 + 'em' }}>
          <a className="App-link" target="_blank" rel="noopener noreferrer">
            Artesanias Mexicanas
          </a>
          <p>Selecciona tu artesania favorita</p>
        </div>

        {
          menu.map(obj =>
            <button key={obj.id.toString()} onClick={() => onChangeItem(obj.id)} style={{ paddingBottom: 0.5 + 'em' }} >
              <img src={obj.img} style={{ width: 240 + 'px' }}></img>
              <p>{obj.name} - ${obj.cost / 100}</p>
            </button>
          )
        }

        <div id="instant-holacash-checkout-button">
          <object
            id="checkout-button"
            data={`${holacashApiBaseUrl}/checkout/button?public_key=${HOLACASH_PUBLIC_KEY}`}
            data-disabled={orderLoading || !orderId}
          />
        </div>
      </header>
      <Modal isOpen={receiptVisible} className="receipt">
        <Receipt response={successResponse} />
        <div className="mx-auto text-center py-3">
          <button
            className="btn btn-dark mx-auto"
            onClick={() => {
              setReceiptVisible(false);
            }}
          >
            Listo!
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
