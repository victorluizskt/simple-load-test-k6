import getCustomer from "./scenarios/getCustomer.js";
import { group, sleep } from "k6";

export default () => {
  group('Endpoint GetCustomer - Controller ... ?', () => {
    getCustomer();
  });

  sleep(1);
}

// vus = users
// k6 run index.js --vus 20 --duration 60s