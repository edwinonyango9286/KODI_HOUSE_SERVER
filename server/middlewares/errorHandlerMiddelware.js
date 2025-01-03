const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: false,
    message: err?.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err?.stack,
  });
};

module.exports = { notFound, errorHandlerMiddleware };
