const paypal = require("@paypal/checkout-server-sdk");
const client_id = process.env.PAYPAL_CLIENT_ID;
const client_secret = process.env.PAYPAL_CLIENT_SECRET;
let environment = new paypal.core.SandboxEnvironment(client_id, client_secret);
let client = new paypal.core.PayPalHttpClient(environment);
let Courses = require("../model/course");
let Carts = require("../model/shoppingcart");
let Users = require("../model/user");
let RevenueSystem = require("../model/revenueSystem");
const RevenueCourse = require("../model/revenueCourse");
const handleId = (idStr) => {
  return (idArray = idStr.split("/"));
};
const handlePrice = (promotion, price) => {
  let curDate = new Date();
  let expireDate = new Date(promotion.expireDate);
  if (curDate > expireDate) {
    return Math.round(price * 100) / 100;
  } else {
    let prom = promotion.saleOffPercent;
    return Math.round((1 - prom) * price * 100) / 100;
  }
};
const handleCourseFee = (promotion, price) => {
  let curDate = new Date();
  let fee;
  let expireDate = new Date(promotion.expireDate);
  if (curDate > expireDate) {
    fee = 0.25 * price;
    return Math.round(fee * 100) / 100;
  } else {
    let prom = promotion.saleOffPercent;
    if (prom === 0.25) {
      fee = 0.25 * price;
      return Math.round(fee * 100) / 100;
    } else if (prom === 0.33) {
      fee = 0.2 * price;
      return Math.round(fee * 100) / 100;
    } else if (prom === 0.5) {
      fee = 0.15 * price;
      return Math.round(fee * 100) / 100;
    } else {
      fee = 0.1 * price;
      return Math.round(fee * 100) / 100;
    }
  }
};
const renderPayload = async (req, res, next) => {
  let { courseList } = req.body;
  let user = req.user;
  let array = courseList;

  const partA = array.map((item) => ({
    reference_id: `${user._id.toString()}/${item._id.toString()}`,
    amount: {
      currency_code: "USD",
      value:
        item.promotion.promotionArr.length > 0
          ? (
              handlePrice(
                item.promotion.promotionArr[
                  item.promotion.promotionArr.length - 1
                ],
                item.price
              ) -
              handleCourseFee(
                item.promotion.promotionArr[
                  item.promotion.promotionArr.length - 1
                ],
                handlePrice(
                  item.promotion.promotionArr[
                    item.promotion.promotionArr.length - 1
                  ],
                  item.price
                )
              )
            ).toFixed(2)
          : (item.price - 0.25 * item.price).toFixed(2),
      breakdown: {
        item_total: {
          currency_code: "USD",
          value:
            item.promotion.promotionArr.length > 0
              ? (
                  handlePrice(
                    item.promotion.promotionArr[
                      item.promotion.promotionArr.length - 1
                    ],
                    item.price
                  ) -
                  handleCourseFee(
                    item.promotion.promotionArr[
                      item.promotion.promotionArr.length - 1
                    ],
                    handlePrice(
                      item.promotion.promotionArr[
                        item.promotion.promotionArr.length - 1
                      ],
                      item.price
                    )
                  )
                ).toFixed(2)
              : (item.price - 0.25 * item.price).toFixed(2),
        },
      },
    },
    payee: {
      email_address: item.paymentAcc,
    },
    items: [
      {
        name: item.courseName,
        sku: item._id,
        unit_amount: {
          currency_code: "USD",
          value:
            item.promotion.promotionArr.length > 0
              ? (
                  handlePrice(
                    item.promotion.promotionArr[
                      item.promotion.promotionArr.length - 1
                    ],
                    item.price
                  ) -
                  handleCourseFee(
                    item.promotion.promotionArr[
                      item.promotion.promotionArr.length - 1
                    ],
                    handlePrice(
                      item.promotion.promotionArr[
                        item.promotion.promotionArr.length - 1
                      ],
                      item.price
                    )
                  )
                ).toFixed(2)
              : (item.price - 0.25 * item.price).toFixed(2),
        },
        quantity: "1",
      },
    ],
  }));
  let partB = array.map((item) => ({
    reference_id: `${item._id}`,
    amount: {
      currency_code: "USD",
      value:
        item.promotion.promotionArr.length > 0
          ? handleCourseFee(
              item.promotion.promotionArr[
                item.promotion.promotionArr.length - 1
              ],
              handlePrice(
                item.promotion.promotionArr[
                  item.promotion.promotionArr.length - 1
                ],
                item.price
              )
            ).toFixed(2)
          : (0.25 * item.price).toFixed(2),
    },
    payee: {
      email_address: "sb-063ri8185671@business.example.com",
    },
  }));
  const purchaseUnit = [...partA, ...partB];
  const payload = {
    intent: "CAPTURE",
    application_context: {
      return_url: `${process.env.REAL_SERVER_DOMAIN}/api/SubscribeCourse/success`,
      cancel_url: `${process.env.REAL_HOST_DOMAIN}`,
      brand_name: "HKT Online Learning",
      locale: "en-US",
      landing_page: "BILLING",
      user_action: "CONTINUE",
    },
    purchase_units: purchaseUnit,
  };
  req.payload = payload;
  next();
  // res.json(payload.purchase_units);
};
const payment = async (req, res, next) => {
  let payload = req.payload;
  let request = new paypal.orders.OrdersCreateRequest();
  request.headers["prefer"] = "return=representation";
  request.requestBody(payload);
  try {
    let response = await client.execute(request);
    for (let i = 0; i < response.result.links.length; i++) {
      if (response.result.links[i].rel === "approve") {
        res.json({
          status: "success",
          link: response.result.links[i].href,
        });
      }
    }
  } catch (error) {
    throw new Error("Something wrong!");
  }
};
const paymentsuccess = async (req, res, next) => {
  //console.log(req.query);
  var paymentId = req.query.token;
  try {
    request = new paypal.orders.OrdersCaptureRequest(paymentId);
    request.requestBody({});
    // Call API with your client and get a response for your call
    await client.execute(request);
    next();
  } catch (err) {
    console.error(JSON.stringify(error));
    res.status(400).json({
      status: "payment not successful",
      payment: {},
    });
  }
};
const getOrder = async (req, res, next) => {
  var paymentId = req.query.token;
  let getRequest = new paypal.orders.OrdersGetRequest(paymentId);
  await client.execute(getRequest).then((getResponse) => {
    req.paidInfo = getResponse.result.purchase_units;
    next();
  });
};
const handleAfterPayment = async (req, res, next) => {
  let paidInfo = req.paidInfo;
  await paidInfo.map(async (item) => {
    let arrId = handleId(item.reference_id);
    if (arrId.length === 2) {
      let revenueCourse = await RevenueCourse.findOne({
        fromCourse: arrId[1],
      });
      let user = await Users.findById(arrId[0]);
      let course = await Courses.findById(arrId[1]);
      let cart = await Carts.findOne({ buyer: arrId[0] });
      user.coursesStudying.push(arrId[1]);
      let registerAt = new Date();
      let student = arrId[0];
      course.courseStudentList.push({
        student,
        registerAt,
      });
      cart.listItem = [];
      revenueCourse.revenueCourse.push({
        payedForCourse: Number(item.amount.value),
        buyer: student,
        createAt: registerAt,
      });
      await revenueCourse.save();
      await user.save();
      await course.save();
      await cart.save();
    } else if (arrId.length === 1 && item.reference_id === arrId[0]) {
      let newRevenue = new RevenueSystem({
        fromCourse: arrId[0],
        courseFee: Number(item.amount.value),
      });
      await newRevenue.save();
    }
  });
  res.redirect(`${process.env.REAL_HOST_DOMAIN}/course`);
};
module.exports = {
  payment,
  paymentsuccess,
  getOrder,
  handleAfterPayment,
  renderPayload,
};
