
    
const json = async (_statusCode, data, headers = {}) => {
    
        return {
          statusCode: _statusCode,
          body: JSON.stringify({
            statusCode: _statusCode,
            data
          }),
        };
    
      }
  module.exports = {

    success: async (data, code = 200) => {
      console.log("CODE", code)
      return await json(code, data);
    },
  
    error: async (data, code = 500) => {
      return await json(code, data);
    }
  
  }
  