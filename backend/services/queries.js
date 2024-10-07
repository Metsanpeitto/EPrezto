require('dotenv').config();
const { HfInference } = require('@huggingface/inference');

// Hugging Face API key
const HF_API_KEY = process.env.HF_API_KEY;
const hf = new HfInference(HF_API_KEY); // Store the key in .env

// Base custom query function for Hugging Face model
const queryLLM = async (prompt, parameters) => {
  try {
    const result = await hf.textGeneration({
      model: 'meta-llama/Llama-2-13b-chat-hf',
      inputs: prompt,
      parameters: parameters
    });

    const filteredResponse = result.generated_text.replace(prompt, '');
    return filteredResponse;
  } catch (error) {
    return error
  }
};

const queryLLMBase = async (query) => {
  const context = `Actúa como un agente de seguros de vehículos que responde en español. 
  En el caso de recibir una input que no parezca
  el numero placa de un vehiculo en formato 'AT3434, un nombre o un email.
  Usa esta espefica linea y no otra:
   'Por favor, digame el nombre del cliente, su email, o el numero de placa de el vehiculo'.`
  const prompt = `${context},Responde a la siguiente consulta sin repetir la pregunta:  ${query}`
  const parameters = {
    max_new_tokens: 300,
    temperature: 0.1,
    top_p: 0.9,
  }
  return await queryLLM(prompt, parameters);
}
// Specific query functions
const queryLLMSuggestion = async (query) => {
  const context = `Actúa como un agente de seguros de vehículos que responde en español acerca de un cliente que solicita la sugerencia de una accion a tomar para este caso concreto.`;
  const prompt = `${context} Que se podria hace en este caso: ${query}. Recuerda dar la respuesta en castellano, no en ingles y omitir cualquier introduccion. Da solo la sugerencia precedida de la query usada como input y acabar con la pregunta, Que deseas hacer ahora?`;
  const parameters = {
    max_new_tokens: 200,
    temperature: 0.2,
    top_p: 0.9,
  }
  return await queryLLM(prompt, parameters);
};

const queryLLMActionYesOrNo = async (query) => {
  const prompt = `Analiza este texto para saber si es una respuesta positiva o negativa: "${query}". Responde solo y exclusivamente "Si" o "No"`;
  const parameters = {
    max_new_tokens: 5,
    temperature: 0.1,
    top_p: 0.9
  }
  return await queryLLM(prompt, parameters);
};


module.exports = {
  queryLLMBase,
  queryLLMActionYesOrNo,
  queryLLMSuggestion
}