require('dotenv').config();
const { BufferMemory } = require("langchain/memory");

// Create a memory buffer for the conversation
const memory = new BufferMemory();

// Custom LLM function for LangChain
const customLLM = {
  call: async (input, queryFunction) => {
    const response = await queryFunction(input);
    return { text: response };
  },
};

// Manually pass the input/output structure to ConversationChain
class CustomConversationChain {
  constructor({ llm, memory }) {
    this.llm = llm;
    this.memory = memory;
  }

  async call({ input, queryFunction }) {
    const response = await this.llm.call(input, queryFunction);
    await this.memory.saveContext({ input }, { output: response.text });
    return response.text; // return the output text
  }
}

// Create the conversation using the custom chain
const conversation = new CustomConversationChain({ llm: customLLM, memory });

// Use the conversation chain
const askAgent = async (input, queryFunction) => {
  const response = await conversation.call({ input, queryFunction });
  return response;
};

module.exports = { askAgent };