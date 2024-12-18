export const apiResponse = {
  success: (res, data, message = 'Success', status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data
    });
  },
  error: (res, message = 'Error', status = 400) => {
    return res.status(status).json({
      success: false,
      message
    });
  }
}; 