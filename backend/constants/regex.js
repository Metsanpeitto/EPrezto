const plateRegex = /[a-zA-Z]{2}\d{4}/g;
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const nameRegex = /^[a - zA - Z]+$/g;
const questionRegex = /.*\?$/

module.exports = {
  plateRegex,
  emailRegex,
  nameRegex,
  questionRegex
}