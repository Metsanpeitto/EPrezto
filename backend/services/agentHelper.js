const { customers } = require('../database/customers')
const { findInArray } = require('../utils/findInArray')
const { findKeyAndSiblings } = require('../utils/findKeyAndSiblings')
const { findValueByKey } = require('../utils/findValueByKey')
const { capitalizeSentence } = require('../utils/capitalizeSentence')

const fetchCustomerByPlate = async (plate) => {
  // Simulate fetching customer data from a mock database using the plate number
  const query = { keyQuery: 'Placa', value: plate }
  const policy = findCustomer(query)
  return policy;
};

const fetchCustomerByEmail = async (email) => {
  // Simulate fetching customer data from a mock database using the email
  const query = { keyQuery: 'email', value: email }
  const policy = findCustomer(query)
  return policy;
};

const fetchCustomerByName = async (name) => {
  // Simulate fetching customer data from a mock database using the name
  const query = { keyQuery: 'nombre', value: name }
  const policy = findCustomer(query)
  return policy;
};

const findCustomer = (query) => {
  const customer = findInArray(customers, query);
  const parentObject = findKeyAndSiblings(customer, 'status')
  const policyLink = findValueByKey(customer, 'url')
  const message = parentObject?.message
  const message2 = parentObject["create_monthly_payment_response"]?.message
  const clientPolicyStatus = parentObject?.status;

  if (customer) {
    if (clientPolicyStatus) {
      return { policyLink: policyLink, policyStatus: clientPolicyStatus, policyMessage: capitalizeSentence(`${message}.${message2}`) };
    }
    if (!clientPolicyStatus) {
      return { policyLink: policyLink, policyStatus: clientPolicyStatus, policyMessage: capitalizeSentence(`${message}.${message2}`) };
    }
  }
  if (!customer) {
    return { policyLink: null, policyStatus: false, policyMessage: null };
  }
}

const generatePolicyLink = async (policyId) => {
  // Generate a policy link based on the policy ID
  return `https://example.com/poliza/${policyId}`;
};

module.exports = { fetchCustomerByEmail, fetchCustomerByPlate, fetchCustomerByName, generatePolicyLink }