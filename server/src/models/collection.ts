import  { Schema,model } from "mongoose";
const collectionSchema = new Schema({
  owner : {
    type : Schema.Types.ObjectId,
    required : true,
    ref:"User"
  },
   name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50
    },

    description: {
      type: String,
      trim: true,
      maxLength: 300,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
collectionSchema.index({ owner: 1, name: 1 }, { unique: true });
const Collection =  model("Collection",collectionSchema);
export default Collection;
