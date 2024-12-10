import mongoose from "mongoose";

const connectToDB = async () => {
  const connectionUrl =
    "mongodb+srv://wa254549:auth@cluster0.hm29m.mongodb.net/";

  mongoose
    .connect(connectionUrl)
    .then(() => console.log("Auth Database connection established"))
    .catch((e) => console.log(e));
};

export default connectToDB;
