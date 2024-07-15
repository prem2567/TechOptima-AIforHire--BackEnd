import Mail from "../models/mailModel.js";

export const createMail = async (req, res) => {
  try {
    const mail = new Mail(req.body);
    await mail.save();

    res.status(201).json(mail);
  } catch (error) {
    console.log("[ERROR_CREATE_MAIL]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getMails = async (req, res) => {
  try {
    let mails = await Mail.find();

    res.status(200).json(mails);
  } catch (error) {
    console.log("[ERROR_GET_MAILS]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getMail = async (req, res) => {
  try {
    let mail = await Mail.findById(req.params.mailId);
    if (!mail) {
      return res.status(400).json({ message: "Mail not found." });
    }

    res.status(200).json(mail);
  } catch (error) {
    console.log("[ERROR_GET_MAIL]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateMail = async (req, res) => {
  try {
    let mail = await Mail.findByIdAndUpdate(
      { _id: req.params.mailId },
      req.body,
      {
        new: true,
      }
    );
    if (!mail) {
      return res.status(400).json({ message: "Mail not found." });
    }

    res.status(200).json(mail);
  } catch (error) {
    console.log("[ERROR_UPDATE_MAIL]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const deleteMail = async (req, res) => {
  try {
    let mail = await Mail.findByIdAndDelete(req.params.mailId);
    if (!mail) {
      return res.status(400).json({ message: "Mail not found." });
    }

    res.status(200).json({ message: "Mail deleted." });
  } catch (error) {
    console.log("[ERROR_DELETE_MAIL]", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
