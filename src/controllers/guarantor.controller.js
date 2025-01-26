import GuarentorInfoModel from "../models/GuarentorInfo.model.js";

const createGuarantor = async (
  GuarantorName,
  GuarantorCNIC,
  GuarantorPhone
) => {
  if (!GuarantorName || !GuarantorCNIC || !GuarantorPhone) {
    return console.log("Please give complete details");
  }

  const guarantor = await GuarentorInfoModel.create({
    GuarantorName,
    GuarantorCNIC,
    GuarantorPhone,
  });

  return guarantor;
};

export { createGuarantor };
