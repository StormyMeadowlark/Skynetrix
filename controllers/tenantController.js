const Tenant = require("../models/Tenant");
exports.createTenant = async (req, res) => {
  try {
    const { name, contactEmail, verifiedSenderEmail } = req.body;

    // Normalize inputs
    const normalizedData = {
      name: name.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      verifiedSenderEmail: verifiedSenderEmail.trim().toLowerCase(),
    };

    // Check for existing tenants with the same name, contactEmail, or verifiedSenderEmail
    const existingTenant = await Tenant.findOne({
      $or: [
        { name: normalizedData.name },
        { contactEmail: normalizedData.contactEmail },
        { verifiedSenderEmail: normalizedData.verifiedSenderEmail },
      ],
    });

    if (existingTenant) {
      console.log("Conflicting Tenant Found:", existingTenant);
      const conflictField =
        existingTenant.name === normalizedData.name
          ? "name"
          : existingTenant.contactEmail === normalizedData.contactEmail
          ? "contactEmail"
          : "verifiedSenderEmail";

      return res.status(400).json({
        error: `Duplicate entry for field: ${conflictField}. A tenant with the same value already exists.`,
      });
    }

    // Generate a unique API key for the new tenant
    const apiKey = crypto.randomBytes(32).toString("hex");

    // Create and save the new tenant
    const tenant = new Tenant({
      ...normalizedData,
      apiKey,
    });

    await tenant.save();

    res.status(201).json({ tenant });
  } catch (error) {
    console.error("Error creating tenant:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate entry. Please ensure all fields are unique.",
        fields: error.keyValue, // This will show which field caused the duplicate error
      });
    }

    res.status(500).json({ error: "Server error" });
  }
};
exports.getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.status(200).json(tenants);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    res.status(500).json({ error: "Server error" });
  }
};
