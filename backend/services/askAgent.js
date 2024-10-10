require('dotenv').config();
const { BufferMemory } = require("langchain/memory");

const memory = new BufferMemory();

const customLLM = {
  call: async (input, queryFunction) => {
    const response = await queryFunction(input);
    return { text: response };
  },
};

class CustomConversationChain {
  constructor({ llm, memory }) {
    this.llm = llm;
    this.memory = memory;
  }

  async call({ input, queryFunction }) {
    const response = await this.llm.call(input, queryFunction);
    await this.memory.saveContext({ input }, { output: response.text });
    return response.text;
  }
}

const conversation = new CustomConversationChain({ llm: customLLM, memory });

const askAgent = async (input, queryFunction) => {
  const response = await conversation.call({ input, queryFunction });
  return response;
};

module.exports = { askAgent };