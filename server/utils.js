const axios = require("axios");
const { baseURL } = require("./config");
const { token } = require("./config").poster;

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

module.exports = {
  sleep,
  getDishesByCategoryName
};
