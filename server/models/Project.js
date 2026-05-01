const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['Admin', 'Member'],
          default: 'Member',
        },
      },
    ],
  },
  { timestamps: true }
);

// Ensure owner is added as Admin member before saving
projectSchema.pre('save', function (next) {
  if (this.isNew) {
    const ownerExists = this.members.some(
      (m) => m.user.toString() === this.owner.toString()
    );
    if (!ownerExists) {
      this.members.push({ user: this.owner, role: 'Admin' });
    }
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
