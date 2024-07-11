
module.exports = ({
  trace: (message) => {
    console.log(message)
  },
  error: (error) => {
    console.log(error)
  }
})