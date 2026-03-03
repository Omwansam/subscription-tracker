const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than 0"],
      
    },

    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "KSH"],
      default: "KSH",
      uppercase: true,
    },

    billingCycle: {
      type: String,
      enum: ["daily","weekly","monthly", "yearly"],
      required: true,
    },

    paymentMethod: {
        type: String,
        enum: ["credit_card", "debit_card", "paypal", "bank_transfer", "mobile_money"],
        required: true,
        trim: true,

    },

    category: {
      type: String,
      enum: [
        "entertainment",
        "software",
        "fitness",
        "education",
        "other",
      ],
      default: "other",
    },

    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value >= new Date(),
        message: "Start date cannot be in the past",
      }
    },

    nextBillingDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          return value > this.startDate;
        },
        message: "Next billing date cannot be in the past",
      }
    },

    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

//Auto- Calculate renewal date if missing
subscriptionSchema.pre("save", function(next) {
  if (!this.nextBillingDate) {
    const billingCycleMap = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    const daysToAdd = billingCycleMap[this.billingCycle] || 30;
    this.nextBillingDate = new Date(this.startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  }
  // Auto-update the status if renewal date has passed
  if (this.nextBillingDate < new Date()) {
    this.status = "expired";
  }
  next();
});

module.exports = mongoose.model("Subscription", subscriptionSchema);