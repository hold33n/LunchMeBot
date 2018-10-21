const axios = require("axios");
const { baseURL } = require("./config");
const { token } = require("./config").poster;
const moment = require("moment");

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

const getDishesByCategoryName = async categoryName => {
  const categoriesRef = {
    method: "get",
    baseURL,
    url: "/menu.getCategories",
    params: {
      token
    }
  };

  const categoriesRes = await axios(categoriesRef);

  const { category_id } = categoriesRes.data.response.find(
    ({ category_name }) => category_name === categoryName
  );

  const productsRef = {
    method: "get",
    baseURL,
    url: "/menu.getProducts",
    params: {
      token,
      category_id
    }
  };

  productsRes = await axios(productsRef);

  return productsRes.data.response;
};

const getTablesForReservation = async lunchTime => {
  const tablesForReservationRef = {
    method: "get",
    baseURL,
    url: "/incomingOrders.getTablesForReservation",
    params: {
      date_reservation: moment()
        .hour(parseInt(lunchTime))
        .minute(+lunchTime.slice(3))
        .format("DD-MM-YYYY HH:mm"),
      token,
      spot_id: "1",
      duration: 1800,
      guests_count: 1
    }
  };

  res = await axios(tablesForReservationRef);

  return res.data.response.freeTables;
};

const createReservation = async (lunchTime, table_id) => {
  const createReservationRef = {
    method: "post",
    baseURL,
    url: "/incomingOrders.createReservation",
    params: {
      token
    },
    data: {
      date_reservation: moment()
        .hour(parseInt(lunchTime))
        .minute(+lunchTime.slice(3))
        .format("YYYY-MM-DD HH:mm:00"),
      spot_id: "1",
      table_id,
      duration: 1800,
      guests_count: 1,
      phone: "+380676467075"
    }
  };

  res = await axios(createReservationRef);

  return res.data.response;
};

const createIncomingOrder = async (lunchTime, table_id, products, sum) => {
  const createReservationRef = {
    method: "post",
    baseURL,
    url: "/incomingOrders.createIncomingOrder",
    params: {
      token
    },
    data: {
      spot_id: "1",
      phone: "+380676467075",
      comment: `Стол: ${table_id}\nВремя:${lunchTime}`,
      products: products.map(el => ({
        product_id: el,
        count: 1
      })),
      payment: {
        type: 1,
        currency: "UAH",
        sum
      }
    }
  };

  res = await axios(createReservationRef);

  console.log(res);

  return res.data.response;
};

const createOrder = async (lunchTime, products, sum) => {
  try {
    const freeTables = await getTablesForReservation(lunchTime);

    const { table_id } = await createReservation(
      lunchTime,
      freeTables[0].table_id
    );

    const createIncomingOrderRes = await createIncomingOrder(
      lunchTime,
      table_id,
      products,
      sum
    );

    return { table_id };
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  sleep,
  getDishesByCategoryName,
  getTablesForReservation,
  createOrder
};
