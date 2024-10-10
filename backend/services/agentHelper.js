const { customers } = require('../database/customers')
const { findInArray } = require('../utils/findInArray')
const { findKeyAndSiblings } = require('../utils/findKeyAndSiblings')
const { findValueByKey } = require('../utils/findValueByKey')
const { capitalizeSentence } = require('../utils/capitalizeSentence')

const fetchCustomerByPlate = async (plate) => {
  const query = { keyQuery: 'Placa', value: plate }
  const policy = findCustomer(query)
  return policy;
};

const fetchCustomerByEmail = async (email) => {
  const query = { keyQuery: 'user_email', value: email }
  const policy = findCustomer(query)
  return policy;
};

const fetchCustomerByName = async (name) => {
  const query = { keyQuery: 'nombre', value: name }
  const policy = findCustomer(query)
  return policy;
};

const findCustomer = (query) => {
  const customer = findInArray(customers, query);
  const parentObject = findKeyAndSiblings(customer, 'status')
  const policyLink = findValueByKey(customer, 'url')
  const message = parentObject?.message
  const message2 = parentObject ? parentObject["create_monthly_payment_response"]?.message : ''
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

module.exports = { fetchCustomerByEmail, fetchCustomerByPlate, fetchCustomerByName }