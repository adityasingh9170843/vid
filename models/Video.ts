import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export const VIDEO_DIMENSIONS = {
  width: 1920,
  height: 1080,
} as const;

export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videourl: string;
  thumbnailurl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videourl: {
      type: String,
      required: true,
    },
    thumbnailurl: {
      type: String,
      required: true,
    },
    controls: {
      type: Boolean,
      default: true,
    },
    transformation: {
      height: {
        type: Number,
        default: VIDEO_DIMENSIONS.height,
      },
      width: {
        type: Number,
        default: VIDEO_DIMENSIONS.width,
      },
      quality: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model<IVideo>("Video", videoSchema);

export default Video;