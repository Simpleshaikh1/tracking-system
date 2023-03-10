const OfferedJob = require('../models/offeredJob.model');
const Job = require('../models/Job.model');
const User = require('../models/User.model');



const OfferCreated = async (req, res) => {
  try {
    const { jobId, userId } = req.params;

    const job = await Job.findById(jobId);
    const user = await User.findById(userId);

    if (!job || !user) {
      return res.status(404).json({ message: 'can not find job or user' });
    }

    const offerExist = await OfferedJob.findOne({ jobId, userId });
    if (offerExist) {
      return res
        .status(400)
        .json({ message: 'Offer exists for this user' });
    }

    const offer = await OfferedJob.create({ jobId, userId });

    return res.status(200).json({ message: 'Offer sent', data: offer });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
};

const getAllUserOfferedJob = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const offeredJob = await OfferedJob.find({ userId: req.user })
      .skip(startIndex)
      .limit(limit);

    const totalOfferedJobs = await OfferedJob.countDocuments({ userId: req.user });
    const totalPages = Math.ceil(totalJobOffers / limit);

    if (offeredJob.length === 0) {
      return res.status(400).json({ message: 'No offer yet' });
    }

    return res.status(200).json({
      message: 'Your offered job',
      resultQuantity: offeredJob.length,
      data: offeredJob,
      pagination: {
        currentPage: page,
        totalPages,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

const acceptOffer = async (req, res) => {
  try {
    const { offerId } = req.params;

    const offer = await OfferedJob.findById(offerId);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    if (offer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No authorization access' });
    }

    offer.status = 'ACCEPTED';
    await offer.save();

    return res.status(200).json({ message: 'Offer accepted', data: offer });
  } catch (error) {
    
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
}


const OfferDecline = async (req, res) => {
  try {
    const offer = await OfferedJob.findById(req.params.offerId);

    if (!offer) {
      return res.status(404).json({
        message: "Job offer not found",
      });
    }

    const isAuthorized = offer.userId.equals(req.user._id);

    if (!isAuthorized) {
      return res.status(403).json({
        message: "No authorization access",
      });
    }

    offer.status = "DECLINED";
    await offer.save();

    return res.status(200).json({
      message: "Offer declined",
      data: offer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};


module.exports = {
    OfferCreated,
    getAllUserOfferedJob,   
    acceptOffer,
    OfferDecline
    };
