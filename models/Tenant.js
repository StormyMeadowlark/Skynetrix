const mongoose = require("mongoose");
const validator = require("validator");

const TenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    contactEmail: {
      type: String,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    verifiedSenderEmail: {type: String},
    sendGridApiKey: {type: String},
    contactPhone: {
      type: String,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    services: [
      {
        apiKey: {
          type: String,
          required: true,
          unique: true,
        },
        serviceType: {
          type: String,
          enum: ["CMS", "UserManagement"],
        },
      },
    ],
    subscriptionPlan: {
      type: String,
      enum: ["Basic", "Standard", "Premium"],
      default: "Basic",
    },
    subscriptionStatus: {
      type: String,
      enum: ["Active", "Suspended", "Cancelled"],
      default: "Active",
    },
    settings: {
      type: Object,
      default: {},
    },
    apiUsage: {
      type: Object,
      default: {
        requests: 0,
        dataStorage: 0, // in MB/GB
      },
    },
    lastActive: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Active",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Tenant = mongoose.model("Tenant", TenantSchema);
module.exports = Tenant;
