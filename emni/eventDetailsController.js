const eventDetails = require("../models/eventModel");
const cloudinary = require("../utils/cloudinary");

// POST METHOD
const eventDetailsController = async (req, res) => {
  try {
    const { venue, location, date, time } = req.body;
    const photos = req.files.photos;

    let photosArr = [];
    if (Array.isArray(photos)) {
      for (const photo of photos) {
        const result = await cloudinary.uploader.upload(photo.tempFilePath, {
          folder: "WeddingEvent",
        });

        photosArr.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    } else {
      const result = await cloudinary.uploader.upload(photos.tempFilePath, {
        folder: "WeddingEvent",
      });

      photosArr.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    const savedPost = await eventDetails.create({
      venue,
      location,
      date,
      time,
      photos: photosArr,
    });

    res.status(200).json({
      message: "added event details successfully",
      savedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};



module.exports = { eventDetailsController };
