import cors from "cors";

const whitelist = ["http://localhost:5003", "https://localhost:5003"];

const corsOptionDelegate = (req, callback) => {
  let corsOptions;

  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }

  callback(null, corsOptions);
};

export const mainCors = cors();
export const corsWithOptions = cors(corsOptionDelegate);
