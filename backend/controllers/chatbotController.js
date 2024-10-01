

// Mock customer data
const customers = [
  { plate: "AT3342", email: "customer1@example.com", hasPendingPayment: false },
  { plate: "AT3343", email: "customer2@example.com", hasPendingPayment: true },
];

const findCustomer = async (req, res) => {
  const { identifier } = req.body;
  const customer = customers.find(
    (c) => c.plate === identifier || c.email === identifier
  );

  let message = '';
  if (customer) {
    if (customer.hasPendingPayment) {
      message = 'There is a payment error. Please inform the customer to retry.';
    } else {
      message = `The policy has been successfully issued. Link: https://example.com/policy/${customer.plate}`;
    }
  } else {
    message = 'Customer not found. Please check the input.';
  }

  // Call OpenAI API (ChatGPT) to simulate LLM response
  try {
    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful support chatbot.' },
          { role: 'user', content: `Agent input: ${message}` },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ botMessage: gptResponse.data.choices[0].message.content });
  } catch (error) {
    console.error('Error calling ChatGPT API:', error.message);
    res.status(500).json({ error: 'Error communicating with ChatGPT' });
  }
}

module.exports = findCustomer;
