const capitalizeSentence = (text) => {
  // Split the text into sentences using a regular expression
  const sentences = text.split(/(?<=[.!?])\s+/);

  // Capitalize the first letter of each sentence
  const capitalizedSentences = sentences.map(sentence => {
    // Trim whitespace and capitalize the first letter
    return sentence.charAt(0).toUpperCase() + sentence.slice(1).trim();
  });

  // Join the sentences back into a single string
  return capitalizedSentences.join(' ');
};

module.exports = { capitalizeSentence }